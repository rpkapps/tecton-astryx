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
 * So: one viewport per page, whoever raises the toast. A provider publishes its
 * viewport's add/remove through a record on `document` and every copy's
 * `useToast` routes through that record. Which provider publishes is the bus's
 * decision: a `scope="root"` provider always does, and on a page that has no
 * root provider at all the first `scope="nested"` provider stands in for it
 * (see "The rules" below). Every other provider renders no viewport. The same
 * shape as the root-ownership registry (`./rootRegistry.ts`), and the same
 * shape the upstream library uses for its interaction-modality store, so it is
 * a sanctioned pattern rather than an invention.
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
 * - The **first** published *owning* viewport is the one that shows toasts. A
 *   second publisher (a second `scope="root"` provider) stands by; it takes
 *   over only if the first one leaves the page.
 * - **A page with no owning viewport is not a page without toasts.** The
 *   recommended host shape — a non-React shell calling `configureTectonRoot()`
 *   and every container mounting `scope="nested"` — has no `scope="root"`
 *   provider anywhere, and toasts used to queue for ever in it. So a nested
 *   provider *asks* the bus whether the page needs a viewport
 *   (`requestStandIn`), and the first one to ask publishes a **stand-in**
 *   viewport: a non-owning publisher, one per page, that shows everyone's
 *   toasts until a `scope="root"` provider turns up. A stand-in claims nothing
 *   else — not the root attributes, not the layer context its children see.
 * - **The hand-over is the bus's decision, not a race.** The moment an owning
 *   viewport publishes, the stand-in is told it is no longer needed and takes
 *   its viewport down, so there is still exactly one viewport on the page.
 *   If the owning viewport later leaves, the bus asks for a stand-in again.
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

/** How a viewport is published. */
export interface TectonToastPublishOptions {
  /**
   * Whether this viewport claims the page's toast surface.
   *
   * `true` (the default) is a `scope="root"` provider: it owns the surface for
   * as long as it is mounted. `false` is a **stand-in** — a nested provider
   * covering for a page that has no owner — which steps aside as soon as an
   * owning viewport publishes.
   */
  owning?: boolean;
}

/** What `inspect()` reports. Development introspection, not a stable API. */
export interface TectonToastBusStats {
  /** Live publishers, owning and stand-in; the active one shows toasts. */
  publishers: number;
  /** Toasts raised while no viewport was published yet. */
  queued: number;
  /** Toasts handed to a viewport since the page loaded. */
  delivered: number;
  /** Owning publishers. Absent on a record older than version 2. */
  owners?: number;
  /** Nested providers offering to stand in. Absent before version 2. */
  standInRequests?: number;
  /** Whether a stand-in is the viewport showing toasts. Absent before v2. */
  standingIn?: boolean;
}

/** The record stored on `document` under `Symbol.for('tecton.toast/v1')`. */
export interface TectonToastBus {
  /** Record shape version. Readers must tolerate a lower number than theirs. */
  readonly version: number;
  /**
   * Publish a viewport; the returned function takes it away again.
   *
   * A record created by version 1 of this shape ignores the options and treats
   * every publisher as owning, which is why a stand-in is only ever offered
   * through {@link TectonToastBus.requestStandIn} — a method version 1 does
   * not have.
   */
  publish(
    viewport: TectonToastViewport,
    options?: TectonToastPublishOptions,
  ): () => void;
  /**
   * Offer to publish a stand-in viewport for a page that has no owning one.
   *
   * The listener is called with `true` when this caller is the one the bus
   * wants a viewport from, and with `false` when it is not needed any more —
   * either because an owning viewport published, or because an earlier
   * stand-in request is doing the job. It is called synchronously on
   * registration when the answer is already `true`, and never called with the
   * value it last reported.
   *
   * Optional: a record created by version 1 of this shape does not have it,
   * and a caller that finds it missing simply never stands in.
   */
  requestStandIn?(listener: (needed: boolean) => void): () => void;
  /** Raise a toast; the returned function takes it down (idempotent). */
  show(toast: TectonToastData): () => void;
  /** Development introspection. Optional: an older record may not have it. */
  inspect?(): TectonToastBusStats;
}

const BUS_KEY = Symbol.for('tecton.toast/v1');

/**
 * The shape version this copy of Tecton creates.
 *
 * 2 added `requestStandIn` and `publish`'s options — both additive, so a
 * version 1 reader can use a version 2 record unchanged, and a version 2
 * reader degrades to "no stand-ins" on a version 1 record.
 */
