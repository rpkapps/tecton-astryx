/**
 * The Tecton semantic colour map.
 *
 * Every role below is a row from the Tecton colour foundation, under the name
 * the design page prints for it ("Text primary", "primary Hover background",
 * "success Filled background", …). Each value is a `[light, dark]` pair built
 * from `palette.generated.ts`, so no colour in the theme is a free hex: it is
 * always a named stop of a named ramp in `tokens/tecton.tokens.json`.
 *
 * **Dark is the reference.** The design source is a dark-mode rendering and the
 * dark side of every pair is the transcribed value. The light side is derived:
 * same family, same stop, the `onLight` ramp instead of `onDark` (the ramps run
 * in opposite directions, so the same stop keeps the same *role*). The full
 * rule, and the places where it is weak, are written up in
 * `docs/design/light-mode.md`.
 */
import {palette, shades, type PaletteFamily} from './palette.generated.js';

/** A token value for both colour modes, in the order the theme layer wants it. */
export type ColorPair = [light: string, dark: string];

type Palette = typeof palette;

/** The keys of a ramp object that hold a colour rather than a nested ramp. */
type StopsOf<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

/** Families published as a plain 50…1570 ramp on both surfaces. */
type RampFamily = Exclude<PaletteFamily, 'gray'>;
type RampStop<F extends RampFamily> = StopsOf<Palette[F]['onDark']> &
  StopsOf<Palette[F]['onLight']> &
  string;

type CoreFamily = {
  [K in RampFamily]: Palette[K]['onDark'] extends {core: unknown} ? K : never;
}[RampFamily];
type CoreStop<F extends CoreFamily> = StopsOf<Palette[F]['onDark']['core']> &
  string;

/** The neutral ramp: `gray.onDark.contrasts.N` paired with `gray.onLight.N`. */
type NeutralStop = StopsOf<Palette['gray']['onDark']['contrasts']> &
  StopsOf<Palette['gray']['onLight']> &
  string;

function lookup(node: unknown, ...keys: readonly string[]): string {
  let current: unknown = node;
  for (const key of keys) {
    current = (current as Record<string, unknown> | undefined)?.[key];
  }
  if (typeof current !== 'string') {
    throw new Error(`No palette value at ${keys.join('.')}`);
  }
  return current;
}

/**
 * A plain ramp stop: `<family>.onLight.<stop>` for light, `onDark` for dark.
 *
 * @example ramp('graphite', '680') // Text secondary — ['#604e6e', '#a7a2ac']
 */
export function ramp<F extends RampFamily>(
  family: F,
  stop: RampStop<F>,
): ColorPair {
  return [
    lookup(palette[family].onLight, stop),
    lookup(palette[family].onDark, stop),
  ];
}

/** A stop of the saturated `core` sub-ramp. */
export function core<F extends CoreFamily>(
  family: F,
  stop: CoreStop<F>,
): ColorPair {
  return [
    lookup(palette[family].onLight, 'core', stop),
    lookup(palette[family].onDark, 'core', stop),
  ];
}

/**
 * The neutral ramp. `gray` is the one family whose dark side is published as a
 * `contrasts` sub-ramp while its light side is a plain ramp, so the pairing is
 * `gray.onDark.contrasts.N ↔ gray.onLight.N`.
 *
 * @example neutral('100') // Background default — ['#f6f4f7', '#1d1c1f']
 */
export function neutral(stop: NeutralStop): ColorPair {
  return [
    lookup(palette.gray.onLight, stop),
    lookup(palette.gray.onDark, 'contrasts', stop),
  ];
}

/**
 * A step of a family's alpha ladder. Each family publishes the ladder on one
 * stop only (a different stop per surface), so the step is the whole address.
 *
 * @example tint('violet', '25') // 25 % violet — used for accent-muted
 */
export function tint(family: RampFamily, step: string): ColorPair {
  const pick = (branch: 'onDark' | 'onLight') => {
    const ladder = (
      palette[family][branch] as {transparent?: Record<string, unknown>}
    ).transparent;
    if (!ladder) throw new Error(`${family}.${branch} has no alpha ladder`);
    const stops = Object.keys(ladder);
    const stop = stops.length === 1 ? stops[0] : stops[stops.length - 1];
    return lookup(ladder, stop, step);
  };
  return [pick('onLight'), pick('onDark')];
}

/** One value used unchanged in both modes (white, black, a scrim, a ring). */
export function both(value: string): ColorPair {
  return [value, value];
}

