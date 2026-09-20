/**
 * Document-keyed routing for Tecton toasts.
 *
 * ## Why this exists
 *
 * A toast viewport is a fixed-position stack in one corner of the page. Every
 * copy of `@tecton/react` mounts its own, and two of them land at identical
 * coordinates with their toasts drawn exactly on top of each other: one toast
 * is simply invisible, and one F6 press lands in whichever viewport registered
 * its shortcut last. That was measured; see
 * `docs/engineering/micro-frontends/analysis.md` F8 and F12, and §6 of
 * `mitigation-proposal.md`, which is the design this implements.
 *
 * So: one viewport per page, whoever raises the toast. The first `scope="root"`
 * provider publishes its viewport's add/remove through a record on `document`,
 * every copy's `useToast` routes through that record, and `scope="nested"`
 * providers render no viewport at all. The same shape as the root-ownership
 * registry (`./rootRegistry.ts`), and the same shape the upstream library uses
 * for its interaction-modality store, so it is a sanctioned pattern rather than
 * an invention.
 *
 * ## The payload is data, never a node
 *
 * An element created by copy A's React cannot be rendered by copy B's — the two
 * React instances do not recognise each other's element types. Everything that
 * crosses this bus is therefore plain data: strings, a kind, a duration and one
 * action descriptor with a callback. The publishing copy renders it with its
 * own components. That is a real constraint on Tecton's toast API rather than
 * an implementation detail, which is why `ToastPayload` has no `ReactNode` in
 * it anywhere.
 *
 * ## The contract
 *
 * The record is installed with `Object.defineProperty`, so it is non-writable
 * and non-configurable: whichever copy creates it owns it for the document's
 * lifetime, and its shape is a **permanent cross-version contract**. The key is
 * versioned (`tecton.toast/v1`), the record carries a `version`, and a copy
 * that finds a record it did not create uses it as it is.
 *
 * ## The rules
 *
 * - The **first** published viewport is the one that shows toasts. A second
 *   publisher (a second `scope="root"` provider) stands by; it takes over only
 *   if the first one leaves the page.
 * - A toast raised before any viewport exists is **queued**, and flushed in
 *   order when one publishes. Dismissing a queued toast drops it from the queue.
 * - A toast dismissed after it was shown is removed through the publisher that
 *   showed it.
 * - When the publisher that is showing a toast unmounts, its viewport goes with
 *   it; toasts that were on screen are gone, and only undelivered ones are
 *   handed to the next publisher. A viewport is a rendering surface, not a
 *   store.
 */

/**
 * The one action a toast may offer.
 *
 * Structurally identical to the public `ToastAction`, declared here as well so
 * this module depends on nothing — not React, not the components, not the
 * theme. It is the wire format between two independently built copies of
 * Tecton, and a wire format should not be able to drift by an import.
 */
export interface TectonToastActionData {
  label: string;
  onAction: () => void;
}

/** Everything a toast is, as data. See the note above on why it is not a node. */
export interface TectonToastData {
  title?: string;
  body: string;
  type?: 'info' | 'error';
  durationMs?: number;
  action?: TectonToastActionData;
}

/** What a published viewport can do. Called from any copy, as plain functions. */
export interface TectonToastViewport {
  /** Show this toast, under this id. */
  add(id: string, toast: TectonToastData): void;
  /** Take the toast with this id down again, if it is still up. */
  remove(id: string): void;
}

/** What `inspect()` reports. Development introspection, not a stable API. */
export interface TectonToastBusStats {
  /** Live publishers; the first is the one showing toasts. */
  publishers: number;
  /** Toasts raised while no viewport was published yet. */
  queued: number;
  /** Toasts handed to a viewport since the page loaded. */
  delivered: number;
}

/** The record stored on `document` under `Symbol.for('tecton.toast/v1')`. */
export interface TectonToastBus {
  /** Record shape version. Readers must tolerate a lower number than theirs. */
  readonly version: number;
  /** Publish a viewport; the returned function takes it away again. */
  publish(viewport: TectonToastViewport): () => void;
  /** Raise a toast; the returned function takes it down (idempotent). */
  show(toast: TectonToastData): () => void;
  /** Development introspection. Optional: an older record may not have it. */
  inspect?(): TectonToastBusStats;
}