export const TOAST_BUS_VERSION = 2;

type BusHost = Document & {[BUS_KEY]?: TectonToastBus};

function createBus(): TectonToastBus {
  /** One live viewport and whether it claims the page's toast surface. */
  interface Publisher {
    viewport: TectonToastViewport;
    owning: boolean;
  }
  /** A nested provider's standing offer to publish a stand-in viewport. */
  interface StandInRequest {
    notify: (needed: boolean) => void;
    /** What this request was last told, so it is never told it twice. */
    needed: boolean;
  }

  /** Publishers in publish order; owning ones outrank a stand-in. */
  const publishers: Publisher[] = [];
  /** Offers to stand in, in registration order; the first one is asked. */
  const standInRequests: StandInRequest[] = [];
  /** Raised, not yet handed to a viewport. */
  const queue: {id: string; toast: TectonToastData}[] = [];
  /** Which viewport is showing each live toast, so it can be removed there. */
  const shownBy = new Map<string, TectonToastViewport>();

  let nextId = 0;
  let delivered = 0;

  /** The first owning publisher, or the stand-in while there is none. */
  const active = (): Publisher | undefined =>
    publishers.find(entry => entry.owning) ?? publishers[0];

  /**
   * Tell each offer whether the page wants its viewport.
   *
   * Exactly one is asked — the oldest — and only while nothing owning is
   * published, so the page never has two viewports and never has none it
   * could have had. Listeners are notified from a snapshot: one of them
   * publishing or releasing re-enters this function, and the guard makes that
   * a re-run rather than a half-walked list.
   */
  let syncing = false;
  const syncStandIns = (): void => {
    if (syncing) return;
    syncing = true;
    try {
      let changed = true;
      while (changed) {
        changed = false;
        const wanted = publishers.some(entry => entry.owning) ? -1 : 0;
        for (const [index, request] of [...standInRequests].entries()) {
          const needed = index === wanted;
          if (request.needed === needed) continue;
          request.needed = needed;
          request.notify(needed);
          changed = true;
          break;
        }
      }
    } finally {
      syncing = false;
    }
  };

  const deliver = (id: string, toast: TectonToastData): void => {
    const viewport = active()?.viewport;
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

    publish(
      viewport: TectonToastViewport,
      options?: TectonToastPublishOptions,
    ): () => void {
      const entry: Publisher = {viewport, owning: options?.owning !== false};
      publishers.push(entry);
      // An owning viewport arriving takes the page back from a stand-in; the
      // stand-in takes its own viewport down when it hears about it.
      syncStandIns();
      if (active() === entry) flush();

      let released = false;
      return () => {
        if (released) return;
        released = true;
        const index = publishers.indexOf(entry);
        if (index !== -1) publishers.splice(index, 1);
        // Toasts this viewport was showing went with its React tree.
        for (const [id, shown] of shownBy) {
          if (shown === viewport) shownBy.delete(id);
        }
        syncStandIns();
        if (active()) flush();
      };
    },

    requestStandIn(listener: (needed: boolean) => void): () => void {
      const request: StandInRequest = {notify: listener, needed: false};
      standInRequests.push(request);
      syncStandIns();

      let released = false;
      return () => {
        if (released) return;
        released = true;
        const index = standInRequests.indexOf(request);
        if (index !== -1) standInRequests.splice(index, 1);
        syncStandIns();
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
      return {
        publishers: publishers.length,
        queued: queue.length,
        delivered,
        owners: publishers.filter(entry => entry.owning).length,
        standInRequests: standInRequests.length,
        standingIn: active() !== undefined && !active()?.owning,
      };
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
  options?: TectonToastPublishOptions,
): () => void {
  const bus = getToastBus();
  if (!bus) return () => {};
  return bus.publish(viewport, options);
}

/**
 * Offer to publish a stand-in viewport for a page with no owning one.
 *
 * Returns the function that withdraws the offer. The listener is called with
 * `true` when this caller should mount a viewport and `false` when it should
 * take it down again; it is never called at all when there is no document, or
 * when the page's bus record predates stand-ins — in which case the caller
 * behaves exactly as it did before they existed.
 */
export function requestToastStandIn(
  listener: (needed: boolean) => void,
): () => void {
  const bus = getToastBus();
  if (!bus || typeof bus.requestStandIn !== 'function') return () => {};
  return bus.requestStandIn(listener);
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
