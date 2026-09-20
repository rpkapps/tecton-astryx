/**
 * The Tecton theme.
 *
 * This file is build-time input: `pnpm --filter @tecton/react build` compiles
 * it into `dist/theme/theme.css` plus a pre-resolved theme module that is
 * loaded at runtime, so applications never pay for style injection on
 * hydration.
 *
 * Three rules hold everywhere below.
 *
 * 1. **Dark is the reference.** The design source is a dark-mode rendering;
 *    every dark value here is transcribed from it. Light values are derived by
 *    the rule in `docs/design/light-mode.md` and are best-effort.
 * 2. **No free hexes.** Colours come from `semantic.ts`, which builds them out
 *    of `palette.generated.ts`, which is generated from
 *    `tokens/tecton.tokens.json`. A colour that cannot be traced to a design
 *    token does not belong here.
 * 3. **Override the whole family.** Every colour, typography, radius, focus and
 *    shadow token is set, so no default from the layer underneath can show
 *    through a gap in the map.
 *
 * What survived, what was approximated and what could not be expressed is
 * written up in `docs/design/fidelity-report.md`.
 */
import {defineTheme} from '@astryxdesign/core/theme';
import {tectonIcons} from './icons.js';
import {shades} from './palette.generated.js';
import {
  tectonColor,
  ramp,
  tint,
  both,
  black,
  ink,
  type ColorPair,
} from './semantic.js';
import {tectonLocalTokens} from './localTokens.js';
import {tectonComponents} from './components.js';
import {fontSizes, fontWeights, typeScaleTokens} from './typography.js';

const {text, surface, action, status, component} = tectonColor;

/** A token that is the same in both modes — the dark side of a Tecton pair. */
const fixed = (value: ColorPair) => both(value[1]);

/** Tecton is flat; the shadows that remain are soft drops, not lifts. */
const drop = (
  offset: string,
  blur: string,
  lightStep: string,
  darkStep: string,
) =>
  `0px ${offset} ${blur} light-dark(${
    shades.blackTransparent[lightStep as keyof typeof shades.blackTransparent]
  }, ${
    shades.blackTransparent[darkStep as keyof typeof shades.blackTransparent]
  })`;

/** An inset validation ring, drawn from a family's alpha ladder. */
const insetRing = (value: ColorPair) =>
  `inset 0px 0px 0px 2px light-dark(${value[0]}, ${value[1]})`;

