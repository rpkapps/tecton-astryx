/**
 * Token helpers.
 *
 * Two ways in, for two audiences:
 *
 * - `tecton` is the map to reach for. It names the design roles the way the
 *   Tecton foundation names them — `tecton.color.text.primary`,
 *   `tecton.color.status.info.fill`, `tecton.radius.element` — and every leaf is
 *   a ready-to-use `var(--…)` reference. Roles the underlying token layer has
 *   no name for (placeholder ink, the info and neutral severities, the lime
 *   accent, the table surfaces, the top-nav band) resolve to Tecton's own
 *   theme-local custom properties, so the map is complete rather than a subset.
 * - `tectonToken(name)` and the `*Tokens` maps are the escape hatch: reach a
 *   custom property by its literal name when the semantic map has no entry for
 *   what you are doing.
 *
 * Both are plain strings, so they work in inline styles, in StyleX, in any
 * CSS-in-JS layer, and in a `style` attribute on a server-rendered page. None
 * of them read a value — the cascade does that, which is what makes light and
 * dark work without a re-render.
 */
import {
  colorVars,
  spacingVars,
  radiusVars,
  shadowVars,
  sizeVars,
  borderVars,
  durationVars,
  textSizeVars,
  typeScaleVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';

export const colorTokens = colorVars;
export const spacingTokens = spacingVars;
export const radiusTokens = radiusVars;
export const shadowTokens = shadowVars;
export const sizeTokens = sizeVars;
export const borderTokens = borderVars;
export const durationTokens = durationVars;
export const textSizeTokens = textSizeVars;
export const typeScaleTokens = typeScaleVars;
export const typographyTokens = typographyVars;

/** A Tecton design token, written as its CSS custom property name. */
export type TectonTokenName = `--${string}`;

/**
 * Reference a design token from a style value.
 *
 * @example
 * <div style={{color: tectonToken('--color-text-primary')}} />
 */
export function tectonToken(name: TectonTokenName): string {
  return `var(${name})`;
}

const v = tectonToken;

/**
 * The Tecton design tokens, by the role they play.
 *
 * Phase 2 builds its components against this map; application code can use it
 * for anything the components do not cover.
 *
 * @example
 * const styles = stylex.create({
 *   readout: {
 *     color: tecton.color.text.primary,
 *     background: tecton.color.surface.raised,
 *     borderRadius: tecton.radius.element,
 *     padding: tecton.space.md,
 *   },
 * });
 */
export const tecton = {
  color: {
    /** Ink. */
    text: {
      primary: v('--color-text-primary'),
      secondary: v('--color-text-secondary'),
      disabled: v('--color-text-disabled'),
      /** Input placeholders — a Tecton role with no portable token. */
      placeholder: v('--tecton-color-text-placeholder'),
      /** Ink for an inverted surface. */
      inverse: v('--color-on-light'),
      /** The lilac adornment ink; Tecton links themselves take `text.primary`. */
      accent: v('--color-text-accent'),
    },
    /** Glyphs. Tecton draws icons a step dimmer than the text beside them. */
    icon: {
      primary: v('--color-icon-primary'),
      secondary: v('--color-icon-secondary'),
      disabled: v('--color-icon-disabled'),
      accent: v('--color-icon-accent'),
    },
    /**
     * Surfaces. Tecton elevation runs *dark*: `raised` is darker than `body`,
     * and content placed on a raised surface steps back up in lightness.
     */
    surface: {
      body: v('--color-background-body'),
      raised: v('--color-background-surface'),
      card: v('--color-background-card'),
      popover: v('--color-background-popover'),
      muted: v('--color-background-muted'),
      inverted: v('--color-background-inverted'),
      overlay: v('--color-overlay'),
    },
    /** The primary action violet and the ink that reads on it. */
    action: {
      accent: v('--color-accent'),
      accentMuted: v('--color-accent-muted'),
      onAccent: v('--color-on-accent'),
      neutral: v('--color-neutral'),
      /** Tecton's outlined emphasis: a rule with no fill. */
      outlinedBorder: v('--tecton-color-action-outlined-border'),
      /** Tecton's text-only emphasis: ink with no chrome. */
      textOnly: v('--tecton-color-action-text-only'),
    },
    /** Separators. Tecton has three emphases; `medium` is its default. */
    divider: {
      subtle: v('--color-border'),
      medium: v('--color-border-emphasized'),
      strong: v('--tecton-color-divider-strong'),
    },
    /**
     * The five severities. `fill` is the saturated surface, `on` the dark ink
     * that sits on it, `muted` and `bright` the two quieter steps.
     */
    status: {
      success: {
        fill: v('--color-success'),
        on: v('--color-on-success'),
        /** A wash, for tinting a surface. */
        muted: v('--color-success-muted'),
        /** Tecton's solid "Muted" step. */
        mutedSolid: v('--tecton-color-success-muted'),
      },
      warning: {
        fill: v('--color-warning'),
        on: v('--color-on-warning'),
        muted: v('--color-warning-muted'),
        mutedSolid: v('--tecton-color-warning-muted'),
      },
      error: {
        fill: v('--color-error'),
        on: v('--color-on-error'),
        muted: v('--color-error-muted'),
        mutedSolid: v('--tecton-color-error-muted'),
        bright: v('--color-background-error-inverted'),
      },
      info: {
        main: v('--tecton-color-info'),
        fill: v('--tecton-color-info-filled'),
        on: v('--tecton-color-on-info'),
        muted: v('--tecton-color-info-muted'),
        bright: v('--tecton-color-info-bright'),
      },
      neutral: {
        main: v('--tecton-color-status-neutral'),
        fill: v('--tecton-color-status-neutral-filled'),
        on: v('--tecton-color-on-status-neutral'),
      },
    },
    /** The seven Tecton accents, for categorical colour. */
    accent: {
      lemon: {fill: v('--color-icon-yellow'), text: v('--color-text-yellow')},
      graphite: {fill: v('--color-icon-gray'), text: v('--color-text-gray')},
      pink: {fill: v('--color-icon-pink'), text: v('--color-text-pink')},
      saffron: {fill: v('--color-icon-orange'), text: v('--color-text-orange')},
      blue: {fill: v('--color-icon-blue'), text: v('--color-text-blue')},
      azure: {fill: v('--color-icon-teal'), text: v('--color-text-teal')},
      /** Lime has no hue family underneath; it is Tecton's own. */
      lime: {
        fill: v('--tecton-color-accent-lime'),
        text: v('--tecton-color-text-lime'),
      },
    },
    /** Component surfaces Tecton names explicitly. */
    table: {
      header: v('--tecton-color-table-header'),
      footer: v('--tecton-color-table-footer'),
      stripe: v('--tecton-color-table-stripe'),
      rowHover: v('--tecton-color-table-row-hover'),
      rowSelected: v('--tecton-color-table-row-selected'),
    },
    topNav: {
      background: v('--tecton-color-top-nav-background'),
      text: v('--tecton-color-top-nav-text'),
      adornment: v('--tecton-color-top-nav-adornment'),
    },
    input: {
      border: v('--tecton-color-input-border'),
      borderHover: v('--tecton-color-input-border-hover'),
      value: v('--tecton-color-input-value'),
      placeholder: v('--tecton-color-input-placeholder'),
      filledBackground: v('--tecton-color-input-filled-background'),
      filledHover: v('--tecton-color-input-filled-hover'),
      textOnlyRule: v('--tecton-color-input-text-only-rule'),
    },
    /** The hot-pink focus ring. */
    focusRing: v('--focus-outline-color'),
    /** The channel behind a progress bar, a slider rail or a switch. */
    track: v('--color-track'),
    skeleton: v('--color-skeleton'),
  },

  /** Corner radii. `element` (4px) is the default Tecton corner. */
  radius: {
    none: v('--radius-none'),
    /** 2px — dense controls: a checkbox, a menu row. */
    inner: v('--radius-inner'),
    /** 4px — buttons, fields, chips, alerts. */
    element: v('--radius-element'),
    /** 8px — panels and cards. */
    container: v('--radius-container'),
    /** 12px — chat surfaces. */
    chat: v('--radius-chat'),
    /** 16px — page-level surfaces. */
    page: v('--radius-page'),
    full: v('--radius-full'),
  },

  /** The 4px spacing grid, under the names Tecton's layouts use. */
  space: {
    none: v('--spacing-0'),
    xxs: v('--spacing-0-5'),
    xs: v('--spacing-1'),
    sm: v('--spacing-2'),
    md: v('--spacing-3'),
    /** 16px — standard component padding. */
    lg: v('--spacing-4'),
    xl: v('--spacing-6'),
    xxl: v('--spacing-8'),
  },

  /** Control heights. Tecton names two; `lg` has no Tecton source. */
  size: {
    sm: v('--size-element-sm'),
    md: v('--size-element-md'),
    lg: v('--size-element-lg'),
  },

  /** Type. `family.data` is the monospace face every numeric readout uses. */
  font: {
    family: {
      body: v('--font-family-body'),
      heading: v('--font-family-heading'),
      data: v('--font-family-code'),
    },
    weight: {
      regular: v('--font-weight-normal'),
      medium: v('--font-weight-medium'),
    },
  },

  /** Elevation. Tecton is flat — these exist for the rare floating surface. */
  shadow: {
    low: v('--shadow-low'),
    med: v('--shadow-med'),
    high: v('--shadow-high'),
  },

  /** Border width. One value, everywhere. */
  border: {
    width: v('--border-width'),
  },
} as const;

/** The shape of the {@link tecton} token map. */
export type TectonTokens = typeof tecton;
