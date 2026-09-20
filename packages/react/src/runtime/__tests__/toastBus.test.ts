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
