/**
 * The built theme in `dist/`.
 *
 * `astryx theme build` pre-resolves the theme into `dist/theme/tecton.js` and
 * flags it `__built: true`, which is what tells the provider to skip runtime
 * style injection. The tests elsewhere exercise the *source* theme on purpose —
 * they should not need a build to have run — so this file is the one place
 * that checks the built artefact agrees with it.
 *
 * It skips itself when `dist/` is absent, so `pnpm test` works on a clean
 * checkout; `pnpm check` builds first, so CI always runs it for real.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import {resolveThemeTokens} from '@astryxdesign/core/theme/tokens';
import {tectonTheme} from '../tectonTheme.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(HERE, '..', '..', '..');
const BUILT = path.join(PACKAGE_ROOT, 'dist', 'theme', 'tecton.js');
const BUILT_CSS = path.join(PACKAGE_ROOT, 'dist', 'theme', 'theme.css');

const built = fs.existsSync(BUILT);

describe.skipIf(!built)('the built theme module', () => {
  /**
   * The generated module imports its icon registry from `./icons.js`, which
   * only resolves inside `dist/`. Reading the source and pulling the theme
   * object out of it keeps the test independent of that.
   */
  const source = built ? fs.readFileSync(BUILT, 'utf8') : '';

  function builtTokens(): Record<string, string> {
    const match = source.match(/tokens:\s*(\{[\s\S]*?\n {2}\})/);
    if (!match) throw new Error('No tokens object in the built theme module');
    return JSON.parse(
      match[1]
        .replace(/'/g, '"')
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/^(\s*)"?(--[\w-]+)"?:/gm, '$1"$2":'),
    ) as Record<string, string>;
  }

  it('is flagged as built', () => {
    expect(source).toContain('__built: true');
  });

  it('carries the Tecton name', () => {
    expect(source).toContain("name: 'tecton'");
  });

  it('imports the icon registry as a sibling module', () => {
    expect(source).toContain('"./icons.js"');
    expect(fs.existsSync(path.join(path.dirname(BUILT), 'icons.js'))).toBe(
      true,
    );
  });

  it('resolves every token to the same value as the source theme', () => {
    const fromBuild = builtTokens();
    const light = resolveThemeTokens(tectonTheme, {mode: 'light'});
    const dark = resolveThemeTokens(tectonTheme, {mode: 'dark'});

    let checked = 0;
    for (const [name, value] of Object.entries(fromBuild)) {
      if (!name.startsWith('--color-')) continue;
      const sides = value.match(/^light-dark\(([^,]+),\s*(.+)\)$/);
      const expectedLight = light[name];
      const expectedDark = dark[name];
      if (expectedLight === undefined) continue;

      if (sides) {
        expect(sides[1].trim().toLowerCase()).toBe(expectedLight.toLowerCase());
        expect(sides[2].trim().toLowerCase()).toBe(expectedDark.toLowerCase());
      } else {
        expect(value.toLowerCase()).toBe(expectedDark.toLowerCase());
      }
      checked += 1;
    }
    expect(checked).toBeGreaterThanOrEqual(40);
  });
});

describe.skipIf(!fs.existsSync(BUILT_CSS))('the built theme stylesheet', () => {
  const css = fs.existsSync(BUILT_CSS)
    ? fs.readFileSync(BUILT_CSS, 'utf8')
    : '';

  it('scopes its rules to the Tecton theme', () => {
    expect(css).toContain('data-astryx-theme="tecton"');
  });

  it('declares the theme-local tokens', () => {
    for (const name of Object.keys(tectonTheme.localTokens ?? {})) {
      expect(css).toContain(name);
    }
  });

  it('emits the custom variants and text types', () => {
    for (const needle of [
      'data-variant="outlined"',
      'data-variant="text-only"',
      'data-variant="lime"',
      'data-status="neutral"',
      'data-type="mediumData"',
      'data-type="actionSmall"',
    ]) {
      expect(css).toContain(needle);
    }
  });

  /**
   * A state key is only worth writing if it compiles to the attribute the
   * component actually reflects. `parseStyleKey` turns a *bare* state into
   * `[data-<state>="<state>"]`, which is right for the states that reflect
   * themselves that way and wrong for the two that reflect `true`/`false` —
   * `ToggleButton`'s `isPressed` and `SelectableCard`'s `selected`. Written
   * bare, `isPressed` compiled to `[data-is-pressed="isPressed"]`, which
   * matches nothing at all, and the pressed toggle painted nothing.
   */
  it('keys the pressed toggle on the attribute ToggleButton writes', () => {
    expect(css).toContain('[data-is-pressed="true"]');
    expect(css).not.toContain('data-is-pressed="isPressed"');
  });

  /**
   * And the same guard for every other state key in the theme: none of them
   * may compile to an attribute whose value repeats the state's own name
   * unless that is genuinely what the component writes. The three below are
   * the ones that do (`checked`, `selected`, `disabled`); anything else
   * appearing in this shape is a key that will never match.
   */
  it('emits no state selector that cannot match', () => {
    const reflexive = new Set(['checked', 'selected', 'disabled']);
    const emitted = new Set(
      [...css.matchAll(/\[data-([a-z-]+)="([A-Za-z-]+)"\]/g)]
        // An attribute whose value repeats its own name is a bare state key.
        .filter(match => match[1] === match[2])
        .map(match => match[2]),
    );
    expect(emitted.size).toBeGreaterThan(0);
    for (const state of emitted) {
      expect(reflexive.has(state)).toBe(true);
    }
  });
});
