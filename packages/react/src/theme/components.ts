/**
 * Component overrides.
 *
 * The token layer gets the palette right everywhere at once; this file is for
 * the places where Tecton's *shape* differs from the component library's — a
 * checkbox that fills near-white instead of accent, a banner whose severity
 * fill carries dark text, a table whose header is the lightest surface in the
 * component, two button emphases that need a variant of their own.
 *
 * Every key is a theming target verified with `astryx theme targets` /
 * `astryx component <Name>`; an unknown key fails the theme build, so this file
 * is checked on every `pnpm --filter @tecton/react build`.
 *
 * Values prefer `var(--token)` over a literal, so a consumer who re-points a
 * token moves the components with it. Where a role has no token, the pair is
 * inlined as `light-dark(light, dark)`.
 */
import {tectonColor, type ColorPair} from './semantic.js';
import {local} from './localTokens.js';
import {customTextTypeStyles} from './typography.js';

const {text, surface, action, status, accent, component} = tectonColor;

/** Render a `[light, dark]` pair as a CSS value. */
function pair(value: ColorPair): string {
  return value[0] === value[1]
    ? value[0]
    : `light-dark(${value[0]}, ${value[1]})`;
}

const RADIUS_CONTROL = 'var(--radius-element)'; // 4px — the Tecton corner
const RADIUS_INNER = 'var(--radius-inner)'; // 2px — dense controls
const RADIUS_PILL = 'var(--radius-full)'; // chips and badges are full pills

/**
 * Turn off the hover/pressed tint the base components composite on top of a
 * background. Tecton states are named fills, not washes, so anywhere this file
 * sets an explicit hover colour the tint has to be suppressed or the two stack.
 */
