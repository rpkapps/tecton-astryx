/**
 * Component overrides.
 *
 * This file is the whole of Tecton's per-component styling, and it is the only
 * place Tecton styling lives at all: there is no Tecton component in front of
 * anything. The token layer gets the palette right everywhere at once; this
 * file is for the places where the Tecton *design*'s shape differs from the
 * component's — a checkbox that fills near-white instead of accent, a banner
 * whose severity fill carries dark text, a table whose header is the lightest
 * surface in the component, two button emphases that need a variant of their
 * own.
 *
 * Every key is a theming target verified with `astryx theme targets` /
 * `astryx component <Name>`; an unknown key fails the theme build, so this file
 * is checked on every `pnpm --filter @tecton/react build`.
 *
 * The custom variants below (`Button` `outlined` and `text-only`, `Banner`
 * `neutral`, `Badge` `lime`) are declared through `defineTheme`. They are
 * theme extensions of the component's own API — new values for a prop the
 * component already has, type-checked through the declarations the theme
 * compiler emits — not new components.
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
 * sets an explicit hover colour *for every state of every variant* the tint has
 * to be suppressed or the two stack.
 *
 * `Button` is the only place that is true: the design's button matrix names a
 * fill for enabled, hover, pressed, focus and disabled on all five emphases, so
 * nothing is left for a composited wash to do. Everywhere else — rows, menu
 * items, table rows — Tecton has one hover colour and the component has one
 * hover mechanism, so the colour goes *into* the mechanism (see
 * {@link hoverTint}) instead of turning it off and painting a second one.
 * Suppressing the tint and re-adding a `:hover` rule is what broke
 * `hasHover={false}` tables and non-interactive list rows.
 */
const NO_OVERLAY_TINT = {
  '--color-overlay-hover': 'transparent',
  '--color-overlay-pressed': 'transparent',
} as const;

/**
 * Give a component Tecton's hover fill *through* the token the component
 * already hovers with, so the component keeps deciding **when** to hover and
 * Tecton only decides what the hover looks like.
 */
const hoverTint = (color: string) => ({'--color-overlay-hover': color});

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `Button` ships `primary / secondary / ghost / destructive`; the Tecton design
 * draws five emphases. `ghost` carries Tecton's tertiary, and `outlined` and
 * `text-only` are added as custom variants so the ladder survives intact — two
 * more values for `variant`, on the same component. The Tecton design has no
 * destructive button at all; `destructive` is kept and painted from the error
 * role, so a consumer reaching for it gets something coherent rather than the
 * untouched default.
 */
