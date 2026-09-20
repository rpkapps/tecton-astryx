/**
 * Unit tests for the document-keyed root-ownership registry.
 *
 * Each test works against its own `Document`, because the real record is
 * installed with `Object.defineProperty` and is therefore non-configurable:
 * once a document has one it keeps it for good, which is exactly the
 * cross-version contract the registry is built around and also what makes a
 * shared document untestable.
 */
import {describe, it, expect, vi, afterEach} from 'vitest';
import {
  claimRoot,
  getRootRegistry,
  ROOT_REGISTRY_VERSION,
  type TectonRootRegistry,
} from '../rootRegistry.js';

/** A clean document with no registry record on it yet. */
function freshDocument(): Document {
  return document.implementation.createHTMLDocument('registry test');
}

/** Let the MutationObserver's microtask checkpoint run. */
function flush(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}

function attributesOf(doc: Document) {
  const html = doc.documentElement;
  return {
    mode: html.getAttribute('data-theme'),
    theme: html.getAttribute('data-astryx-theme'),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getRootRegistry', () => {
  it('installs one non-configurable record per document', () => {
    const doc = freshDocument();
    const first = getRootRegistry(doc);
    const second = getRootRegistry(doc);

    expect(first).not.toBeNull();
    expect(second).toBe(first);
    expect(first?.version).toBe(ROOT_REGISTRY_VERSION);

    const descriptor = Object.getOwnPropertyDescriptor(
      doc,
      Symbol.for('tecton.rootOwnership/v1'),
    );
    expect(descriptor?.configurable).toBe(false);
    expect(descriptor?.writable).toBe(false);
  });

  it('is SSR-safe: no document, no registry, and claiming is a no-op', () => {
    vi.stubGlobal('document', undefined);
    try {
      expect(getRootRegistry()).toBeNull();
      // The release function still has to exist, so callers need no branch.
      const release = claimRoot({
        themeName: 'tecton',
        mode: 'dark',
        owning: true,
      });
      expect(typeof release).toBe('function');
      expect(() => release()).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('tolerates an older record rather than replacing it', () => {
    const doc = freshDocument();
    const acquire = vi.fn(() => vi.fn());
    // A record written by an older copy of Tecton: lower version, no
    // `inspect`. It owns the document for its lifetime, so this copy has to
    // use it as it is.
    const older = {version: 0, acquire} as unknown as TectonRootRegistry;
    Object.defineProperty(doc, Symbol.for('tecton.rootOwnership/v1'), {
      value: older,
    });

    const registry = getRootRegistry(doc);
    expect(registry).toBe(older);
    expect(registry?.version).toBe(0);
    expect(registry?.inspect).toBeUndefined();

    registry?.acquire({themeName: 'tecton', mode: 'dark', owning: true});
    expect(acquire).toHaveBeenCalledTimes(1);
  });

  it('ignores a record that does not implement the contract', () => {
    const doc = freshDocument();
    Object.defineProperty(doc, Symbol.for('tecton.rootOwnership/v1'), {
      value: {version: 99},
    });
    expect(getRootRegistry(doc)).toBeNull();
  });
});

describe('acquire / release', () => {
  it('ref-counts two claims: a sibling release keeps the attributes', () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;

    const releaseA = registry.acquire({
      themeName: 'tecton',
      mode: 'dark',
      owning: true,
    });
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});

    const releaseB = registry.acquire({
      themeName: 'tecton',
      mode: 'dark',
      owning: true,
    });
    expect(registry.inspect?.().holders).toBe(2);

    releaseB();
    expect(registry.inspect?.().holders).toBe(1);
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});

    releaseA();
    expect(attributesOf(doc)).toEqual({mode: null, theme: null});
  });

  it('removes both attributes when the last claim is released', () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    const release = registry.acquire({
      themeName: 'tecton',
      mode: 'light',
      owning: true,
    });
    expect(attributesOf(doc)).toEqual({mode: 'light', theme: 'tecton'});

    release();
    expect(attributesOf(doc)).toEqual({mode: null, theme: null});
    expect(registry.inspect?.()).toEqual({
      holders: 0,
      desired: null,
      reassertions: 0,
    });

    // Releasing twice must not disturb a later claim.
    release();
    registry.acquire({themeName: 'tecton', mode: 'dark', owning: true});
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});
  });

  it("'system' mode holds the theme name and removes data-theme", () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    registry.acquire({themeName: 'tecton', mode: 'system', owning: true});
    expect(attributesOf(doc)).toEqual({mode: null, theme: 'tecton'});
  });

  it('keeps the attributes alive for a non-owning claim', () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    const releaseOwner = registry.acquire({
      themeName: 'tecton',
      mode: 'dark',
      owning: true,
    });
    const releaseNested = registry.acquire({
      themeName: 'tecton',
      mode: 'light',
      owning: false,
    });

    // The nested claim never chooses — the mode is still the owner's.
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});

    releaseOwner();
    // ...and it keeps them alive after the owner has gone.
    expect(registry.inspect?.().holders).toBe(1);
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});

    releaseNested();
    expect(attributesOf(doc)).toEqual({mode: null, theme: null});
  });

  it('hands over to the next owning claim in line', () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    const releaseFirst = registry.acquire({
      themeName: 'tecton',
      mode: 'dark',
      owning: true,
    });
    registry.acquire({themeName: 'tecton', mode: 'light', owning: true});
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});

    releaseFirst();
    expect(attributesOf(doc)).toEqual({mode: 'light', theme: 'tecton'});
  });
});