/** Ink tinted onto whatever surface is underneath: black in light, white in dark. */
export function ink(step: keyof typeof shades.blackTransparent): ColorPair {
  return [shades.blackTransparent[step], shades.whiteTransparent[step]];
}

/** A black wash at the same strength in both modes (scrims, recessed fills). */
export function black(step: keyof typeof shades.blackTransparent): ColorPair {
  return both(shades.blackTransparent[step]);
}

/**
 * A black wash at two different strengths — light mode first.
 *
 * Tecton's recessed fills ("darker than the page") only translate to a light
 * canvas at a much lower alpha, so the two roles that use one carry an explicit
 * pair rather than a single value.
 */
export function wash(
  lightStep: keyof typeof shades.blackTransparent,
  darkStep: keyof typeof shades.blackTransparent,
): ColorPair {
  return [
    shades.blackTransparent[lightStep],
    shades.blackTransparent[darkStep],
  ];
}

/** A white wash at the same strength in both modes. */
export function white(step: keyof typeof shades.whiteTransparent): ColorPair {
  return both(shades.whiteTransparent[step]);
}

/* -------------------------------------------------------------------------- */
/* The map                                                                    */
/* -------------------------------------------------------------------------- */

/** Text roles — colour foundation, "Text" section (6 rows). */
const text = {
  /** Default product UI text. */
  primary: neutral('1570'),
  /** Secondary labels, descriptions and metadata. */
  secondary: ramp('graphite', '680'),
  /** Disabled text. */
  disabled: neutral('220'),
  /** Input placeholder text. Astryx has no token for this. */
  placeholder: neutral('310'),
  /** Text on inverse or high-contrast surfaces. */
  inverse: neutral('50'),
  /** Lowest-emphasis readable text. */
  subtlest: ramp('graphite', '460'),
} as const;

/** Surface roles — colour foundation, "Surfaces" section (6 rows). */
const surface = {
  /** App and page background. */
  backgroundDefault: neutral('100'),
  /** Paper-like surface background. */
  backgroundPaper: neutral('50'),
  /** Cards, menus, popovers and raised documents. */
  backgroundElevated: neutral('50'),
  /** Default divider or border. */
  dividerMedium: ramp('graphite', '220'),
  /** Low-emphasis separators. */
  dividerSubtle: ramp('graphite', '120'),
  /** High-emphasis separators. */
  dividerStrong: ramp('graphite', '310'),
} as const;

/** Action roles — colour foundation, "Actions" section (87 rows). */
const action = {
  primary: {
    background: ramp('violet', '220'),
    text: ramp('lilac', '1300'),
    hoverBackground: ramp('violet', '310'),
    pressBackground: ramp('violet', '370'),
    activeBackground: ramp('violet', '370'),
    hoverText: both(shades.white),
    adornment: ramp('lilac', '830'),
    hoverAdornment: white('70'),
    pressAdornment: white('80'),
  },
  secondary: {
    background: ramp('graphite', '140'),
    text: ramp('mauve', '830'),
    hoverBackground: ramp('mauve', '190'),
    pressBackground: ramp('mauve', '220'),
    hoverText: ramp('violet', '1300'),
    pressText: ramp('mauve', '1440'),
    adornment: ramp('mauve', '560'),
    hoverAdornment: ramp('violet', '1000'),
  },
  tertiary: {
    background: black('0'),
    text: ramp('mauve', '830'),
    hoverBackground: ramp('graphite', '140'),
    pressBackground: ramp('graphite', '160'),
    hoverText: ramp('mauve', '1000'),
    pressText: ramp('mauve', '1300'),
    adornment: ramp('mauve', '560'),
    hoverAdornment: ramp('violet', '830'),
  },
  outlined: {
    background: black('0'),
    border: ramp('mauve', '220'),
    strongBorder: ramp('mauve', '680'),
    text: ramp('mauve', '680'),
    hoverBackground: ramp('graphite', '160'),
    pressBackground: ramp('graphite', '190'),
    hoverBorder: ramp('mauve', '1000'),
    pressBorder: ramp('mauve', '1170'),
    hoverText: ramp('violet', '1300'),
    pressText: ramp('mauve', '1440'),
    adornment: ramp('mauve', '460'),
  },
  textOnly: {
    text: ramp('mauve', '560'),
    /**
     * The one state in the system that paints a fill *darker than the page*.
     * A 50 % black wash is right on the dark canvas; on a light one it would be
     * a slab of grey, so light mode takes the same idea at a tenth the weight.
     * Recorded as a derivation exception in `docs/design/light-mode.md`.
     */
    focusBackground: wash('5', '50'),
    hoverText: ramp('violet', '830'),
    pressText: ramp('lilac', '830'),
    adornment: ramp('mauve', '310'),
    hoverAdornment: ramp('violet', '460'),
  },
  disabled: {
    /**
     * Disabled is a recessed fill, not an opacity drop: the design replaces the
     * colour with a wash that is darker than the page. Same exception as the
     * text-only focus fill — a 40 % black wash on a light page reads as a solid
     * mid-grey, so light mode uses 10 %.
     */
    filledBackground: wash('10', '40'),
    filledText: neutral('220'),
    filledAdornment: neutral('160'),
    outlineBackground: black('0'),
    outlineBorder: neutral('130'),
    outlineText: neutral('190'),
    textOnlyText: neutral('190'),
  },
  /** The hot-pink focus ring every control but Tab draws. */
  focusRing: ramp('hotPink', '460'),
} as const;

