/**
 * The theme, checked against the design sources.
 *
 * Every expected value here is read out of `design/foundations/colors.json` at
 * run time; no hex is written into this file by hand. Light-mode expectations
 * are derived from `tokens/tecton.tokens.json` with the rule in
 * `docs/design/light-mode.md`, re-implemented in `designSources.ts` so the test
 * cannot pass by agreeing with itself.
 */
import {describe, expect, it} from 'vitest';
import {resolveThemeTokens} from '@astryxdesign/core/theme/tokens';
import {tectonTheme} from '../tectonTheme.js';
import {tectonLocalTokens} from '../localTokens.js';
import {variants, typeScaleMapping} from '../typography.js';
import {deriveLight, row, sameColor, sourcePath} from './designSources.js';

const darkTokens = resolveThemeTokens(tectonTheme, {mode: 'dark'});
const lightTokens = resolveThemeTokens(tectonTheme, {mode: 'light'});

/**
 * Tecton role (as the colour page names it) → the token that carries it.
 *
 * A second entry for the same row is how a Tecton role that fans out to
 * several tokens is checked — "Background elevated" is the surface, the card
 * and the popover all at once.
 */
const ROLES: ReadonlyArray<readonly [role: string, token: string]> = [
  // Text
  ['Text primary', '--color-text-primary'],
  ['Text primary', '--color-icon-primary'],
  ['Text primary', '--color-background-inverted'],
  ['Text secondary', '--color-text-secondary'],
  ['Text disabled', '--color-text-disabled'],
  ['Text subtlest', '--color-icon-secondary'],
  ['Text inverse', '--color-on-light'],
  ['Text primary', '--color-on-dark'],

  // Surfaces
  ['Background default', '--color-background-body'],
  ['Background elevated', '--color-background-surface'],
  ['Background elevated', '--color-background-card'],
  ['Background elevated', '--color-background-popover'],
  ['Divider subtle', '--color-border'],
  ['Divider medium', '--color-border-emphasized'],
  ['Divider strong', '--color-track'],

  // Actions
  ['primary Background', '--color-accent'],
  ['primary Text', '--color-on-accent'],
  ['primary Adornment', '--color-text-accent'],
  ['primary Adornment', '--color-icon-accent'],
  ['secondary Background', '--color-neutral'],
  ['secondary Background', '--color-skeleton'],
  ['disabled Filled adornment', '--color-icon-disabled'],
  ['Focus ring', '--focus-outline-color'],

  // Status
  ['success Filled background', '--color-success'],
  ['success Filled text', '--color-on-success'],
  ['error Filled background', '--color-error'],
  ['error Filled text', '--color-on-error'],
  ['error Bright', '--color-background-error-inverted'],
  ['warning Filled background', '--color-warning'],
  ['warning Filled text', '--color-on-warning'],

  // Hue families, from the Accents page
  ['blue fill', '--color-icon-blue'],
  ['blue fill', '--color-border-blue'],
  ['blue text', '--color-text-blue'],
  ['azure fill', '--color-icon-cyan'],
  ['azure fill', '--color-icon-teal'],
  ['azure text', '--color-text-cyan'],
  ['azure text', '--color-text-teal'],
  ['graphite fill', '--color-icon-gray'],
  ['graphite text', '--color-text-gray'],
  ['saffron fill', '--color-icon-orange'],
  ['saffron text', '--color-text-orange'],
  ['pink fill', '--color-icon-pink'],
  ['pink text', '--color-text-pink'],
  ['lemon fill', '--color-icon-yellow'],
  ['lemon text', '--color-text-yellow'],
  ['success Filled background', '--color-icon-green'],
  ['success Outline text', '--color-text-green'],
  ['error Outline strong border', '--color-icon-red'],
  ['error Outline press border', '--color-text-red'],

  // Component surfaces
  ['input / filled / background', '--color-background-muted'],
];