describe('re-assertion', () => {
  it('reverts a foreign removal while a claim is live', async () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    registry.acquire({themeName: 'tecton', mode: 'dark', owning: true});

    // Exactly what the upstream provider's cleanup does on any unmount.
    doc.documentElement.removeAttribute('data-theme');
    doc.documentElement.removeAttribute('data-astryx-theme');
    expect(attributesOf(doc)).toEqual({mode: null, theme: null});

    await flush();
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});
    expect(registry.inspect?.().reassertions).toBe(1);
  });

  it('reverts a foreign overwrite of the mode', async () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    registry.acquire({themeName: 'tecton', mode: 'dark', owning: true});

    doc.documentElement.setAttribute('data-theme', 'light');
    await flush();

    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});
    expect(registry.inspect?.().reassertions).toBe(1);
  });

  it('does not re-assert after the last claim is released', async () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    const release = registry.acquire({
      themeName: 'tecton',
      mode: 'dark',
      owning: true,
    });
    release();

    doc.documentElement.setAttribute('data-theme', 'light');
    await flush();

    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
    expect(registry.inspect?.().reassertions).toBe(0);
  });

  it('does not count a write that already agrees', async () => {
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;
    registry.acquire({themeName: 'tecton', mode: 'dark', owning: true});

    // A second copy's provider mounting and setting the same values.
    doc.documentElement.setAttribute('data-astryx-theme', 'tecton');
    doc.documentElement.setAttribute('data-theme', 'dark');
    await flush();

    expect(registry.inspect?.().reassertions).toBe(0);
  });
});

describe('disagreement', () => {
  it('warns once in development and keeps the first owning claim', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;

    registry.acquire({themeName: 'tecton', mode: 'dark', owning: true});
    registry.acquire({themeName: 'tecton', mode: 'light', owning: true});
    registry.acquire({themeName: 'tecton-2', mode: 'light', owning: true});

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('[tecton]');
    expect(warn.mock.calls[0][0]).toContain('mode="dark"');
    expect(warn.mock.calls[0][0]).toContain('mode="light"');
    expect(attributesOf(doc)).toEqual({mode: 'dark', theme: 'tecton'});
  });

  it('does not warn for an agreeing or non-owning claim', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const doc = freshDocument();
    const registry = getRootRegistry(doc)!;

    registry.acquire({themeName: 'tecton', mode: 'dark', owning: true});
    registry.acquire({themeName: 'tecton', mode: 'dark', owning: true});
    registry.acquire({themeName: 'tecton', mode: 'light', owning: false});

    expect(warn).not.toHaveBeenCalled();
  });
});