const BUS_KEY = Symbol.for('tecton.toast/v1');

/** The shape version this copy of Tecton creates. */
export const TOAST_BUS_VERSION = 1;

type BusHost = Document & {[BUS_KEY]?: TectonToastBus};

function createBus(): TectonToastBus {
  /** Publishers in mount order; `publishers[0]` is the active viewport. */
  const publishers: TectonToastViewport[] = [];
  /** Raised, not yet handed to a viewport. */
  const queue: {id: string; toast: TectonToastData}[] = [];
  /** Which viewport is showing each live toast, so it can be removed there. */
  const shownBy = new Map<string, TectonToastViewport>();

  let nextId = 0;
  let delivered = 0;

  const deliver = (id: string, toast: TectonToastData): void => {
    const viewport = publishers[0];
    if (!viewport) {
      queue.push({id, toast});
      return;
    }
    shownBy.set(id, viewport);
    delivered += 1;
    viewport.add(id, toast);
  };

  const flush = (): void => {
    const pending = queue.splice(0, queue.length);
    for (const entry of pending) deliver(entry.id, entry.toast);
  };

  return {
    version: TOAST_BUS_VERSION,

    publish(viewport: TectonToastViewport): () => void {
      publishers.push(viewport);
      if (publishers[0] === viewport) flush();

      let released = false;
      return () => {
        if (released) return;
        released = true;
        const index = publishers.indexOf(viewport);
        if (index !== -1) publishers.splice(index, 1);
        // Toasts this viewport was showing went with its React tree.
        for (const [id, shown] of shownBy) {
          if (shown === viewport) shownBy.delete(id);
        }
        if (publishers.length > 0) flush();
      };
    },

    show(toast: TectonToastData): () => void {
      const id = `tecton-toast-${(nextId += 1)}`;
      deliver(id, toast);

      let dismissed = false;
      return () => {
        if (dismissed) return;
        dismissed = true;
        const queued = queue.findIndex(entry => entry.id === id);
        if (queued !== -1) {
          queue.splice(queued, 1);
          return;
        }
        const viewport = shownBy.get(id);
        shownBy.delete(id);
        viewport?.remove(id);
      };
    },

    inspect(): TectonToastBusStats {
      return {publishers: publishers.length, queued: queue.length, delivered};
    },
  };
}

/**
 * The bus for this document, creating it on first use.
 *
 * Returns `null` during server rendering, and `null` if the document carries a
 * record this copy cannot use — in which case a toast is dropped rather than
 * thrown, because a notification is not worth an exception.
 */
export function getToastBus(
  ownerDocument: Document | undefined = typeof document === 'undefined'
    ? undefined
    : document,
): TectonToastBus | null {
  if (!ownerDocument) return null;
  const host = ownerDocument as BusHost;

  const existing = host[BUS_KEY];
  if (existing) {
    return typeof existing.publish === 'function' &&
      typeof existing.show === 'function'
      ? existing
      : null;
  }

  const bus = createBus();
  try {
    Object.defineProperty(host, BUS_KEY, {value: bus});
  } catch {
    // Another copy won the race between the read and the write: use theirs.
    const winner = host[BUS_KEY];
    return winner && typeof winner.publish === 'function' ? winner : null;
  }
  return bus;
}

/**
 * Publish a viewport for the page. Returns the function that takes it away;
 * a no-op when there is no document to publish into.
 */
export function publishToastViewport(
  viewport: TectonToastViewport,
): () => void {
  const bus = getToastBus();
  if (!bus) return () => {};
  return bus.publish(viewport);
}

/**
 * Raise a toast through whichever viewport the page has. Returns the function
 * that takes it down again.
 */
export function routeToast(toast: TectonToastData): () => void {
  const bus = getToastBus();
  if (!bus) return () => {};
  return bus.show(toast);
}
