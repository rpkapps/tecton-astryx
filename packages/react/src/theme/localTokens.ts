/**
 * Theme-local tokens — the Tecton roles the token layer underneath has no
 * name for.
 *
 * Everything here is a real Tecton colour role that no portable token maps to:
 * the `info` and `neutral` status ladders, the lime accent, placeholder ink,
 * the strong divider, the top-nav band, the table surfaces and the two input
 * appearances Tecton has beyond the outlined default. Component overrides read
 * them by name, and application styles can too — they are ordinary custom
 * properties set on the theme root.
 *
 * Names are Tecton's own (`--tecton-…`); the prefix is a convention, not a
 * claim of ownership.
 */
import {tectonColor, type ColorPair} from './semantic.js';

const {status, accent, text, surface, component} = tectonColor;

/** Every theme-local token, with the Tecton role it carries. */
export const tectonLocalTokens = {
  /* Text ------------------------------------------------------------------ */
  /** Input placeholder ink. */
  '--tecton-color-text-placeholder': text.placeholder,

  /* Dividers -------------------------------------------------------------- */
  /** High-emphasis separator — the third emphasis Tecton has and Astryx lacks. */
  '--tecton-color-divider-strong': surface.dividerStrong,

  /* The solid "Muted" step of each severity ------------------------------- */
  /* The portable `--color-*-muted` tokens are washes, because that is what the
     components composite them as. Tecton's own Muted role is a solid mid-tone,
     kept here for anything that wants the design's exact value. */
  '--tecton-color-success-muted': status.success.muted,
  '--tecton-color-warning-muted': status.warning.muted,
  '--tecton-color-error-muted': status.error.muted,

  /* Info status ----------------------------------------------------------- */
  /** Info "Main" — the periwinkle the panels use for informational values. */
  '--tecton-color-info': status.info.main,
  '--tecton-color-info-bright': status.info.bright,
  '--tecton-color-info-muted': status.info.muted,
  '--tecton-color-info-filled': status.info.filledBackground,
  '--tecton-color-on-info': status.info.filledText,
  '--tecton-color-info-adornment': status.info.filledAdornment,

  /* Neutral status -------------------------------------------------------- */
  '--tecton-color-status-neutral': status.neutral.main,
  '--tecton-color-status-neutral-filled': status.neutral.filledBackground,
  '--tecton-color-on-status-neutral': status.neutral.filledText,

  /* Lime accent ----------------------------------------------------------- */
  /** Lime has no hue family in the token layer; progress and badges use it. */
  '--tecton-color-accent-lime': accent.lime.fill,
  '--tecton-color-text-lime': accent.lime.text,

  /* Top navigation -------------------------------------------------------- */
  '--tecton-color-top-nav-background': component.topNav.solidBackground,
  '--tecton-color-top-nav-text': component.topNav.contrastText,
  '--tecton-color-top-nav-adornment': component.topNav.adornment,

  /* Table ----------------------------------------------------------------- */
  '--tecton-color-table-header': component.table.headerBackground,
  '--tecton-color-table-footer': component.table.footer,
  '--tecton-color-table-stripe': component.table.cellBackgroundAlt,
  '--tecton-color-table-row-hover': component.table.cellHoverBackground,
  '--tecton-color-table-row-selected': component.table.cellActiveBackground,

  /* Input appearances ----------------------------------------------------- */
  /** The filled field: a solid surface with no border. */
  '--tecton-color-input-filled-background': component.input.filled.background,
  '--tecton-color-input-filled-hover': component.input.filled.hoverBackground,
  /** The outlined field (the default) — border, value ink, placeholder ink. */
  '--tecton-color-input-border': component.input.outlined.border,
  '--tecton-color-input-border-hover': component.input.outlined.hoverBorder,
  '--tecton-color-input-value': component.input.outlined.valueText,
  '--tecton-color-input-placeholder': component.input.outlined.placeholderText,
  /** The text-only field: an underline and nothing else. */
  '--tecton-color-input-text-only-rule': component.input.textOnly.contrastText,

  /* Action variants Astryx has no variant slot for ------------------------ */
  '--tecton-color-action-outlined-border': tectonColor.action.outlined.text,
  '--tecton-color-action-text-only': tectonColor.action.textOnly.text,
} as const satisfies Record<`--tecton-${string}`, ColorPair>;

/** The name of every theme-local token, for documentation and tests. */
export type TectonLocalTokenName = keyof typeof tectonLocalTokens;

/** Reference a theme-local token from a component override or a style value. */
export function local(name: TectonLocalTokenName): string {
  return `var(${name})`;
}