/** One severity's full ladder — the shape every "Status" group repeats. */
interface StatusRole {
  readonly main: ColorPair;
  readonly bright: ColorPair;
  readonly muted: ColorPair;
  readonly filledBackground: ColorPair;
  readonly filledText: ColorPair;
  readonly filledAdornment: ColorPair;
  readonly filledHoverBackground: ColorPair;
  readonly filledPressBackground: ColorPair;
  readonly outlineStrongBorder: ColorPair;
  readonly outlineText: ColorPair;
}

/** Status roles — colour foundation, "Status" section (90 rows). */
const status = {
  success: {
    main: ramp('green', '830'),
    bright: ramp('green', '1170'),
    muted: ramp('green', '310'),
    filledBackground: ramp('green', '560'),
    filledText: ramp('green', '50'),
    filledAdornment: ramp('green', '50'),
    filledHoverBackground: ramp('green', '680'),
    filledPressBackground: ramp('green', '830'),
    outlineStrongBorder: ramp('green', '830'),
    outlineText: ramp('green', '1000'),
  },
  error: {
    main: ramp('red', '460'),
    bright: ramp('red', '830'),
    muted: ramp('red', '190'),
    filledBackground: ramp('red', '460'),
    filledText: ramp('red', '50'),
    filledAdornment: ramp('red', '50'),
    filledHoverBackground: ramp('red', '680'),
    filledPressBackground: ramp('red', '830'),
    outlineStrongBorder: ramp('red', '560'),
    outlineText: ramp('red', '560'),
  },
  warning: {
    main: ramp('yellow', '830'),
    bright: ramp('yellow', '1300'),
    muted: ramp('yellow', '310'),
    filledBackground: ramp('yellow', '680'),
    filledText: ramp('yellow', '50'),
    filledAdornment: ramp('yellow', '50'),
    filledHoverBackground: ramp('yellow', '830'),
    filledPressBackground: ramp('yellow', '1000'),
    outlineStrongBorder: ramp('yellow', '830'),
    outlineText: ramp('yellow', '1000'),
  },
  info: {
    main: ramp('blue', '680'),
    bright: ramp('blue', '1000'),
    muted: ramp('blue', '310'),
    filledBackground: ramp('blue', '460'),
    filledText: ramp('blue', '50'),
    filledAdornment: ramp('blue', '140'),
    filledHoverBackground: ramp('blue', '560'),
    filledPressBackground: ramp('blue', '680'),
    outlineStrongBorder: ramp('blue', '830'),
    outlineText: ramp('blue', '1000'),
  },
  neutral: {
    main: neutral('560'),
    bright: neutral('1000'),
    muted: neutral('310'),
    filledBackground: neutral('120'),
    filledText: neutral('1000'),
    filledAdornment: neutral('830'),
    filledHoverBackground: neutral('190'),
    filledPressBackground: neutral('220'),
    outlineStrongBorder: neutral('830'),
    outlineText: neutral('1000'),
  },
} as const satisfies Record<string, StatusRole>;

/** Accent roles — colour foundation, "Accents" section (14 rows). */
const accent = {
  lemon: {fill: ramp('lemon', '560'), text: ramp('lemon', '1000')},
  graphite: {fill: ramp('graphite', '560'), text: ramp('graphite', '1000')},
  pink: {fill: ramp('pink', '560'), text: ramp('pink', '1000')},
  saffron: {fill: ramp('saffron', '560'), text: ramp('saffron', '1000')},
  lime: {fill: ramp('lime', '560'), text: ramp('lime', '1000')},
  blue: {fill: ramp('blue', '680'), text: ramp('blue', '1000')},
  azure: {fill: ramp('azure', '560'), text: ramp('azure', '1000')},
  /** Not on the Accents page; the purple ramp the primary action is drawn from. */
  lilac: {fill: ramp('lilac', '560'), text: ramp('lilac', '1000')},
} as const;