/** Tecton roles with no token underneath, carried by a theme-local property. */
const LOCAL_ROLES: ReadonlyArray<readonly [role: string, token: string]> = [
  ['Text placeholder', '--tecton-color-text-placeholder'],
  ['Divider strong', '--tecton-color-divider-strong'],
  ['info Main', '--tecton-color-info'],
  ['info Bright', '--tecton-color-info-bright'],
  ['info Muted', '--tecton-color-info-muted'],
  ['success Muted', '--tecton-color-success-muted'],
  ['warning Muted', '--tecton-color-warning-muted'],
  ['error Muted', '--tecton-color-error-muted'],
  ['info Filled background', '--tecton-color-info-filled'],
  ['info Filled text', '--tecton-color-on-info'],
  ['neutral Main', '--tecton-color-status-neutral'],
  ['neutral Filled background', '--tecton-color-status-neutral-filled'],
  ['neutral Filled text', '--tecton-color-on-status-neutral'],
  ['lime fill', '--tecton-color-accent-lime'],
  ['lime text', '--tecton-color-text-lime'],
  ['top-nav / solid-background', '--tecton-color-top-nav-background'],
  ['top-nav / adornment', '--tecton-color-top-nav-adornment'],
  ['table / header / background', '--tecton-color-table-header'],
  ['table / footer', '--tecton-color-table-footer'],
  ['table / cell / background-alt', '--tecton-color-table-stripe'],
  ['input / filled / background', '--tecton-color-input-filled-background'],
  ['input / outlined / border', '--tecton-color-input-border'],
];

describe('dark mode is the transcribed design', () => {
  it('covers at least 40 named roles', () => {
    expect(ROLES.length).toBeGreaterThanOrEqual(40);
  });

  it.each(ROLES)('%s → %s', (role, token) => {
    const expected = row(role).dark;
    const actual = darkTokens[token];
    expect(
      sameColor(actual, expected),
      `${token} is ${actual}, the design says ${expected} (${sourcePath(expected)})`,
    ).toBe(true);
  });
});

/**
 * Two roles mean "ink that reads on a surface of this lightness", so they are
 * the same value in both modes by definition and the derivation does not apply.
 */
const MODE_INDEPENDENT = new Set(['--color-on-dark', '--color-on-light']);

describe('light mode follows the derivation rule', () => {
  const derivable = ROLES.filter(
    ([role, token]) =>
      !MODE_INDEPENDENT.has(token) && deriveLight(row(role).dark) !== null,
  );

  it('derives most of the map', () => {
    expect(derivable.length).toBeGreaterThanOrEqual(30);
  });

  it.each(derivable)('%s → %s', (role, token) => {
    const expected = deriveLight(row(role).dark);
    const actual = lightTokens[token];
    expect(
      sameColor(actual, expected as string),
      `${token} is ${actual} in light mode, the rule gives ${expected}`,
    ).toBe(true);
  });

  it('keeps the on-dark and on-light inks the same in both modes', () => {
    for (const token of MODE_INDEPENDENT) {
      expect(lightTokens[token]).toBe(darkTokens[token]);
    }
  });

  it('agrees with the light values the transcription already derived', () => {
    let checked = 0;
    for (const [role] of ROLES) {
      const source = row(role);
      if (!source.light) continue;
      expect(deriveLight(source.dark)).toBe(source.light.toLowerCase());
      checked += 1;
    }
    expect(checked).toBeGreaterThanOrEqual(20);
  });
});

describe('theme-local tokens carry the roles with no token underneath', () => {
  /** Local tokens resolve to `light-dark(l, d)` once the theme is defined. */
  const sides = (value: string): [light: string, dark: string] => {
    const match = value.match(/^light-dark\(([^,]+),\s*(.+)\)$/);
    return match
      ? [match[1].trim(), match[2].trim()]
      : [value.trim(), value.trim()];
  };

  it.each(LOCAL_ROLES)('%s → %s', (role, token) => {
    const resolved = tectonTheme.localTokens?.[token];
    expect(resolved, `${token} is not declared`).toBeTruthy();
    const [lightSide, darkSide] = sides(resolved as string);
    const source = row(role);

    expect(sameColor(darkSide, source.dark)).toBe(true);
    const expectedLight = deriveLight(source.dark);
    if (expectedLight) expect(sameColor(lightSide, expectedLight)).toBe(true);
  });

  it('declares every local token as a [light, dark] pair', () => {
    for (const name of Object.keys(tectonLocalTokens)) {
      expect(tectonTheme.localTokens?.[name]).toBeTruthy();
    }
  });
});

describe('type scale', () => {
  const scaleEntries = Object.entries(typeScaleMapping) as Array<
    [role: string, variant: keyof typeof variants]
  >;

  it.each(scaleEntries)(
    '--text-%s-* is the %s variant',
    (role, variantName) => {
      const variant: {size: string; weight: string; leading: string} =
        variants[variantName];
      expect(darkTokens[`--text-${role}-leading`]).toBe(variant.leading);
      expect(darkTokens[`--text-${role}-size`]).toBe(variant.size);
      expect(darkTokens[`--text-${role}-weight`]).toBe(variant.weight);
    },
  );

  it('keeps the two Tecton weights and no more', () => {
    expect(darkTokens['--font-weight-normal']).toBe('400');
    expect(darkTokens['--font-weight-medium']).toBe('500');
    // Tecton's foundation stops at 500, so semibold cannot be heavier.
    expect(darkTokens['--font-weight-semibold']).toBe('500');
  });

  it('names Figtree for the interface and IBM Plex Mono for data', () => {
    expect(darkTokens['--font-family-body']).toContain('Figtree');
    expect(darkTokens['--font-family-heading']).toContain('Figtree');
    expect(darkTokens['--font-family-code']).toContain('IBM Plex Mono');
  });
});

