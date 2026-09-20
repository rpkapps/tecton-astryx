/**
 * The surface contract.
 *
 * Tecton publishes the component system as it is: same names, same values,
 * same modules, at the same paths. That is a claim about identity, not about
 * likeness, so this file checks identity — `Tecton.Button === Core.Button`,
 * not "both export something called Button". Anything that came between the
 * two (a wrapper, a rename, a narrowed prop type) would fail here.
 *
 * Three things are asserted:
 *
 *   1. every named export of the component system's root is exported from
 *      `@tecton/react` and is the *same reference*;
 *   2. every generated subpath module re-exports its module's names, again by
 *      reference;
 *   3. what Tecton adds on top is exactly the provider and the theme — nothing
 *      else has crept in.
 *
 * The provider's own rendering is covered in `smoke.test.tsx`.
 */
import {describe, it, expect} from 'vitest';
import * as core from '@astryxdesign/core';
import * as tecton from '../index.js';
import tectonPackage from '../../package.json' with {type: 'json'};

/** The names Tecton adds. Everything else at the root has to be upstream's. */
const TECTON_OWN = [
  'TectonProvider',
  'configureTectonRoot',
  'tectonTheme',
  'tectonIcons',
  'tectonToken',
  'tecton',
];

const coreNames = Object.keys(core).filter(name => name !== 'default');
const tectonNames = Object.keys(tecton).filter(name => name !== 'default');

describe('the package root', () => {
  it('re-exports every name the component system exports', () => {
    const missing = coreNames.filter(name => !(name in tecton));
    expect(missing).toEqual([]);
    // A sanity floor: if the import ever resolved to something empty, the
    // check above would pass vacuously.
    expect(coreNames.length).toBeGreaterThan(400);
  });

  it('exports the same value, not a look-alike', () => {
    const different = coreNames.filter(
      name =>
        (tecton as Record<string, unknown>)[name] !==
        (core as Record<string, unknown>)[name],
    );
    expect(different).toEqual([]);
  });

  it('adds the provider and the theme, and nothing else', () => {
    const added = tectonNames.filter(name => !coreNames.includes(name)).sort();
    expect(added).toEqual([...TECTON_OWN].sort());
  });

  it('shadows nothing: every added name is Tecton’s own', () => {
    for (const name of TECTON_OWN) {
      expect(coreNames).not.toContain(name);
    }
  });
});

/**
 * The generated subpaths, read from the `exports` map Tecton publishes — which
 * `scripts/generate-modules.mjs` writes from the component system's own map,
 * and which the build re-checks for drift. Reading it here means this file
 * tests the contract a consumer is actually handed.
 *
 * The hand-written entry points (`.`, `./theme`, `./icons`, the stylesheets)
 * are not generated modules and are covered above and in their own files.
 */
const HAND_WRITTEN = new Set([
  '.',
  './theme',
  './icons',
  './package.json',
  // Published straight from the vendored files, with no module in between —
  // StyleX has to see the real `defineVars()` call site, and JSON has nothing
  // to wrap it in. Checked separately below.
  './theme/tokens.stylex',
  './locales/*.json',
]);

const subpaths = Object.keys(tectonPackage.exports)
  .filter(subpath => !HAND_WRITTEN.has(subpath) && !subpath.endsWith('.css'))
  .map(subpath => subpath.slice(2));

describe('the subpath modules', () => {
  it('covers every module the component system publishes', () => {
    expect(subpaths.length).toBe(118);
  });

  it.each(subpaths)('@tecton/react/%s re-exports its module', async name => {
    const upstream = (await import(
      /* @vite-ignore */ `@astryxdesign/core/${name}`
    )) as Record<string, unknown>;
    const published = (await import(
      /* @vite-ignore */ `../modules/${name}/index.js`
    )) as Record<string, unknown>;

    for (const exported of Object.keys(upstream)) {
      if (exported === 'default') continue;
      expect(published).toHaveProperty(exported);
      expect(published[exported]).toBe(upstream[exported]);
    }
  });
});

describe('the directly published entries', () => {
  it('points at the vendored files rather than at a module', () => {
    const exports = tectonPackage.exports as Record<
      string,
      string | {types: string; default: string}
    >;
    const stylex = exports['./theme/tokens.stylex'];
    expect(typeof stylex).toBe('object');
    expect((stylex as {default: string}).default).toBe(
      './dist/vendor/core/dist/theme/tokens.stylex.js',
    );
    expect(exports['./locales/*.json']).toBe(
      './dist/vendor/core/locales/*.json',
    );
  });

  it('serves the same token variables the theme is built against', async () => {
    const published =
      (await import('@astryxdesign/core/theme/tokens.stylex')) as Record<
        string,
        unknown
      >;
    // The defineVars call sites StyleX has to resolve through.
    expect(published.colorVars).toBeDefined();
    expect(published.spacingVars).toBeDefined();
  });
});

describe('@tecton/react/theme', () => {
  it('carries the theme runtime as well as Tecton’s own theme', async () => {
    const upstream = (await import('@astryxdesign/core/theme')) as Record<
      string,
      unknown
    >;
    const published = (await import('../theme/public.js')) as Record<
      string,
      unknown
    >;

    for (const exported of Object.keys(upstream)) {
      if (exported === 'default') continue;
      expect(published[exported]).toBe(upstream[exported]);
    }

    // And Tecton's half, which is what makes this subpath Tecton's.
    expect(published.tectonTheme).toBeDefined();
    expect(published.tecton).toBeDefined();
    expect(published.tectonToken).toBeInstanceOf(Function);
  });

  it('has no name in common with the runtime it re-exports', async () => {
    const upstream = Object.keys(await import('@astryxdesign/core/theme'));
    const own = Object.keys(await import('../theme/tokens.js')).concat(
      'tectonTheme',
      'tectonIcons',
    );
    expect(own.filter(name => upstream.includes(name))).toEqual([]);
  });
});
