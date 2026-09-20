/**
 * TectonProvider: the page-level behaviour of `scope` and
 * `configureTectonRoot`, measured on the real document.
 *
 * The registry's own rules are unit-tested in
 * `src/runtime/__tests__/rootRegistry.test.ts`; what is checked here is that
 * the provider is wired into them, and that a single provider still behaves
 * exactly as it did before they existed.
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render} from '@testing-library/react';
import {TectonProvider, configureTectonRoot} from '../TectonProvider.js';

/**
 * Let the registry's MutationObserver run.
 *
 * The upstream provider's cleanup removes the attributes *after* this
 * provider's cleanup has released its claim (React walks deletions
 * parent-first), so the registry's re-assertion is one microtask behind it.
 * Observer callbacks run at the microtask checkpoint, before paint, so nothing
 * flashes in a browser — but a synchronous read, like the ones below, has to
 * wait for it.
 */
function flush(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}

function root() {
  const html = document.documentElement;
  return {
    mode: html.getAttribute('data-theme'),
    theme: html.getAttribute('data-astryx-theme'),
  };
}

beforeEach(() => {
  // A disagreement warning is expected in several of these; the warn-once
  // behaviour itself is covered by the registry's unit tests.
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('a single provider', () => {
  it('themes the page while mounted and cleans up after itself', async () => {
    const view = render(
      <TectonProvider>
        <p>hello</p>
      </TectonProvider>,
    );
    expect(view.getByText('hello')).toBeInTheDocument();
    expect(root()).toEqual({mode: 'dark', theme: 'tecton'});

    view.unmount();
    await flush();
    expect(root()).toEqual({mode: null, theme: null});
  });

  it('follows the mode it is given', () => {
    const view = render(
      <TectonProvider mode="light">
        <p>hello</p>
      </TectonProvider>,
    );
    expect(root()).toEqual({mode: 'light', theme: 'tecton'});
    view.unmount();
  });

  it("removes data-theme for mode='system' and keeps the theme name", () => {
    const view = render(
      <TectonProvider mode="system">
        <p>hello</p>
      </TectonProvider>,
    );
    expect(root()).toEqual({mode: null, theme: 'tecton'});
    view.unmount();
  });
});

describe('two providers on one page', () => {
  it('gives the page to the first owning claim', () => {
    const first = render(
      <TectonProvider mode="dark">
        <p>a</p>
      </TectonProvider>,
    );
    const second = render(
      <TectonProvider mode="light">
        <p>b</p>
      </TectonProvider>,
    );

    expect(root()).toEqual({mode: 'dark', theme: 'tecton'});
    first.unmount();
    second.unmount();
  });

  it('keeps the root attributes when a sibling unmounts', async () => {
    const first = render(
      <TectonProvider mode="dark">
        <p>a</p>
      </TectonProvider>,
    );
    const second = render(
      <TectonProvider mode="dark">
        <p>b</p>
      </TectonProvider>,
    );

    second.unmount();
    await flush();
    // Before the registry this left {null, null} for the rest of the page's
    // life — the measured F4 failure mode.
    expect(root()).toEqual({mode: 'dark', theme: 'tecton'});

    first.unmount();
    await flush();
    expect(root()).toEqual({mode: null, theme: null});
  });

  it('lets a nested provider theme its own tree without claiming the page', async () => {
    const host = render(
      <TectonProvider mode="dark">
        <p>a</p>
      </TectonProvider>,
    );
    const container = render(
      <TectonProvider mode="light" scope="nested">
        <p>b</p>
      </TectonProvider>,
    );

    expect(root()).toEqual({mode: 'dark', theme: 'tecton'});
    // The nested tree still carries its own mode on its own wrapper.
    expect(
      container.container
        .querySelector('[data-astryx-theme]')
        ?.getAttribute('data-theme'),
    ).toBe('light');

    host.unmount();
    await flush();
    // The nested claim keeps the attributes alive rather than blanking them.
    expect(root()).toEqual({mode: 'dark', theme: 'tecton'});

    container.unmount();
    await flush();
    expect(root()).toEqual({mode: null, theme: null});
  });
});

describe('configureTectonRoot', () => {
  it('lets a host shell own the page before any container mounts', async () => {
    const release = configureTectonRoot({mode: 'light'});
    expect(root()).toEqual({mode: 'light', theme: 'tecton'});

    const container = render(
      <TectonProvider mode="dark" scope="nested">
        <p>container</p>
      </TectonProvider>,
    );
    expect(root()).toEqual({mode: 'light', theme: 'tecton'});

    container.unmount();
    await flush();
    expect(root()).toEqual({mode: 'light', theme: 'tecton'});

    release();
    expect(root()).toEqual({mode: null, theme: null});
  });

  it('holds the page against a container that forgets scope="nested"', async () => {
    const release = configureTectonRoot({mode: 'light'});
    const container = render(
      <TectonProvider mode="dark">
        <p>container</p>
      </TectonProvider>,
    );

    // The container's own `mode` still applies inside its tree; what it does
    // not get is the page. (The development warning that names both claims is
    // covered in the registry's unit tests — it is warn-once per document, so
    // an earlier test in this file has already consumed it.)
    expect(root()).toEqual({mode: 'light', theme: 'tecton'});

    container.unmount();
    await flush();
    release();
    expect(root()).toEqual({mode: null, theme: null});
  });

  it('accepts a versioned theme name', () => {
    const release = configureTectonRoot({mode: 'dark', themeName: 'tecton-2'});
    expect(root()).toEqual({mode: 'dark', theme: 'tecton-2'});
    release();
  });
});