describe('shape', () => {
  it('maps the Tecton radius scale onto the semantic steps', () => {
    expect(darkTokens['--radius-none']).toBe('0px');
    expect(darkTokens['--radius-inner']).toBe('2px'); // radius.25
    expect(darkTokens['--radius-element']).toBe('4px'); // radius.50
    expect(darkTokens['--radius-container']).toBe('8px'); // radius.100
    expect(darkTokens['--radius-chat']).toBe('12px'); // radius.150
    expect(darkTokens['--radius-page']).toBe('16px'); // radius.200
  });

  it('draws a 2px focus ring', () => {
    expect(darkTokens['--focus-outline-width']).toBe('2px');
    expect(darkTokens['--focus-outline-style']).toBe('solid');
  });

  it('sets the control heights the design measures', () => {
    expect(darkTokens['--size-element-sm']).toBe('28px');
    expect(darkTokens['--size-element-md']).toBe('32px');
  });
});

describe('component overrides', () => {
  const components = (tectonTheme.components ?? {}) as Record<
    string,
    Record<string, unknown>
  >;

  it('adds the variants Tecton has and the library does not', () => {
    expect(components.button).toHaveProperty('variant:outlined');
    expect(components.button).toHaveProperty('variant:text-only');
    expect(components.badge).toHaveProperty('variant:lime');
    expect(components.banner).toHaveProperty('status:neutral');
  });

  it('declares the eight custom text types', () => {
    const text = components.text as Record<string, unknown>;
    for (const name of [
      'mediumStrong',
      'smallStrong',
      'tiny',
      'largeData',
      'mediumData',
      'smallData',
      'actionMedium',
      'actionSmall',
    ]) {
      expect(text).toHaveProperty(`type:${name}`);
    }
  });

  it('paints selection as a bright chip, not as the accent', () => {
    const checked = (
      components['checkbox-indicator'] as Record<string, Record<string, string>>
    ).checked;
    // Said as the token the indicator fills, rules and hover-mixes from, so
    // the chip colour reaches all three — see the state tests below.
    expect(checked['--color-accent']).toContain(
      row('tertiary Press text').dark,
    );
  });
});

/**
 * Tecton is a look, not a layout.
 *
 * Everything below is a rule the components' own CSS depends on and an earlier
 * version of this theme broke; each one is pinned so it cannot come back. The
 * evidence for every one of them is in `docs/design/theme-audit.md`, which
 * measures the same 646 examples under this theme and under the theme the
 * upstream docs site renders them with.
 */