export const tectonTheme = defineTheme({
  name: 'tecton',
  icons: tectonIcons,

  /**
   * Figtree for the interface, IBM Plex Mono for anything measured. The scale
   * is written out token by token below rather than generated, because Tecton's
   * ladder (10/12/14/16/20/24/32/40/48) is not geometric.
   *
   * Both families are the host application's to load; the theme only names
   * them, and `astryx theme build` warns about exactly that.
   */
  typography: {
    body: {
      family: 'Figtree',
      fallbacks: 'Helvetica, Arial, sans-serif',
    },
    heading: {
      family: 'Figtree',
      fallbacks: 'Helvetica, Arial, sans-serif',
      weight: 'medium',
    },
    code: {
      family: 'IBM Plex Mono',
      fallbacks: 'Consolas, Monaco, monospace',
    },
  },

  localTokens: tectonLocalTokens,

  tokens: {
    /* ---------------------------------------------------------------- */
    /* Core semantic colour                                             */
    /* ---------------------------------------------------------------- */
    /** The primary action violet. */
    '--color-accent': action.primary.background,
    /** A 25 % violet wash — selection and hover tints derived from the accent. */
    '--color-accent-muted': tint('violet', '25'),
    '--color-on-accent': action.primary.text,
    /** The secondary action fill, which the system also uses as its neutral. */
    '--color-neutral': action.secondary.background,

    /* Surfaces. Tecton elevation runs *dark*: a panel is darker than its page. */
    '--color-background-body': surface.backgroundDefault,
    '--color-background-surface': surface.backgroundElevated,
    '--color-background-card': surface.backgroundElevated,
    '--color-background-popover': surface.backgroundElevated,
    '--color-background-muted': component.input.filled.background,
    '--color-background-inverted': text.primary,
    '--color-background-error-inverted': status.error.bright,

    /**
     * Scrims and tints. Tecton states are explicit fills, not composited
     * alphas, so these three are the theme's own: a black scrim at the same
     * strength in both modes, and hover/pressed tints from the shade ladder.
     */
    '--color-overlay': black('50'),
    '--color-overlay-hover': ink('10'),
    '--color-overlay-pressed': ink('20'),

    /* Text */
    '--color-text-primary': text.primary,
    '--color-text-secondary': text.secondary,
    '--color-text-disabled': text.disabled,
    /** Tecton links carry no colour; this is the adornment lilac. */
    '--color-text-accent': action.primary.adornment,
    '--color-on-dark': fixed(text.primary),
    '--color-on-light': fixed(text.inverse),

    /* Icon */
    '--color-icon-primary': text.primary,
    '--color-icon-secondary': text.subtlest,
    '--color-icon-disabled': action.disabled.filledAdornment,
    '--color-icon-accent': action.primary.adornment,

    /* Status */
    /*
     * `--color-*-muted` is composited *behind* status text (validation
     * messages, tinted badges), so it has to be a wash. Tecton's own "Muted"
     * step is a solid mid-tone — it lives on `--tecton-color-*-muted` and is
     * used where the design paints a solid.
     */
    '--color-success': status.success.filledBackground,
    '--color-success-muted': tint('green', '25'),
    '--color-on-success': status.success.filledText,
    '--color-error': status.error.filledBackground,
    '--color-error-muted': tint('red', '25'),
    '--color-on-error': status.error.filledText,
    '--color-warning': status.warning.filledBackground,
    '--color-warning-muted': tint('yellow', '25'),
    '--color-on-warning': status.warning.filledText,

    /* Borders */
    '--color-border': surface.dividerSubtle,
    '--color-border-emphasized': surface.dividerMedium,

    /* Effects */
    '--color-skeleton': action.secondary.background,
    /** The progress/slider channel — Tecton draws it at divider-strong weight. */
    '--color-track': component.progress.track,
    '--color-shadow': [
      shades.blackTransparent['15'],
      shades.blackTransparent['50'],
    ],
    '--color-tint-hover': [shades.black, shades.white],

    /* ---------------------------------------------------------------- */
    /* Hue families                                                     */
    /* ---------------------------------------------------------------- */
    /* Ten hue slots, seven Tecton accents. `cyan` and `teal` both take    */
    /* azure and `orange` takes saffron; see the fidelity report.          */
    '--color-background-blue': tint('blue', '25'),
    '--color-border-blue': ramp('blue', '680'),
    '--color-icon-blue': ramp('blue', '680'),
    '--color-text-blue': ramp('blue', '1000'),

    '--color-background-cyan': tint('azure', '25'),
    '--color-border-cyan': ramp('azure', '560'),
    '--color-icon-cyan': ramp('azure', '560'),
    '--color-text-cyan': ramp('azure', '1000'),

    '--color-background-teal': tint('azure', '25'),
    '--color-border-teal': ramp('azure', '560'),
    '--color-icon-teal': ramp('azure', '560'),
    '--color-text-teal': ramp('azure', '1000'),

    '--color-background-gray': tint('graphite', '25'),
    '--color-border-gray': ramp('graphite', '560'),
    '--color-icon-gray': ramp('graphite', '560'),
    '--color-text-gray': ramp('graphite', '1000'),

    '--color-background-green': tint('green', '25'),
    '--color-border-green': ramp('green', '560'),
    '--color-icon-green': ramp('green', '560'),
    '--color-text-green': ramp('green', '1000'),

    '--color-background-orange': tint('saffron', '25'),
    '--color-border-orange': ramp('saffron', '560'),
    '--color-icon-orange': ramp('saffron', '560'),
    '--color-text-orange': ramp('saffron', '1000'),

    '--color-background-pink': tint('pink', '25'),
    '--color-border-pink': ramp('pink', '560'),
    '--color-icon-pink': ramp('pink', '560'),
    '--color-text-pink': ramp('pink', '1000'),

    '--color-background-purple': tint('lilac', '25'),
    '--color-border-purple': ramp('lilac', '560'),
    '--color-icon-purple': ramp('lilac', '560'),
    '--color-text-purple': ramp('lilac', '1000'),

    '--color-background-red': tint('red', '25'),
    '--color-border-red': ramp('red', '560'),
    '--color-icon-red': ramp('red', '560'),
    '--color-text-red': ramp('red', '1000'),

    '--color-background-yellow': tint('lemon', '25'),
    '--color-border-yellow': ramp('lemon', '560'),
    '--color-icon-yellow': ramp('lemon', '560'),
    '--color-text-yellow': ramp('lemon', '1000'),

    /* ---------------------------------------------------------------- */
    /* Focus                                                            */
    /* ---------------------------------------------------------------- */
    /* Hot pink, 2px, hugging the control. Every interactive component in  */
    /* the design draws this ring — except Tab, which draws a dark box.    */
    '--focus-outline-color': action.focusRing,
    '--focus-outline-width': '2px',
    '--focus-outline-style': 'solid',
    '--focus-outline-offset': '2px',

    /* ---------------------------------------------------------------- */
    /* Shape                                                            */
    /* ---------------------------------------------------------------- */
    /* Tecton's seven radii mapped onto five semantic steps.               */
    '--radius-none': '0px', // radius.0
    '--radius-inner': '2px', // radius.25 — dense controls
    '--radius-element': '4px', // radius.50 — the default Tecton corner
    '--radius-container': '8px', // radius.100 — panels and cards
    '--radius-chat': '12px', // radius.150
    '--radius-page': '16px', // radius.200
    '--radius-full': '9999px', // radius.round (1000px in the source)

    /* ---------------------------------------------------------------- */
    /* Size and border                                                  */
    /* ---------------------------------------------------------------- */
    /* Tecton names two control heights, md 32 and sm 28, which land on the */
    /* same values the layer underneath already uses; lg has no Tecton      */
    /* source and keeps 36.                                                 */
    '--size-element-sm': '28px',
    '--size-element-md': '32px',
    '--size-element-lg': '36px',
    '--border-width': '1px',

    /* ---------------------------------------------------------------- */
    /* Elevation                                                        */
    /* ---------------------------------------------------------------- */
    /* The design has no drop shadow on any panel — depth is carried by a  */
    /* 1px rule and by getting darker. The three steps are kept soft so a  */
    /* component that insists on elevation does not break the flat look.   */
    '--shadow-low': drop('1px', '2px', '10', '40'),
    '--shadow-med': drop('2px', '6px', '15', '50'),
    '--shadow-high': drop('8px', '24px', '20', '60'),
    '--shadow-inset-hover': insetRing(tint('mauve', '25')),
    '--shadow-inset-selected':
      'inset 0px 0px 0px 2px var(--focus-outline-color)',
    '--shadow-inset-success': insetRing(tint('green', '30')),
    '--shadow-inset-warning': insetRing(tint('yellow', '30')),
    '--shadow-inset-error': insetRing(tint('red', '30')),

    /* ---------------------------------------------------------------- */
    /* Typography                                                       */
    /* ---------------------------------------------------------------- */
    ...fontSizes,
    ...fontWeights,
    ...typeScaleTokens,
  },

  components: tectonComponents,

  /**
   * Content rendered onto an inverted surface (a dark tooltip on a light page,
   * or the reverse). Tecton has one ink ladder, so each surface simply pins the
   * side of the pair that reads on it.
   */
  onDark: {
    tokens: {
      '--color-text-primary': fixed(text.primary),
      '--color-text-secondary': fixed(text.secondary),
      '--color-background-surface': fixed(surface.backgroundElevated),
      '--color-border': fixed(surface.dividerSubtle),
    },
  },
  onLight: {
    tokens: {
      '--color-text-primary': both(text.primary[0]),
      '--color-text-secondary': both(text.secondary[0]),
      '--color-background-surface': both(surface.backgroundElevated[0]),
      '--color-border': both(surface.dividerSubtle[0]),
    },
  },
});