const button = {
  base: {
    // No `borderRadius` here, and that is deliberate. `--radius-element` is
    // already Tecton's 4px corner, and `Button` shapes itself from it — but
    // inside a `ButtonGroup` it shapes itself from it *per corner*, squaring
    // the interior edges so the members butt together into one slab (which is
    // exactly what `design/components/button-group.md` describes). A
    // `border-radius` shorthand on the button's theme rule sits in a later
    // cascade layer than those per-corner rules and flattens all four corners,
    // which took every button group apart into a row of separate pills.
    //
    // `fontWeight` is not here either: the component already sets
    // `--font-weight-medium`, which Tecton already points at 500.

    // The focus ring hugs the control: ~1px outside the edge, not 3px.
    // `design/components/button.md`: "a hot-pink ring drawn ~1px outside the
    // button edge with a ~1px gap".
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

/**
 * The same emphases on a pressed toggle: Tecton's "activated" look.
 *
 * No `borderRadius`: `ToggleButton` is a `Button`, so it takes the 4px corner
 * from `--radius-element` already — and restating it as a shorthand would
 * square-off a toggle placed in a `ButtonGroup` exactly as it did for `Button`.
 */
const toggleButton = {
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
/**
 * A field's keyboard focus is its border going loud: the wrapper carries
 * `outline: none` and rings itself on `:focus-within`, colouring the border
 * `--color-accent` and laying a `--color-accent-muted` inset behind it.
 *
 * Neither survives Tecton untouched. Re-colouring the resting border from the
 * theme layer overrides the focused one with it, so a field that Tecton paints
 * stops showing focus at all; and a field Tecton does *not* paint rings in
 * `--color-accent`, which here is a dark violet at 2.2:1 against the page —
 * under the 3:1 WCAG 1.4.11 asks of a non-text indicator.
 *
 * So every field states its own focus, in the ink the design gives focus.
 * `design/components/textfield.md`: "a 2px hot-pink `#ff52a8` ring around the
 * field" — the 1px border plus a 1px inset, both in `--focus-outline-color`.
 */
const inputFocus = {
  ':focus-within': {
    borderColor: 'var(--focus-outline-color)',
    boxShadow: 'inset 0px 0px 0px 1px var(--focus-outline-color)',
  },
} as const;

const inputSurface = {
  backgroundColor: pair(component.input.outlined.background),
  borderColor: local('--tecton-color-input-border'),
  color: local('--tecton-color-input-value'),
  // Pseudo-classes nest inside a style block; at the component level the theme
  // compiler would read `:hover` as a state name and emit `[data-=""]`.
  ':hover': {borderColor: local('--tecton-color-input-border-hover')},
  ...inputFocus,
  // `--radius-element` is already Tecton's 4px corner, and the field shapes
  // itself from it through `--_field-radius`, which composed controls
  // (NumberInput's steppers, InputGroup's caps) read to match their own edges.
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
 * The Tecton design's alert is a saturated fill with *dark* ink on it, and
 * `Banner` is where it lands. `Banner` paints a tinted header and keeps body
 * ink, so each status re-points the ink tokens inside it rather than setting
 * `color` once.
 */
function bannerStatus(fill: ColorPair, ink: ColorPair, glyph: ColorPair) {
  return {
    backgroundColor: pair(fill),
    '--color-text-primary': pair(ink),
    '--color-text-secondary': pair(ink),
    '--color-icon-primary': pair(glyph),
    '--color-icon-secondary': pair(glyph),
    /**
     * And the focus ring with them.
     *
     * The page-level ring is the design's hot pink, which is chosen against
     * the page and reads well there (5.7:1 on the dark canvas). On a saturated
     * severity fill it is 1.0–2.5:1 — invisible on success, and under the 3:1
     * WCAG 1.4.11 asks of a non-text indicator on all five. The ink the design
     * already puts on that fill clears 4.8:1 on every one of them, so inside a
     * banner the ring is that ink.
     */
    '--focus-outline-color': pair(ink),
  };
}

const banner = {
  /**
   * 4px, per `design/components/alert.md` ("corner radius ~4px … the same
   * family as the accordion/textfield radius"), where the component's own
   * corner is `--radius-container`.
   *
   * Said as the variable rather than the property, because `Banner` does not
   * round all four corners at once: a banner with its content showing rounds
   * only the top of the header and only the bottom of the footer, so the
   * header and the body meet flush. Every one of those rules reads
   * `--_banner-radius`, so handing it the value gets Tecton's corner into all
   * of them; a `border-radius` shorthand overrode the lot and put corners in
   * the middle of the banner.
   *
   * And on `container:card` only — a `section` banner is a full-bleed band
   * that squares itself on purpose.
   */
  'container:card': {'--_banner-radius': RADIUS_CONTROL},
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
  /** A custom variant: the Tecton design's fifth severity. */
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
 * `Badge` is a standalone pill, which is what the Tecton design calls a chip,
 * so its variants are painted from the design's chip matrix: neutral and the
 * four severities are solid fills, the hue variants stay tinted.
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
  // No `borderRadius`: `Badge` is already a full pill, which is what
  // `design/components/badge.md` measures ("border-radius = half the height;
  // single digits therefore read as perfect circles").
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
  /** A custom variant: lime is a Tecton accent with no hue family to borrow. */
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

/** `Token`: the same chip matrix, one size step smaller, always a pill. */
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
    // No `borderRadius`: the indicator already draws `--radius-inner`, which
    // Tecton points at 2px — the value `design/components/checkbox.md` measures.
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
 * The Tecton design's panel is flat: a 1px subtle rule, 16px of padding, no
 * shadow. Almost all of that already arrives through the tokens.
 *
 * `Card` draws its own 1px `--color-border` rule on the default variant, takes
 * its corner from `--radius-container`, fills from `--color-background-card`
 * and pads to spacing step 4 — all four of which Tecton already asks for
 * through the tokens or gets for nothing. There is no longer anything left to
 * say, so `card` is not a target at all, and neither is `section`.
 *
 * What used to be here and is gone:
 *
 * - `backgroundColor` on `base` painted over `variant`, so a
 *   `<Card variant="transparent">` or `variant="muted"` came out the same
 *   colour as a default card.
 * - `borderWidth`/`borderColor` on `base` gave a border to the variants the
 *   component deliberately leaves borderless, and bypassed the `calc()` that
 *   draws the border *inside* the padding.
 * - `boxShadow: 'none'` erased the whole shadow list, which is not only
 *   elevation: `SelectableCard` publishes its selection ring through
 *   `--_card-ring` and composes it into that same list, so a selected card had
 *   no visible selection at all. Tecton's flatness lives in its `--shadow-*`
 *   tokens, which are soft by design, and that is enough.
 * - `padding: var(--spacing-4)` was the 16px the design measures, and it is
 *   also exactly what `Card` and `Section` pad to when no theme says
 *   otherwise: "the theme's card padding — spacing step 4 with no theme".
 */

export const tectonComponents = {
  /* Actions ------------------------------------------------------------- */
  button,
  'toggle-button': toggleButton,
  // `button-group` is not listed. The group is a bare `inline-flex` whose
  // corners belong to its end members; it only takes a radius of its own when
  // it is elevated, so the shadow follows the slab. Giving the wrapper a
  // permanent 4px corner said nothing the members did not already say.
  'segmented-control': {
    // Only the strip colour. The control's padding is already `--spacing-0-5`
    // and its corner already `--radius-element`; restating either would have
    // desynchronised the concentric radius the selected pill computes from
    // them, and the item heights, which are the control height minus that
    // padding.
    base: {backgroundColor: pair(component.tab.stripBackground)},
  },
  'segmented-control-item': {
    base: {color: pair(component.tab.restText)},
    selected: {
      backgroundColor: pair(component.tab.filledSelected),
      color: pair(component.tab.selectedText),
      // Tecton's selected segment is a flat fill, not a lifted pill.
      boxShadow: 'none',
    },
  },
  /**
   * `design/components/link.md`: "no colour differentiation from body copy at
   * all — the only affordance that marks a link is the underline".
   *
   * That is a statement about the *default* link, so it is made on `accent`,
   * which is what `Link` defaults its `color` prop to. Saying it on `base`
   * instead painted over every other value of the prop — `secondary`,
   * `disabled` and `inherit` all came out near-white — and took the hover
   * tint with them.
   */
  link: {'color:accent': {color: 'var(--color-text-primary)'}},

  /* Fields ---------------------------------------------------------------- */
  'text-input': {base: inputSurface, ...inputDisabled, ...inputStatus},
  'text-area': {base: inputSurface, ...inputDisabled, ...inputStatus},
  'text-area-control': {base: {color: local('--tecton-color-input-value')}},
  selector: {base: inputSurface, ...inputDisabled, ...inputStatus},
  typeahead: {base: inputSurface},
  tokenizer: {base: inputSurface},
  // The rest of the field family. Their surfaces are the component's own —
  // Tecton has no transcription for a date picker or a file input — but their
  // focus is Tecton's, for the reason above `inputFocus`.
  'complex-selector': {base: inputFocus},
  'date-input': {base: inputFocus},
  'date-range-input': {base: inputFocus},
  'date-time-input': {base: inputFocus},
  'file-input': {base: inputFocus},
  'multi-selector': {base: inputFocus},
  'number-input': {base: inputFocus},
  'power-search': {base: inputFocus},
  'time-input': {base: inputFocus},
  // The date/time segments of a DateTimeInput are focus stops of their own,
  // with their own border to colour.
  'date-time-input-date-segment': {base: inputFocus},
  'date-time-input-time-segment': {base: inputFocus},
  // `input-group` and `field` are not listed: the group's end caps and the
  // field's control already round from `--radius-element`, which is Tecton's
  // 4px, and a radius on the layout wrapper only fought the caps for it.
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
    /**
     * The off track is a fill, not a border.
     *
     * `Switch` sizes its track and thumb in whole pixels (32×20 with a 2px
     * inset at md) and keeps `border-width: 0` on purpose — the only border it
     * ever draws is a `CanvasText` one under forced colours, so the control
     * stays perceivable when Windows strips the fill (WCAG 1.4.11). Adding a
     * 1px border here ate 2px of a border-box track in both axes, squeezed the
     * thumb off-centre, and overrode the forced-colours rule with a colour that
     * does not exist in that mode.
     *
     * The off track paints from `--color-background-gray`, so Tecton says what
     * it wants by re-pointing that, the way the neutral theme does.
     */
    base: {
      '--color-background-gray': pair(component.switch.offBorder),
    },
    checked: {backgroundColor: pair(component.switch.onTrack)},
    disabled: {
      '--color-background-gray': pair(component.switch.disabledTrack),
    },
  },
  'switch-thumb': {
    base: {backgroundColor: pair(component.switch.offThumb)},
    checked: {backgroundColor: pair(component.switch.onThumb)},
  },

  /* Status ---------------------------------------------------------------- */
  banner,
  'banner-icon': bannerIcon,
  /**
   * The frame is the layout-and-elevation wrapper, and it is square unless the
   * banner is lifted — the radius is there so a shadow follows the rounded
   * slab, not because the frame is the visible box. So only the fill is said
   * here, and no `boxShadow`: the frame has an `elevation` prop whose `none` is
   * already no shadow, and erasing the property on the base only stopped the
   * other three steps working.
   */
  'banner-frame': {
    base: {backgroundColor: 'var(--color-background-card)'},
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
  /**
   * Rows and menu items hover through `--color-overlay-hover`, and the
   * component decides when: `Item` only lights up when it is interactive,
   * `ListItem` only when the list says so. Suppressing the token and painting a
   * `:hover` rule of our own took that decision away — a static list row and a
   * read-only table lit up under the pointer like a button.
   *
   * So the Tecton row fill goes into the token instead.
   */
  item: {base: hoverTint(local('--tecton-color-table-row-hover'))},
  'list-item': {base: hoverTint(local('--tecton-color-table-row-hover'))},
  'dropdown-menu': {
    // A 1px rule on the panel — `design/components/menu.md`. The panel keeps
    // its own shadow: Tecton's `--shadow-*` are already soft drops, so the flat
    // look survives without erasing the property.
    base: {
      backgroundColor: 'var(--color-background-popover)',
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: 'var(--color-border)',
    },
    // The 4px corner is the anchored panel's. A `bottom-sheet` menu is a sheet
    // that squares itself against the edge of the viewport, and rounding it
    // from the base put corners on the bottom of the screen.
    'presentation:popover': {borderRadius: RADIUS_CONTROL},
  },
  'dropdown-menu-item': {
    // "Item fill radius ~2px, inset a few px from the panel's inner edge" —
    // `design/components/menu.md`.
    base: {
      borderRadius: RADIUS_INNER,
      ...hoverTint(local('--tecton-color-table-row-hover')),
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
    /**
     * Stripes and hover are `Table`'s to switch on (`isStriped`, `hasHover`),
     * and it paints them from two tokens: the even-row band from
     * `--color-background-muted`, the hover from `--color-overlay-hover`. It
     * also republishes whichever is active as `--table-row-overlay`, which is
     * how a pinned or sticky cell — which has to paint an opaque background of
     * its own — replays the same band instead of showing a hole.
     *
     * Writing `:nth-child(even)` and `:hover` here instead striped and
     * highlighted *every* table, prop or no prop, and left the pinned cells
     * painting the old colour. Re-pointing the two tokens says the same thing
     * about colour and leaves all three behaviours where they belong.
     */
    base: {
      '--color-background-muted': local('--tecton-color-table-stripe'),
      ...hoverTint(local('--tecton-color-table-row-hover')),
    },
  },
  'table-cell': {base: {borderColor: 'var(--color-border)'}},
  'table-footer': {
    base: {backgroundColor: local('--tecton-color-table-footer')},
  },

  /* Surfaces -------------------------------------------------------------- */
  // Neither `card` nor `section` is a target any more — see the comment above
  // the Surfaces section for what was here and why none of it is needed.
  dialog: {
    // The rule, not the radius: the dialog already rounds from
    // `--radius-container`, which is Tecton's 8px.
    base: {
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: 'var(--color-border)',
    },
  },
  popover: {
    /**
     * A rule, and no corner.
     *
     * `design/components/menu.md` measures a 4px panel, and the menu takes it
     * above — but `popover` is the surface underneath a dozen different things,
     * some of which square themselves (a full-bleed mega menu, a sheet against
     * the viewport edge) and have no prop to tell them apart by. The component
     * rounds from `--radius-container`, which is Tecton's 8px, and lets each of
     * those keep its own shape.
     */
    base: {
      borderWidth: 'var(--border-width)',
      borderStyle: 'solid',
      borderColor: 'var(--color-border)',
    },
  },
  // `tooltip` is not listed. The transcription has no tooltip page, so there
  // is no Tecton shape to reach for; the component's own is an *inverted*
  // surface (it fills from `--color-text-primary`), and the theme already tells
  // it what ink reads on that through `onDark` / `onLight`. Repainting it as a
  // popover with a rule was a look invented here, not one the design asked for.
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
  // Both of these already round from the token Tecton points at the value it
  // wants — `Kbd` from `--radius-inner` (2px), `CodeBlock` from
  // `--radius-element` (4px) — so only the fill is Tecton's to say.
  kbd: {base: {backgroundColor: 'var(--color-background-muted)'}},
  'code-block': {base: {backgroundColor: 'var(--color-background-muted)'}},
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
  // `heading` is not listed: the component already sets
  // `--font-family-heading`, which the theme's `typography.heading` names.
} as const;

export type TectonComponentOverrides = typeof tectonComponents;