describe('the theme leaves the components’ geometry alone', () => {
  const components = (tectonTheme.components ?? {}) as Record<
    string,
    Record<string, Record<string, unknown>>
  >;

  /**
   * A `border-radius` shorthand from the theme layer beats the per-corner radii
   * a component uses to square the interior edges of a connected control, so a
   * button group, a toggle group or a joined input comes apart into separate
   * pills. Tecton's corner is `--radius-element`, and every one of these
   * components already reads it.
   */
  it.each([
    'button',
    'toggle-button',
    'button-group',
    'segmented-control',
    'segmented-control-item',
    'input-group',
    'field',
    'text-input',
    'text-area',
    'selector',
  ])('%s does not restate a corner radius on its base', target => {
    expect(components[target]?.base?.borderRadius).toBeUndefined();
  });

  /**
   * `boxShadow` is not only elevation. `Card` composes a selection ring into
   * the same property through `--_card-ring`, and every surface with an
   * `elevation` prop steps through it. Erasing it on a base erases the prop.
   */
  it.each(['card', 'banner-frame', 'popover', 'dropdown-menu', 'dialog'])(
    '%s does not erase its box-shadow',
    target => {
      expect(components[target]?.base?.boxShadow).toBeUndefined();
    },
  );

  /**
   * `Card` and `Section` already pad to spacing step 4 with no theme, draw
   * their own border on the default variant and fill from
   * `--color-background-card`. Tecton re-points all of those through tokens, so
   * there is nothing left for a component rule to say.
   */
  it.each(['card', 'section', 'tooltip', 'button-group', 'heading', 'field'])(
    'does not override %s at all',
    target => {
      expect(components[target]).toBeUndefined();
    },
  );

  /**
   * Striping and row hover are `Table`'s props (`isStriped`, `hasHover`), and
   * it paints both from tokens it also republishes to pinned cells. Tecton says
   * what colour, never when.
   */
  it('gives Table its stripe and hover through the tokens Table uses', () => {
    const base = components['table-row'].base;
    expect(base['--color-background-muted']).toBeTruthy();
    expect(base['--color-overlay-hover']).toBeTruthy();
    expect(base[':nth-child(even)']).toBeUndefined();
    expect(base[':hover']).toBeUndefined();
  });

  it.each(['item', 'list-item', 'dropdown-menu-item'])(
    '%s hovers through --color-overlay-hover, not a :hover rule of its own',
    target => {
      expect(components[target].base['--color-overlay-hover']).toBeTruthy();
      expect(components[target].base[':hover']).toBeUndefined();
    },
  );

  /**
   * `Switch` keeps `border-width: 0` so the only border it ever draws is the
   * `CanvasText` one that makes the control perceivable under forced colours;
   * its track and thumb are sized in whole pixels on a border-box.
   */
  it('colours the Switch track without a border', () => {
    expect(components.switch.base.borderWidth).toBeUndefined();
    expect(components.switch.base['--color-background-gray']).toBeTruthy();
    expect(components.switch.base.boxShadow).toBeTruthy();
  });

  /**
   * A field rings itself with `:focus-within` on the border it also uses at
   * rest, so re-colouring the resting border has to restate the focused one or
   * the field stops showing keyboard focus (WCAG 2.4.7).
   */
  it.each([
    'text-input',
    'text-area',
    'selector',
    'typeahead',
    'tokenizer',
    'complex-selector',
    'date-input',
    'date-range-input',
    'date-time-input',
    'date-time-input-date-segment',
    'date-time-input-time-segment',
    'file-input',
    'multi-selector',
    'number-input',
    'power-search',
    'time-input',
  ])('%s shows keyboard focus in the focus ink', target => {
    const base = components[target].base as Record<
      string,
      Record<string, string>
    >;
    expect(base[':focus-within']?.borderColor).toContain(
      '--focus-outline-color',
    );
  });

  /** `Link`'s `color` prop has five values; the design speaks about one. */
  it('sets the link ink on the default colour, not on every colour', () => {
    expect(components.link.base).toBeUndefined();
    expect(components.link['color:accent']['--color-text-accent']).toBe(
      'var(--color-text-primary)',
    );
  });

  /**
   * `Banner` rounds its corners a few at a time — top on the header, bottom on
   * the footer, so the two meet flush — and every one of those rules reads
   * `--_banner-radius`. A `border-radius` shorthand overrides all of them at
   * once and puts corners in the middle of the banner.
   */
  it('gives Banner its corner through the variable Banner rounds from', () => {
    const card = components.banner['container:card'];
    expect(card.borderRadius).toBeUndefined();
    expect(card['--_banner-radius']).toBeTruthy();
  });

  /**
   * The hot pink is the focus ink. Selection has to be something else, or a
   * selected control and a focused one look the same.
   */
  it('does not dress selection up as focus', () => {
    const tokens = tectonTheme.tokens as Record<string, unknown>;
    expect(String(tokens['--shadow-inset-selected'])).not.toContain(
      '--focus-outline-color',
    );
  });
});

/**
 * Tecton is a look, not a *resting* look.
 *
 * Everything below is a paint that only exists once a control is touched —
 * pressed, checked, selected, hovered — and every one of them was flat at some
 * point because a theme rule said a colour on the property the component was
 * animating instead of on the token the component reads. The evidence is the
 * "States and paints" part of `docs/design/theme-audit.md`, which drives all
 * 646 examples through rest → hover → active → changed → focus under this
 * theme and under the theme the upstream docs site uses.
 */