const NO_OVERLAY_TINT = {
  '--color-overlay-hover': 'transparent',
  '--color-overlay-pressed': 'transparent',
} as const;

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Tecton's five button emphases are `primary / secondary / tertiary / outlined
 * / textOnly`; the library ships `primary / secondary / ghost / destructive`.
 * `ghost` carries Tecton's tertiary, and `outlined` and `text-only` are added
 * as custom variants so the ladder survives intact. Tecton has no destructive
 * button at all — the variant is kept and painted from the error role so a
 * consumer reaching for it gets something coherent.
 */
const button = {
  base: {
    borderRadius: RADIUS_CONTROL,
    fontWeight: 'var(--font-weight-medium)',
    // The focus ring hugs the control: ~1px outside the edge, not 3px.
    '--button-focus-offset': '1px',
    // Every Tecton button state is an explicit fill, so the composited
    // hover/pressed tint has to go — otherwise it stacks on top of the fill
    // and text-only grows a background it should never have.
    ...NO_OVERLAY_TINT,
  },
  'variant:primary': {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-on-accent)',
    ':hover': {backgroundColor: pair(action.primary.hoverBackground)},
    ':active': {backgroundColor: pair(action.primary.pressBackground)},
    ':disabled': {
      backgroundColor: pair(action.disabled.filledBackground),
      color: pair(action.disabled.filledText),
    },
  },
  'variant:secondary': {
    backgroundColor: pair(action.secondary.background),
    color: pair(action.secondary.text),
    ':hover': {
      backgroundColor: pair(action.secondary.hoverBackground),
      color: pair(action.secondary.hoverText),
    },
    ':active': {
      backgroundColor: pair(action.secondary.pressBackground),
      color: pair(action.secondary.pressText),
    },
    ':disabled': {
      backgroundColor: pair(action.disabled.filledBackground),
      color: pair(action.disabled.filledText),
    },
  },
  'variant:ghost': {
    backgroundColor: pair(action.tertiary.background),
    color: pair(action.tertiary.text),
    ':hover': {
      backgroundColor: pair(action.tertiary.hoverBackground),
      color: pair(action.tertiary.hoverText),
    },
    ':active': {
      backgroundColor: pair(action.tertiary.pressBackground),
      color: pair(action.tertiary.pressText),
    },
    ':disabled': {
      backgroundColor: pair(action.disabled.filledBackground),
      color: pair(action.disabled.filledText),
    },
  },
  'variant:destructive': {
    backgroundColor: 'var(--color-error)',
    color: 'var(--color-on-error)',
    ':hover': {backgroundColor: pair(status.error.filledHoverBackground)},
    ':active': {backgroundColor: pair(status.error.filledPressBackground)},
    ':disabled': {
      backgroundColor: pair(action.disabled.filledBackground),
      color: pair(action.disabled.filledText),
    },
  },
  /** NEW — Tecton "outlined": no fill, a 1px mauve rule, mauve ink. */
  'variant:outlined': {
    backgroundColor: pair(action.outlined.background),
    borderWidth: 'var(--border-width)',
    borderStyle: 'solid',
    borderColor: local('--tecton-color-action-outlined-border'),
    color: pair(action.outlined.text),
    ':hover': {
      backgroundColor: pair(action.outlined.hoverBackground),
      borderColor: pair(action.outlined.hoverBorder),
      color: pair(action.outlined.hoverText),
    },
    ':active': {
      backgroundColor: pair(action.outlined.pressBackground),
      borderColor: pair(action.outlined.pressBorder),
      color: pair(action.outlined.pressText),
    },
    ':disabled': {
      backgroundColor: pair(action.disabled.outlineBackground),
      borderColor: pair(action.disabled.outlineBorder),
      color: pair(action.disabled.outlineText),
    },
  },
  /** NEW — Tecton "textOnly": ink only, no fill in any state but focus. */
  'variant:text-only': {
    backgroundColor: pair(action.outlined.background),
    color: local('--tecton-color-action-text-only'),
    ':hover': {color: pair(action.textOnly.hoverText)},
    ':active': {color: pair(action.textOnly.pressText)},
    ':focus-visible': {backgroundColor: pair(action.textOnly.focusBackground)},
    ':disabled': {
      backgroundColor: pair(action.disabled.outlineBackground),
      color: pair(action.disabled.textOnlyText),
    },
  },
} as const;

/** The same emphases on a pressed toggle: Tecton's "activated" look. */
const toggleButton = {
  base: {borderRadius: RADIUS_CONTROL},
  isPressed: {
    backgroundColor: pair(action.outlined.pressBackground),
    color: pair(action.secondary.pressText),
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Fields                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Tecton's default field is the outlined one: transparent, a 1px graphite rule,
 * near-white value ink and a placeholder two steps down. `filled` and
 * `text-only` have no variant axis to hang off — see the fidelity report.
 */
const inputSurface = {
  backgroundColor: pair(component.input.outlined.background),
  borderColor: local('--tecton-color-input-border'),
  borderRadius: RADIUS_CONTROL,
  color: local('--tecton-color-input-value'),
  // Pseudo-classes nest inside a style block; at the component level the theme
  // compiler would read `:hover` as a state name and emit `[data-=""]`.
  ':hover': {borderColor: local('--tecton-color-input-border-hover')},
} as const;

const inputDisabled = {
  disabled: {
    borderColor: pair(action.disabled.outlineBorder),
    color: pair(action.disabled.outlineText),
  },
} as const;

/** Validation recolours the rule; the value ink stays readable. */
const inputStatus = {
  'status:error': {borderColor: pair(status.error.outlineStrongBorder)},
  'status:warning': {borderColor: pair(status.warning.outlineStrongBorder)},
  'status:success': {borderColor: pair(status.success.outlineStrongBorder)},
} as const;

/* -------------------------------------------------------------------------- */
/* Status-carrying components                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Tecton's alert is a saturated fill with *dark* ink on it. The library's
 * banner paints a tinted header and keeps body ink, so each status re-points
 * the ink tokens inside the banner rather than setting `color` once.
 */
function bannerStatus(fill: ColorPair, ink: ColorPair, glyph: ColorPair) {
  return {
    backgroundColor: pair(fill),
    '--color-text-primary': pair(ink),
    '--color-text-secondary': pair(ink),
    '--color-icon-primary': pair(glyph),
    '--color-icon-secondary': pair(glyph),
  };
}

const banner = {
  'status:info': bannerStatus(
    status.info.filledBackground,
    status.info.filledText,
    status.info.filledAdornment,
  ),
  'status:success': bannerStatus(
    status.success.filledBackground,
    status.success.filledText,
    status.success.filledAdornment,
  ),
  'status:warning': bannerStatus(
    status.warning.filledBackground,
    status.warning.filledText,
    status.warning.filledAdornment,
  ),
  'status:error': bannerStatus(
    status.error.filledBackground,
    status.error.filledText,
    status.error.filledAdornment,
  ),
  /** NEW — Tecton's fifth severity, which the library does not ship. */
  'status:neutral': bannerStatus(
    status.neutral.filledBackground,
    status.neutral.filledText,
    status.neutral.filledAdornment,
  ),
} as const;

const bannerIcon = {
  'status:info': {color: pair(status.info.filledAdornment)},
  'status:success': {color: pair(status.success.filledAdornment)},
  'status:warning': {color: pair(status.warning.filledAdornment)},
  'status:error': {color: pair(status.error.filledAdornment)},
  'status:neutral': {color: pair(status.neutral.filledAdornment)},
} as const;

/**
 * The library's badge is a standalone pill, which is Tecton's *chip*, so the
 * badge variants are painted from the chip matrix: neutral and the four
 * severities are solid fills, the hue variants stay tinted.
 */
function badgeFill(fill: ColorPair, ink: ColorPair) {
  return {backgroundColor: pair(fill), color: pair(ink)};
}

function badgeTint(hue: string) {
  return {
    backgroundColor: `var(--color-background-${hue})`,
    color: `var(--color-text-${hue})`,
  };
}

const badge = {
  base: {borderRadius: RADIUS_PILL},
  'variant:neutral': badgeFill(
    component.chip.defaultFill,
    component.chip.defaultText,
  ),
  'variant:info': badgeFill(
    status.info.filledBackground,
    status.info.filledText,
  ),
  'variant:success': badgeFill(
    status.success.filledBackground,
    status.success.filledText,
  ),
  'variant:warning': badgeFill(
    status.warning.filledBackground,
    status.warning.filledText,
  ),
  'variant:error': badgeFill(
    status.error.filledBackground,
    status.error.filledText,
  ),
  /** NEW — lime is a Tecton accent with no hue family to borrow. */
  'variant:lime': badgeFill(accent.lime.fill, component.badge.contrastText),
  'variant:blue': badgeTint('blue'),
  'variant:cyan': badgeTint('cyan'),
  'variant:green': badgeTint('green'),
  'variant:orange': badgeTint('orange'),
  'variant:pink': badgeTint('pink'),
  'variant:purple': badgeTint('purple'),
  'variant:red': badgeTint('red'),
  'variant:teal': badgeTint('teal'),
  'variant:yellow': badgeTint('yellow'),
} as const;

/** The chip: same colour logic, one size step smaller, always a pill. */
const token = {
  base: {borderRadius: RADIUS_PILL},
  'color:default': badgeFill(
    component.chip.defaultFill,
    component.chip.defaultText,
  ),
  'color:red': badgeTint('red'),
  'color:orange': badgeTint('orange'),
  'color:yellow': badgeTint('yellow'),
  'color:green': badgeTint('green'),
  'color:teal': badgeTint('teal'),
  'color:cyan': badgeTint('cyan'),
  'color:blue': badgeTint('blue'),
  'color:purple': badgeTint('purple'),
  'color:pink': badgeTint('pink'),
  'color:gray': badgeTint('gray'),
} as const;

/** Status dots take the severity "Main" values; `accent` borrows info. */
const statusDot = {
  'variant:success': {backgroundColor: pair(status.success.main)},
  'variant:warning': {backgroundColor: pair(status.warning.main)},
  'variant:error': {backgroundColor: pair(status.error.main)},
  'variant:accent': {backgroundColor: local('--tecton-color-info')},
  'variant:neutral': {backgroundColor: pair(status.neutral.main)},
} as const;

const avatarStatusDot = {
  'variant:success': {backgroundColor: pair(status.success.main)},
  'variant:error': {backgroundColor: pair(status.error.main)},
} as const;

/* -------------------------------------------------------------------------- */
/* Selection controls                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Tecton reads selection as a *bright chip*, not as an accent: a checked box is
 * near-white with dark ink, and the switch is the only control that carries the
 * violet.
 */
const checkboxIndicator = {
  base: {
    backgroundColor: pair(component.input.outlined.background),
    borderColor: pair(component.checkbox.border),
    borderRadius: RADIUS_INNER,
    ':hover': {borderColor: pair(component.checkbox.hoverBorder)},
  },
  checked: {
    backgroundColor: pair(component.checkbox.checkedFill),
    borderColor: pair(component.checkbox.checkedFill),
    color: pair(component.checkbox.glyph),
  },
  disabled: {
    borderColor: pair(component.checkbox.disabledBorder),
  },
} as const;

const radioIndicator = {
  base: {
    backgroundColor: pair(component.input.outlined.background),
    borderColor: pair(component.checkbox.border),
    ':hover': {borderColor: pair(component.checkbox.hoverBorder)},
  },
  checked: {
    borderColor: pair(component.checkbox.checkedFill),
  },
  disabled: {
    borderColor: pair(component.checkbox.disabledBorder),
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Tecton panels are flat: a 1px subtle rule, 16px of padding, no shadow.
 * Elevation runs *dark* — a panel is darker than the page it sits on — so the
 * card surface token is the elevated one and the shadow is dropped.
 */
const card = {
  base: {
    backgroundColor: 'var(--color-background-card)',
    borderWidth: 'var(--border-width)',
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 'var(--radius-container)',
    padding: 'var(--spacing-4)',
    boxShadow: 'none',
  },
} as const;

export const tectonComponents = {
  /* Actions ------------------------------------------------------------- */
  button,
  'toggle-button': toggleButton,
  'button-group': {base: {borderRadius: RADIUS_CONTROL}},
  'segmented-control': {
    base: {
      backgroundColor: pair(component.tab.stripBackground),
      borderRadius: RADIUS_CONTROL,
      padding: 'var(--spacing-0-5)',
    },
  },
  'segmented-control-item': {
    base: {borderRadius: RADIUS_INNER, color: pair(component.tab.restText)},
    selected: {
      backgroundColor: pair(component.tab.filledSelected),
      color: pair(component.tab.selectedText),
      boxShadow: 'none',
    },
  },
  link: {
    base: {color: 'var(--color-text-primary)'},
    'color:accent': {color: 'var(--color-text-accent)'},
  },

  /* Fields ---------------------------------------------------------------- */
  'text-input': {base: inputSurface, ...inputDisabled, ...inputStatus},
  'text-area': {base: inputSurface, ...inputDisabled, ...inputStatus},
  'text-area-control': {base: {color: local('--tecton-color-input-value')}},
  selector: {base: inputSurface, ...inputDisabled, ...inputStatus},
  typeahead: {base: inputSurface},
  tokenizer: {base: inputSurface},
  'input-group': {base: {borderRadius: RADIUS_CONTROL}},
  field: {base: {borderRadius: RADIUS_CONTROL}},
  'field-label': {base: {color: pair(component.input.outlined.contrastText)}},
  'field-status': {
    base: {color: pair(component.input.outlined.contrastText)},
    'type:error': {color: pair(status.error.outlineText)},
    'type:warning': {color: pair(status.warning.outlineText)},
    'type:success': {color: pair(status.success.outlineText)},
  },
  'input-status-icon': {
    'status:error': {color: pair(status.error.outlineText)},
    'status:warning': {color: pair(status.warning.outlineText)},
    'status:success': {color: pair(status.success.outlineText)},
  },
  'selector-option-row': {
    base: {borderRadius: RADIUS_INNER},
    selected: {backgroundColor: local('--tecton-color-table-row-selected')},
  },

  /* Selection ------------------------------------------------------------- */
  'checkbox-indicator': checkboxIndicator,
  // The tick is drawn in `currentColor`, which the checked box above sets to
  // the dark glyph. The indeterminate dash is a separate element painted from
  // `--color-on-accent` and is left alone — see the fidelity report.
  'checkbox-indicator-check': {base: {color: pair(component.checkbox.glyph)}},
  'radio-indicator': radioIndicator,
  'radio-indicator-dot': {
    base: {backgroundColor: pair(component.checkbox.checkedFill)},
  },
  switch: {
    base: {
      backgroundColor: pair(component.input.outlined.background),
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: pair(component.switch.offBorder),
    },
    checked: {
      backgroundColor: pair(component.switch.onTrack),
      borderColor: pair(component.switch.onTrack),
    },
    disabled: {borderColor: pair(component.switch.disabledTrack)},
  },
  'switch-thumb': {
    base: {backgroundColor: pair(component.switch.offThumb)},
    checked: {backgroundColor: pair(component.switch.onThumb)},
  },

  /* Status ---------------------------------------------------------------- */
  banner,
  'banner-icon': bannerIcon,
  'banner-frame': {
    base: {
      backgroundColor: 'var(--color-background-card)',
      borderRadius: RADIUS_CONTROL,
      boxShadow: 'none',
    },
  },
  badge,
  token,
  'status-dot': statusDot,
  'avatar-status-dot': avatarStatusDot,
  'progress-bar-track': {
    base: {backgroundColor: 'var(--color-track)'},
  },
  'progress-bar-fill': {
    'variant:accent': {backgroundColor: pair(component.progress.primary)},
    'variant:success': {backgroundColor: pair(status.success.filledBackground)},
    'variant:warning': {backgroundColor: pair(status.warning.filledBackground)},
    'variant:error': {backgroundColor: pair(status.error.filledBackground)},
    'variant:neutral': {backgroundColor: pair(status.neutral.main)},
  },

  /* Navigation and lists -------------------------------------------------- */
  tab: {
    base: {
      color: pair(component.tab.restText),
      ':hover': {color: pair(action.tertiary.hoverText)},
    },
    selected: {
      color: pair(component.tab.selectedText),
      fontWeight: 'var(--font-weight-medium)',
    },
  },
  'tab-indicator': {
    selected: {backgroundColor: pair(component.tab.selectedText)},
  },
  'tab-strip': {base: {borderColor: 'var(--color-border)'}},
  item: {
    base: {
      borderRadius: RADIUS_INNER,
      ...NO_OVERLAY_TINT,
      ':hover': {backgroundColor: local('--tecton-color-table-row-hover')},
    },
  },
  'list-item': {
    base: {
      ...NO_OVERLAY_TINT,
      ':hover': {backgroundColor: local('--tecton-color-table-row-hover')},
    },
  },
  'dropdown-menu': {
    base: {
      backgroundColor: 'var(--color-background-popover)',
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: 'var(--color-border)',
      borderRadius: RADIUS_CONTROL,
      boxShadow: 'none',
    },
  },
  'dropdown-menu-item': {
    base: {
      borderRadius: RADIUS_INNER,
      ...NO_OVERLAY_TINT,
      ':hover': {backgroundColor: local('--tecton-color-table-row-hover')},
    },
    'variant:destructive': {color: pair(status.error.outlineText)},
  },
  'tree-list-item': {
    selected: {backgroundColor: local('--tecton-color-table-row-selected')},
  },
  'top-nav': {
    base: {
      backgroundColor: local('--tecton-color-top-nav-background'),
      color: local('--tecton-color-top-nav-text'),
    },
  },
  'top-nav-item': {
    base: {color: local('--tecton-color-top-nav-text')},
    selected: {color: pair(text.primary)},
  },

  /* Data ------------------------------------------------------------------ */
  table: {base: {borderColor: 'var(--color-border)'}},
  'table-header': {
    base: {backgroundColor: local('--tecton-color-table-header')},
  },
  'table-header-cell': {
    base: {
      backgroundColor: local('--tecton-color-table-header'),
      color: 'var(--color-text-primary)',
      fontWeight: 'var(--font-weight-medium)',
    },
  },
  'table-row': {
    base: {
      ...NO_OVERLAY_TINT,
      // Tecton's zebra stripe is a neutral band, not the muted surface the
      // base stripe uses.
      ':nth-child(even)': {
        backgroundColor: local('--tecton-color-table-stripe'),
      },
      ':hover': {backgroundColor: local('--tecton-color-table-row-hover')},
    },
  },
  'table-cell': {base: {borderColor: 'var(--color-border)'}},
  'table-footer': {
    base: {backgroundColor: local('--tecton-color-table-footer')},
  },

  /* Surfaces -------------------------------------------------------------- */
  card,
  section: {base: {padding: 'var(--spacing-4)'}},
  dialog: {
    base: {
      backgroundColor: 'var(--color-background-popover)',
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: 'var(--color-border)',
      borderRadius: 'var(--radius-container)',
    },
  },
  popover: {
    base: {
      backgroundColor: 'var(--color-background-popover)',
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: 'var(--color-border)',
      borderRadius: RADIUS_CONTROL,
      boxShadow: 'none',
    },
  },
  tooltip: {
    base: {
      backgroundColor: 'var(--color-background-popover)',
      color: 'var(--color-text-primary)',
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: 'var(--color-border)',
      borderRadius: RADIUS_INNER,
    },
  },
  divider: {
    base: {backgroundColor: pair(surface.dividerMedium)},
    'variant:subtle': {backgroundColor: pair(surface.dividerSubtle)},
    'variant:strong': {backgroundColor: local('--tecton-color-divider-strong')},
  },
  skeleton: {base: {backgroundColor: 'var(--color-skeleton)'}},
  avatar: {
    base: {
      backgroundColor: pair(component.avatar.fill),
      color: pair(component.avatar.contrastText),
    },
  },
  'avatar-fallback': {
    base: {
      backgroundColor: pair(component.avatar.fill),
      color: pair(component.avatar.contrastText),
    },
  },
  kbd: {
    base: {
      backgroundColor: 'var(--color-background-muted)',
      borderRadius: RADIUS_INNER,
    },
  },
  'code-block': {
    base: {
      backgroundColor: 'var(--color-background-muted)',
      borderRadius: RADIUS_CONTROL,
    },
  },
  slider: {base: {color: pair(component.checkbox.checkedFill)}},
  'slider-track': {base: {backgroundColor: 'var(--color-track)'}},
  'slider-thumb': {
    base: {backgroundColor: pair(component.checkbox.checkedFill)},
  },

  /* Type ------------------------------------------------------------------ */
  text: {
    ...customTextTypeStyles,
    'color:placeholder': {color: local('--tecton-color-text-placeholder')},
  },
  heading: {base: {fontFamily: 'var(--font-family-heading)'}},
} as const;

export type TectonComponentOverrides = typeof tectonComponents;
