/**
 * Document-keyed ownership of the two attributes Tecton needs on `<html>`.
 *
 * ## Why this exists
 *
 * The theme provider underneath Tecton writes `data-theme` and
 * `data-astryx-theme` onto `document.documentElement` when it mounts, and
 * removes both, unconditionally and without a ref count, when it unmounts.
 * With one application on the page that is correct. With several independently
 * built copies of `@tecton/react` — the micro-frontend case — it is not: the
 * first container to unmount strips the attributes for everybody, the page
 * canvas and browser chrome fall back to the operating-system colour scheme,
 * and any overlay that could not stay inside its own theme wrapper drops to
 * the upstream defaults instead of Tecton's. That was measured; see
 * `docs/engineering/micro-frontends/analysis.md` §3 and §12.1.
 *
 * A wrapper package cannot stop those writes. What it can do is own the
 * outcome: keep the authoritative state in a `Symbol.for`-keyed record on
 * `document`, which every copy of Tecton on the page reaches, and reconcile
 * the DOM back to it with a `MutationObserver`. The upstream library already
 * uses exactly this shape for its interaction-modality store, so it is a
 * sanctioned pattern rather than an invention.
 *
 * ## The contract
 *
 * The record is installed with `Object.defineProperty`, so it is non-writable
 * and non-configurable: whichever copy creates it owns it for the document's
 * lifetime, and its shape is a **permanent cross-version contract**. Two rules
 * follow, and both are implemented here:
 *
 * - the key is versioned (`tecton.rootOwnership/v1`) and the record carries a
 *   `version` field;
 * - a copy that finds a record it did not create uses it as it is, including a
 *   record older than its own. Never replace, never upgrade in place.
 *
 * ## The rules
 *
 * - The **first owning claim** decides what `<html>` says. A later owning claim
 *   that disagrees logs one development warning and does not take over: a
 *   container that mounts second must not restyle the page chrome out from
 *   under one that was already there.
 * - A **non-owning claim** (`owning: false`, what `scope="nested"` takes) only
 *   holds the attributes alive. It never chooses them.
 * - While any claim is live, a write to either attribute that disagrees with
 *   the desired state is reverted and counted. Observer callbacks run at the
 *   microtask checkpoint, before paint, so nothing flashes.
 * - When the **last** claim is released the observer is disconnected and both
 *   attributes are removed, so a page that unmounts every container is left
 *   clean.
 *
 * What it cannot do: stop the first write (there is a one-microtask window in
 * which a synchronous reader sees the wrong value), or coordinate with a
 * non-Tecton consumer of the same upstream library on the same page.
 */

/**
 * Colour mode as the registry sees it. Structurally identical to the public
 * `TectonColorMode`, duplicated deliberately so this module depends on nothing
 * — not React, not the theme, not the provider.
 */
export type TectonRootMode = 'dark' | 'light' | 'system';

/** One claim on the document root. */
export interface TectonRootClaim {
  /** Theme name to keep on `<html data-astryx-theme>`. */
  themeName: string;
  /** Mode to keep on `<html data-theme>`; `'system'` removes the attribute. */
  mode: TectonRootMode;
  /** Non-owning claims keep the attributes alive but do not choose them. */
  owning: boolean;
}

/** What `inspect()` reports. Development introspection, not a stable API. */
export interface TectonRootRegistryStats {
  /** Live claims, owning and non-owning. */
  holders: number;
  /** The claim currently deciding the attributes, if any. */
  desired: TectonRootClaim | null;
  /** How many foreign writes have been reverted. */
  reassertions: number;
}

/**
 * The record stored on `document` under
 * `Symbol.for('tecton.rootOwnership/v1')`.
 */
export interface TectonRootRegistry {
  /** Record shape version. Readers must tolerate a lower number than theirs. */
  readonly version: number;
  /** Join the registry; the returned function releases the claim (idempotent). */
  acquire(claim: TectonRootClaim): () => void;
  /** Development introspection. Optional: an older record may not have it. */
  inspect?(): TectonRootRegistryStats;
}

const REGISTRY_KEY = Symbol.for('tecton.rootOwnership/v1');

/** The shape version this copy of Tecton creates. */
export const ROOT_REGISTRY_VERSION = 1;

const MODE_ATTRIBUTE = 'data-theme';
const THEME_ATTRIBUTE = 'data-astryx-theme';

type RegistryHost = Document & {[REGISTRY_KEY]?: TectonRootRegistry};

/**
 * Declared here so this module type-checks against the DOM library alone — it
 * is browser code, not Node code. The literal `process.env.NODE_ENV` is what a
 * bundler substitutes when it builds a production bundle, so the whole warning
 * drops out of one; the `typeof` guard is what keeps it safe in a page that
 * never had a `process` at all.
 */
declare const process: {env: {NODE_ENV?: string}} | undefined;

function isDevelopment(): boolean {
  return (
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    typeof console !== 'undefined'
  );
}

function sameClaim(a: TectonRootClaim, b: TectonRootClaim): boolean {
  return a.themeName === b.themeName && a.mode === b.mode;
}