describe('states paint, and paint differently from one another', () => {
  const components = (tectonTheme.components ?? {}) as Record<
    string,
    Record<string, Record<string, unknown>>
  >;

  /**
   * `ToggleButton` writes `data-is-pressed="true"`, not
   * `data-is-pressed="isPressed"`, so a bare `isPressed` key compiles to a
   * selector that can never match. The toggle flipped `aria-pressed` correctly
   * and painted nothing at all.
   */
  it('keys the activated toggle on the value ToggleButton writes', () => {
    expect(components['toggle-button'].isPressed).toBeUndefined();
    expect(components['toggle-button']['isPressed:true']).toBeTruthy();
  });

  /**
   * And the activated fill is its own colour in all three of rest, hover and
   * press — otherwise hovering an activated toggle makes it look like turning
   * it off, because `Button`'s `ghost` hover fill (which `ToggleButton`
   * renders) is *darker* than the activated one.
   */
  it('keeps an activated toggle activated under the pointer', () => {
    const pressed = components['toggle-button']['isPressed:true'] as Record<
      string,
      Record<string, string> | string
    >;
    const rest = pressed.backgroundColor as string;
    const hover = (pressed[':hover'] as Record<string, string>).backgroundColor;
    const press = (pressed[':active'] as Record<string, string>)
      .backgroundColor;
    for (const value of [rest, hover, press]) expect(value).toBeTruthy();
    expect(new Set([rest, hover, press]).size).toBe(3);
  });

  /**
   * `--color-overlay-pressed` is `Button`'s composited press wash, and every
   * Tecton button emphasis names its own pressed fill — so the wash stays off
   * on the button family. It is *not* off globally: rows, menu items, cards
   * and thumbnails have no Tecton fill of their own and press through it.
   */
  it('suppresses the press wash only where a fill replaces it', () => {
    expect(components.button.base['--color-overlay-pressed']).toBe(
      'transparent',
    );
    const tokens = tectonTheme.tokens as Record<string, unknown>;
    expect(String(tokens['--color-overlay-pressed'])).not.toContain(
      'transparent',
    );
  });

  /**
   * Every one of these paints from a token the component also mixes its hover
   * out of. Saying the colour as the property instead of as the token
   * overrides the mix along with the resting value, and the control stops
   * reacting to the pointer.
   */
  it.each([
    ['switch', 'checked', '--color-accent'],
    ['switch-thumb', 'base', '--color-background-surface'],
    ['switch-thumb', 'checked', '--color-background-surface'],
    ['checkbox-indicator', 'base', '--color-background-surface'],
    ['checkbox-indicator', 'base', '--color-border-emphasized'],
    ['checkbox-indicator', 'checked', '--color-accent'],
    ['radio-indicator', 'base', '--color-border-emphasized'],
    ['radio-indicator', 'checked', '--color-accent'],
  ])('%s paints its %s state through %s', (target, state, token) => {
    const rule = components[target][state] as Record<string, unknown>;
    expect(rule[token]).toBeTruthy();
  });

  it.each([
    ['switch', 'checked'],
    ['switch-thumb', 'base'],
    ['switch-thumb', 'checked'],
    ['checkbox-indicator', 'base'],
    ['checkbox-indicator', 'checked'],
  ])('%s does not repaint its %s state over the mix', (target, state) => {
    const rule = components[target][state] as Record<string, unknown>;
    expect(rule.backgroundColor).toBeUndefined();
  });

  /**
   * `design/components/switch.md`: the off track is "an outline, not a filled
   * grey pill", and it gives the ring and the knob the same mauve. Filled,
   * the two cancel out and the knob disappears — which is what an off switch
   * looked like. The ring is an inset shadow, so the component keeps its
   * whole-pixel track and its forced-colours border.
   */
  it('draws the off switch as an outline round a transparent track', () => {
    const base = components.switch.base;
    expect(base['--color-background-gray']).toBe('transparent');
    expect(String(base.boxShadow)).toContain('inset');
    expect(base.borderWidth).toBeUndefined();
    expect(components.switch.checked.boxShadow).toBe('none');
  });

  /**
   * `design/components/textfield.md` draws validation as a coloured rule with
   * coloured helper text under it. `FieldStatus` ships a tinted box, and on
   * Tecton's transparent field that tint also bled into the bottom of the
   * control, which upstream hides behind an opaque input surface.
   */
  it('draws validation as ink, not as a box', () => {
    expect(components['field-status'].base.backgroundColor).toBe('transparent');
    for (const type of ['error', 'warning', 'success']) {
      expect(components['field-status'][`type:${type}`].color).toBeTruthy();
    }
  });

  /** And the muted washes the box was drawn from are still there for Banner. */
  it('leaves the muted severity washes alone', () => {
    const tokens = tectonTheme.tokens as Record<string, unknown>;
    for (const name of [
      '--color-error-muted',
      '--color-warning-muted',
      '--color-success-muted',
    ]) {
      expect(String(tokens[name])).toContain('light-dark(');
    }
  });

  /** `Link` mixes its hover ink out of the token, so the token is what moves. */
  it('gives the default link its ink through the token Link hovers from', () => {
    const accent = components.link['color:accent'];
    expect(accent.color).toBeUndefined();
    expect(accent['--color-text-accent']).toBe('var(--color-text-primary)');
  });
});