/** Component roles — colour foundation, "Component Tokens" section (63 rows). */
const component = {
  table: {
    cellBackground: neutral('100'),
    cellBackgroundAlt: neutral('130'),
    cellHoverBackground: ramp('graphite', '140'),
    cellActiveBackground: ramp('graphite', '190'),
    headerBackground: ramp('graphite', '160'),
    footer: ramp('graphite', '110'),
  },
  topNav: {
    solidBackground: both(shades.black),
    contrastText: white('50'),
    adornment: ramp('lilac', '460'),
  },
  input: {
    /*
     * `#f7f6f8`, the value ink, is the one hex on the colour page that three
     * ramps carry (mauve, graphite and violet, all at stop 1570). The graphite
     * ramp is the one the rest of the field is drawn from, so it is the one the
     * light side is derived through; the three light values differ by about one
     * step of hue (#21172a / #22162f / #231430).
     */
    filled: {
      background: ramp('graphite', '110'),
      contrastText: ramp('mauve', '680'),
      hoverBackground: ramp('graphite', '120'),
      pressBackground: ramp('graphite', '140'),
      adornment: ramp('mauve', '460'),
      valueText: ramp('graphite', '1570'),
      placeholderText: ramp('graphite', '560'),
    },
    outlined: {
      background: black('0'),
      border: ramp('graphite', '220'),
      contrastText: ramp('graphite', '560'),
      valueText: ramp('graphite', '1570'),
      placeholderText: ramp('graphite', '460'),
      adornment: ramp('mauve', '460'),
      activeBackground: ramp('graphite', '100'),
      hoverBorder: ramp('mauve', '1000'),
      pressBorder: ramp('mauve', '1300'),
      hoverContrastText: ramp('graphite', '680'),
    },
    textOnly: {
      contrastText: ramp('graphite', '560'),
      valueText: ramp('graphite', '1570'),
      placeholderText: ramp('graphite', '460'),
      adornment: ramp('mauve', '460'),
      focusBackground: ramp('graphite', '100'),
    },
  },
  avatar: {
    fill: ramp('pink', '560'),
    contrastText: neutral('50'),
    disabledFill: neutral('220'),
  },
  badge: {
    contrastText: neutral('50'),
  },
  /**
   * Read off the component stories rather than the colour page.
   * `tab.filledSelected` is the nearest palette stop to the measured `#6b6076`;
   * `checkbox.*` and `switch.*` come from `design/components/*.md`.
   */
  tab: {
    restText: ramp('graphite', '560'),
    selectedText: ramp('mauve', '1570'),
    filledSelected: ramp('mauve', '310'),
    stripBackground: neutral('120'),
  },
  checkbox: {
    border: ramp('mauve', '830'),
    hoverBorder: ramp('mauve', '1000'),
    checkedFill: ramp('mauve', '1300'),
    indeterminateFill: ramp('mauve', '1000'),
    halo: ramp('graphite', '140'),
    glyph: neutral('50'),
    disabledBorder: neutral('190'),
  },
  switch: {
    offBorder: ramp('mauve', '680'),
    offThumb: ramp('mauve', '680'),
    onTrack: ramp('violet', '370'),
    onThumb: ramp('lilac', '1300'),
    disabledTrack: ramp('graphite', '220'),
  },
  progress: {
    /** Linear "primary" — a neutral, barely above the track. */
    primary: ramp('graphite', '830'),
    /** Linear "secondary" and "tertiary": the only functional teal and lime. */
    secondary: ramp('azure', '1000'),
    tertiary: ramp('lime', '1000'),
    track: ramp('graphite', '310'),
  },
  chip: {
    defaultFill: neutral('120'),
    defaultText: neutral('1000'),
    disabledFill: neutral('120'),
    disabledText: neutral('220'),
  },
} as const;

/**
 * The Tecton semantic colour map, grouped as the colour foundation groups it.
 *
 * This is the only place a Tecton role name is bound to a palette stop; the
 * theme and the component overrides read from here.
 */
export const tectonColor = {
  text,
  surface,
  action,
  status,
  accent,
  component,
} as const;

export type TectonColor = typeof tectonColor;

/** Convenience: the value a `[light, dark]` pair carries in dark mode. */
export const dark = (pair: ColorPair): string => pair[1];

/** Convenience: the value a `[light, dark]` pair carries in light mode. */
export const light = (pair: ColorPair): string => pair[0];