function createRegistry(ownerDocument: Document): TectonRootRegistry {
  const root = ownerDocument.documentElement;
  /** Insertion-ordered: the first owning entry is the one that decides. */
  const holders = new Map<object, TectonRootClaim>();

  let desired: TectonRootClaim | null = null;
  let observer: MutationObserver | null = null;
  let applying = false;
  let reassertions = 0;
  let warnedAboutDisagreement = false;

  const modeAttributeFor = (claim: TectonRootClaim): string | null =>
    claim.mode === 'light' || claim.mode === 'dark' ? claim.mode : null;

  /**
   * The first still-live owning claim decides. With no owning claim left but
   * other holders still on the page, the last decision stands: non-owning
   * claims keep the attributes alive rather than blanking them.
   */
  const recompute = (): void => {
    if (holders.size === 0) {
      desired = null;
      return;
    }
    for (const claim of holders.values()) {
      if (claim.owning) {
        desired = claim;
        return;
      }
    }
  };

  const matchesDom = (): boolean => {
    if (!desired) {
      return (
        !root.hasAttribute(MODE_ATTRIBUTE) &&
        !root.hasAttribute(THEME_ATTRIBUTE)
      );
    }
    return (
      root.getAttribute(THEME_ATTRIBUTE) === desired.themeName &&
      root.getAttribute(MODE_ATTRIBUTE) === modeAttributeFor(desired)
    );
  };

  const apply = (): void => {
    applying = true;
    try {
      if (!desired) {
        root.removeAttribute(MODE_ATTRIBUTE);
        root.removeAttribute(THEME_ATTRIBUTE);
        return;
      }
      const mode = modeAttributeFor(desired);
      if (mode === null) {
        root.removeAttribute(MODE_ATTRIBUTE);
      } else {
        root.setAttribute(MODE_ATTRIBUTE, mode);
      }
      root.setAttribute(THEME_ATTRIBUTE, desired.themeName);
    } finally {
      applying = false;
    }
  };

  const startObserving = (): void => {
    if (observer || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(() => {
      // `applying` suppresses the observer's own writes; `matchesDom` ignores a
      // write that happens to agree with us — the common case, which is the
      // upstream provider setting exactly what we already want.
      if (applying || holders.size === 0 || matchesDom()) return;
      reassertions += 1;
      apply();
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: [MODE_ATTRIBUTE, THEME_ATTRIBUTE],
    });
  };

  const warnOnDisagreement = (claim: TectonRootClaim): void => {
    if (!desired || sameClaim(desired, claim) || warnedAboutDisagreement)
      return;
    warnedAboutDisagreement = true;
    if (!isDevelopment()) return;
    console.warn(
      '[tecton] Two page-level Tecton providers disagree about the document ' +
        `root. Keeping the first claim (themeName="${desired.themeName}", ` +
        `mode="${desired.mode}") and ignoring the later one ` +
        `(themeName="${claim.themeName}", mode="${claim.mode}"). ` +
        'Pass scope="nested" to providers that are not the page root, or ' +
        'call configureTectonRoot() from the host shell to decide this ' +
        'explicitly.',
    );
  };

  return {
    version: ROOT_REGISTRY_VERSION,

    acquire(claim: TectonRootClaim): () => void {
      const entry: TectonRootClaim = {
        themeName: claim.themeName,
        mode: claim.mode,
        owning: claim.owning !== false,
      };
      if (entry.owning) warnOnDisagreement(entry);

      const token = {};
      holders.set(token, entry);
      recompute();
      startObserving();
      apply();

      let released = false;
      return () => {
        if (released) return;
        released = true;
        holders.delete(token);
        recompute();
        if (holders.size === 0) {
          observer?.disconnect();
          observer = null;
        }
        apply();
      };
    },

    inspect(): TectonRootRegistryStats {
      return {holders: holders.size, desired, reassertions};
    },
  };
}

/**
 * The registry for this document, creating it on first use.
 *
 * Returns `null` during server rendering, and `null` if the document already
 * carries a record this copy cannot use — in which case Tecton degrades to the
 * behaviour it had before the registry existed rather than fighting it.
 */
export function getRootRegistry(
  ownerDocument: Document | undefined = typeof document === 'undefined'
    ? undefined
    : document,
): TectonRootRegistry | null {
  if (!ownerDocument) return null;
  const host = ownerDocument as RegistryHost;

  const existing = host[REGISTRY_KEY];
  if (existing) {
    // A record from another copy of Tecton, possibly an older version of this
    // module. Its `acquire` is the whole contract; use it as it is.
    return typeof existing.acquire === 'function' ? existing : null;
  }

  const registry = createRegistry(ownerDocument);
  try {
    Object.defineProperty(host, REGISTRY_KEY, {value: registry});
  } catch {
    // Another copy won the race and installed a non-configurable record
    // between the read and the write: use theirs.
    const winner = host[REGISTRY_KEY];
    return winner && typeof winner.acquire === 'function' ? winner : null;
  }
  return registry;
}

/**
 * Claim the document root.
 *
 * Returns the release function, or a no-op when there is no document (server
 * rendering) or the page carries a record this copy cannot use.
 */
export function claimRoot(claim: TectonRootClaim): () => void {
  const registry = getRootRegistry();
  if (!registry) return () => {};
  return registry.acquire(claim);
}
