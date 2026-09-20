/**
 * Unit tests for the document-keyed toast bus.
 *
 * Each test works against its own `Document`, because the record is installed
 * with `Object.defineProperty` and is therefore non-configurable: once a
 * document has one it keeps it for good, which is the cross-version contract
 * the bus is built around and also what makes a shared document untestable.
 */
import {describe, it, expect, vi} from 'vitest';
import {
  getToastBus,
  routeToast,
  publishToastViewport,
  TOAST_BUS_VERSION,
  type TectonToastBus,
  type TectonToastData,
  type TectonToastViewport,
} from '../toastBus.js';

/** A clean document with no bus record on it yet. */
function freshDocument(): Document {
  return document.implementation.createHTMLDocument('toast bus test');
}

/** A viewport that records what it was asked to show. */
function recordingViewport(): TectonToastViewport & {
  shown: {id: string; toast: TectonToastData}[];
  removed: string[];
} {
  const shown: {id: string; toast: TectonToastData}[] = [];
  const removed: string[] = [];
  return {
    shown,
    removed,
    add(id, toast) {
      shown.push({id, toast});
    },
    remove(id) {
      removed.push(id);
    },
  };
}

function busFor(doc: Document): TectonToastBus {
  const bus = getToastBus(doc);
  if (!bus) throw new Error('expected a bus');
  return bus;
}

