import '@testing-library/jest-dom/vitest';
import {afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';

// Vitest runs without globals here, so Testing Library's automatic cleanup
// never registers itself — unmount between tests explicitly.
afterEach(cleanup);

/*
 * jsdom stops short of a few platform APIs the component set reaches for.
 * These are the smallest stubs that let a component render and be queried;
 * none of them pretends to implement the real behaviour, so a test that cares
 * about that behaviour belongs in a browser, not here.
 */

// Media queries — read by anything that adapts to a compact or coarse-pointer
// layout (dialogs, menus, selectors).
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// The modal dialog API. jsdom implements <dialog> but not its methods.
if (typeof HTMLDialogElement !== 'undefined') {
  const dialog = HTMLDialogElement.prototype;
  if (typeof dialog.showModal !== 'function') {
    dialog.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
  }
  if (typeof dialog.show !== 'function') {
    dialog.show = function show(this: HTMLDialogElement) {
      this.open = true;
    };
  }
  if (typeof dialog.close !== 'function') {
    dialog.close = function close(this: HTMLDialogElement) {
      this.open = false;
    };
  }
}

// Element observers, used by overflow handling and by sticky layout.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

for (const name of [
  'ResizeObserver',
  'IntersectionObserver',
  'MutationObserver',
] as const) {
  if (typeof globalThis[name] === 'undefined') {
    Object.defineProperty(globalThis, name, {
      writable: true,
      configurable: true,
      value: NoopObserver,
    });
  }
}

if (typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {};
}