describe('getToastBus', () => {
  it('installs one non-configurable record per document', () => {
    const doc = freshDocument();
    const first = getToastBus(doc);
    const second = getToastBus(doc);

    expect(second).toBe(first);
    expect(first?.version).toBe(TOAST_BUS_VERSION);
    // Version 2 added stand-ins; a copy that finds a version 1 record simply
    // does not offer to stand in, so the method is optional on the interface.
    expect(TOAST_BUS_VERSION).toBe(2);
    expect(typeof first?.requestStandIn).toBe('function');

    const descriptor = Object.getOwnPropertyDescriptor(
      doc,
      Symbol.for('tecton.toast/v1'),
    );
    expect(descriptor?.configurable).toBe(false);
    expect(descriptor?.writable).toBe(false);
  });

  it('is SSR-safe: no document, no bus, and raising a toast is a no-op', () => {
    vi.stubGlobal('document', undefined);
    try {
      expect(getToastBus()).toBeNull();
      expect(() =>
        routeToast({body: 'nothing to show this on'})(),
      ).not.toThrow();
      expect(publishToastViewport(recordingViewport())).toBeInstanceOf(
        Function,
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('routing', () => {
  it('sends every copy’s toast to the one published viewport', () => {
    const bus = busFor(freshDocument());
    const viewport = recordingViewport();
    bus.publish(viewport);

    bus.show({body: 'from container A'});
    bus.show({body: 'from container B', type: 'error'});

    expect(viewport.shown.map(entry => entry.toast.body)).toEqual([
      'from container A',
      'from container B',
    ]);
    expect(viewport.shown[1]?.toast.type).toBe('error');
    expect(bus.inspect?.()).toMatchObject({
      publishers: 1,
      queued: 0,
      delivered: 2,
    });
  });

  it('queues toasts raised before a viewport exists, and flushes them in order', () => {
    const bus = busFor(freshDocument());
    bus.show({body: 'first'});
    bus.show({body: 'second'});
    expect(bus.inspect?.()).toMatchObject({
      publishers: 0,
      queued: 2,
      delivered: 0,
    });

    const viewport = recordingViewport();
    bus.publish(viewport);

    expect(viewport.shown.map(entry => entry.toast.body)).toEqual([
      'first',
      'second',
    ]);
    expect(bus.inspect?.()).toMatchObject({queued: 0, delivered: 2});
  });

  it('keeps the first viewport, and hands over only when it leaves', () => {
    const bus = busFor(freshDocument());
    const first = recordingViewport();
    const second = recordingViewport();
    const releaseFirst = bus.publish(first);
    bus.publish(second);

    bus.show({body: 'while both are up'});
    expect(first.shown).toHaveLength(1);
    expect(second.shown).toHaveLength(0);

    releaseFirst();
    bus.show({body: 'after the first one left'});
    expect(first.shown).toHaveLength(1);
    expect(second.shown.map(entry => entry.toast.body)).toEqual([
      'after the first one left',
    ]);
  });

  it('flushes what was still queued to the next viewport', () => {
    const bus = busFor(freshDocument());
    const release = bus.publish(recordingViewport());
    release();

    bus.show({body: 'raised with nothing on the page'});
    const next = recordingViewport();
    bus.publish(next);

    expect(next.shown.map(entry => entry.toast.body)).toEqual([
      'raised with nothing on the page',
    ]);
  });
});

describe('standing in for a page with no owner', () => {
  it('asks the first offer, and only the first, while nothing owns the page', () => {
    const bus = busFor(freshDocument());
    const first = vi.fn();
    const second = vi.fn();

    bus.requestStandIn?.(first);
    bus.requestStandIn?.(second);

    // The answer is already known when the offer is made, so the first one is
    // told synchronously; the second is never asked at all while the first is
    // doing the job, which is what keeps one viewport on a six-container page.
    expect(first).toHaveBeenCalledExactlyOnceWith(true);
    expect(second).not.toHaveBeenCalled();
  });

  it('shows every copy’s toasts through the stand-in', () => {
    const bus = busFor(freshDocument());
    const standIn = recordingViewport();
    bus.requestStandIn?.(needed => {
      if (needed) bus.publish(standIn, {owning: false});
    });

    bus.show({body: 'from a nested container'});

    expect(standIn.shown.map(entry => entry.toast.body)).toEqual([
      'from a nested container',
    ]);
    expect(bus.inspect?.()).toMatchObject({
      publishers: 1,
      owners: 0,
      standInRequests: 1,
      standingIn: true,
    });
  });

  it('hands the page over when an owning viewport publishes, and back when it leaves', () => {
    const bus = busFor(freshDocument());
    const standIn = recordingViewport();
    const owner = recordingViewport();

    let release: (() => void) | null = null;
    const asked: boolean[] = [];
    bus.requestStandIn?.(needed => {
      asked.push(needed);
      if (needed) {
        release = bus.publish(standIn, {owning: false});
      } else {
        release?.();
        release = null;
      }
    });

    expect(asked).toEqual([true]);
    bus.show({body: 'before the root provider mounts'});
    expect(standIn.shown).toHaveLength(1);

    // A scope="root" provider mounts. The stand-in is told it is no longer
    // needed and takes its viewport down, so the page still has exactly one.
    const releaseOwner = bus.publish(owner);
    expect(asked).toEqual([true, false]);
    expect(bus.inspect?.()).toMatchObject({
      publishers: 1,
      owners: 1,
      standingIn: false,
    });

    bus.show({body: 'while the root provider is up'});
    expect(owner.shown.map(entry => entry.toast.body)).toEqual([
      'while the root provider is up',
    ]);
    expect(standIn.shown).toHaveLength(1);

    // ...and the offer is taken up again when the owner leaves the page.
    releaseOwner();
    expect(asked).toEqual([true, false, true]);
    bus.show({body: 'after the root provider unmounted'});
    expect(standIn.shown.map(entry => entry.toast.body)).toEqual([
      'before the root provider mounts',
      'after the root provider unmounted',
    ]);
  });

  it('asks the next offer when the one standing in withdraws', () => {
    const bus = busFor(freshDocument());
    const second = vi.fn();
    const withdrawFirst = bus.requestStandIn?.(() => {});
    bus.requestStandIn?.(second);

    expect(second).not.toHaveBeenCalled();
    withdrawFirst?.();
    expect(second).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('never tells an offer the answer it already has', () => {
    const bus = busFor(freshDocument());
    const listener = vi.fn();
    bus.requestStandIn?.(listener);

    // A second and a third owning publisher change nothing for the stand-in:
    // it was already told the page has an owner.
    const releaseOne = bus.publish(recordingViewport());
    const releaseTwo = bus.publish(recordingViewport());
    releaseTwo();

    expect(listener.mock.calls).toEqual([[true], [false]]);
    releaseOne();
    expect(listener.mock.calls).toEqual([[true], [false], [true]]);
  });

  it('queues, as it always did, when no offer is made at all', () => {
    const bus = busFor(freshDocument());
    bus.show({body: 'nothing to show this on'});
    expect(bus.inspect?.()).toMatchObject({
      publishers: 0,
      queued: 1,
      standInRequests: 0,
      standingIn: false,
    });
  });
});

describe('dismissal', () => {
  it('removes a shown toast through the viewport showing it, once', () => {
    const bus = busFor(freshDocument());
    const viewport = recordingViewport();
    bus.publish(viewport);

    const dismiss = bus.show({body: 'up for a moment'});
    const [entry] = viewport.shown;
    dismiss();
    dismiss();

    expect(viewport.removed).toEqual([entry?.id]);
  });

  it('drops a queued toast instead of showing it late', () => {
    const bus = busFor(freshDocument());
    const dismiss = bus.show({body: 'never mind'});
    dismiss();

    const viewport = recordingViewport();
    bus.publish(viewport);

    expect(viewport.shown).toEqual([]);
    expect(viewport.removed).toEqual([]);
  });
});

describe('the payload', () => {
  it('crosses as plain data, callbacks and all, with nothing rendered', () => {
    const bus = busFor(freshDocument());
    const viewport = recordingViewport();
    bus.publish(viewport);

    const onAction = vi.fn();
    const payload: TectonToastData = {
      title: 'Could not save',
      body: 'The connection dropped.',
      type: 'error',
      durationMs: 8000,
      action: {label: 'Retry', onAction},
    };
    bus.show(payload);

    // The same object arrives at the viewport: no element is built on this
    // side of the bus, because the copy that renders it may be another one.
    expect(viewport.shown[0]?.toast).toBe(payload);
    viewport.shown[0]?.toast.action?.onAction();
    expect(onAction).toHaveBeenCalledOnce();
  });
});
