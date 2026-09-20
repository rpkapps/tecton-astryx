# Theme audit — Tecton against the components it themes

Tecton is a theme and nothing else: `@tecton/react` republishes every
`@astryxdesign/core` component unchanged, and `packages/react/src/theme/**` is
the whole of what Tecton says about them. That makes one question the only
question worth asking about it — **does the theme restyle these components, or
does it change them?** — and it makes the question answerable, because the same
components are also rendered by somebody else's theme.

This is the answer, measured rather than eyeballed.

## What was measured, and against what

Upstream's own documentation site renders its examples under
`@astryxdesign/theme-neutral` (npm, 0.6.2, MIT). That is the reference for "not
broken": a theme by the component authors, on the components the authors wrote,
showing what each component is supposed to do.

`fixtures/theme-audit/` is a throwaway Vite app that mounts **all 646 ported
examples** (`apps/docs/examples/components/<Dir>/<Name>.tsx`) twice:

- **Tecton** — the built package, `@tecton/react/styles.css`, inside
  `TectonProvider` (dark; light spot-checked with `--light`).
- **Neutral** — the *same example files*, with every `@tecton/react/<Module>`
  specifier resolved to `@astryxdesign/core/<Module>` by a Vite resolver, inside
  upstream's `Theme` with `neutralTheme` and core's `reset.css` + `astryx.css` +
  the neutral `theme.css`.

`@tecton/react/icons` is deliberately **not** rewritten. Both renders draw the
same Tecton glyph components, so any icon that comes out a different size comes
out different *because of the theme* and not because the two icon sets differ.

For every example, Playwright then collects:

1. **A screenshot of both renders** (Tecton dark, neutral; `--light` adds Tecton
   light).
2. **A structural diff.** Every element under the stage is walked and keyed by
   its structural path, so the same element is compared in both renders. A
   finding is raised when
   - width or height differs by more than 15 % **and** more than 1.5 px;
   - an `svg` differs in size by more than half a pixel;
   - a control (button, field, tab, segmented item, badge, switch, …) differs in
     height by more than 1.5 px;
   - an element overflows its clipping ancestor in Tecton but not in neutral;
   - text occupies a different number of line boxes and the block changes height
     with it;
   - the *pattern* of square vs rounded corners differs — `r00r` upstream and
     `rrrr` here means a connected control has come apart;
   - two siblings that differ only by `variant` (or `elevation`) are painted
     differently upstream and identically here, which means a `base` rule has
     painted over the component's own prop.
3. **A focus audit.** Tab through the Tecton render's focusable elements (to a
   cap of 30 stops per example, which only a handful reach) and, at each stop,
   check that `:focus-visible` produces a ring — a positive `outline-width`, or
   a box-shadow that focus *added*, on the control or on the indicator an owner
   rings for it — that the ring's colour reaches 3:1 against the painted
   background behind it (WCAG 1.4.11), and that no `overflow: hidden` ancestor
   clips it. The neutral render is tabbed the same way, so a ring upstream does
   not draw either is not counted against Tecton.

Differences the **type scale** explains are counted separately and are not
findings. Tecton's ladder is 10/12/14/16/20/24/32/40/48 at two weights, upstream
computes 14 × 1.2ⁿ, so an element whose own `font-size` or `line-height` differs
is *expected* to measure differently — and so is every block that contains it,
all the way up, because a card around a paragraph around a heading is shorter
when the heading is. Those elements are exempt from the box tolerance, controls
included — a `TextArea` is `rows` line boxes tall and a `Selector` grows with its
option descriptions, so their heights are their content's. A control whose height
comes from `--size-element-*` is never exempt: its label's leading cannot move it,
and Tecton and upstream both set those to 28/32/36, so a difference there is the
theme having resized the control.

A box that differs by its **padding** is likewise recorded rather than charged,
and so is every block that contains it. `Card` and `Section` both document their
padding as the theme's to set, and the neutral theme takes both down to
`--spacing-3` where the components default to step 4 — so a card 10px taller here
is two themes disagreeing about a spacing step, in the direction where Tecton is
the one agreeing with the component. The same applies to the one control the
reference theme resizes, `segmented-control-item`, which `neutralTheme.ts` sets
8px inside the control height where the component's own is 4px.

Two other things are recorded rather than charged. A focus ring neither theme
draws — a scroll region, a composer surface whose CSS suppresses the outline —
is an upstream property, not something a theme can conjure. And
`outline-style: auto` is the browser's own ring, which Chromium paints as a
two-tone halo visible on any backdrop while reporting a placeholder
`outline-color`; measuring that colour would say nothing.

Reproduce with:

```
pnpm --filter @tecton/react build
pnpm --filter @tecton-fixture/theme-audit audit -- --shots findings --out <dir>
node fixtures/theme-audit/summarise.mjs <dir>/results.json
```

## Result

All 646 examples, dark mode, before and after the theme changes this audit
prompted. "Findings" means a structural difference the type scale and the two
themes' spacing choices do not explain, or a focus stop whose ring is missing,
under 3:1, or clipped where the reference's is not.

| | Before | After |
| --- | ---: | ---: |
| Examples with a finding | **186** of 646 | **4** of 646 |
| Structural findings | **538** | **0** |
| — connected controls flattened (`corner-shape`) | 534 | 0 |
| — a `variant` prop painted over | 3 | 0 |
| — an `elevation` prop erased | 1 | 0 |
| Focus findings | **138** | **5** |
| — a field that stopped showing focus, or rang at 2.2:1 | 121 | 0 |
| — a ring invisible on a banner's severity fill | 16 | 0 |
| — the focus pink on a light surface | 1 | 5 |
| Type-scale differences (recorded, not findings) | 1444 | 1414 |

The structural diff is **clean**: after the fix, not one element in 646 examples
measures differently from the same element under the reference theme for any
reason other than the type scale and the two themes' spacing choices.

What is left is one deviation, in five places:

**The focus pink does not reach 3:1 on a light surface.** `--focus-outline-color`
is the design's `#ff52a8`, which is 5.7:1 against the dark page and 5.6:1 on a
field — but content rendered on an *inverted* surface (a `Toast`, a light media
scrim, a light syntax preset) resolves the light side of the pair, `#ff00aa`,
against a near-white background: **2.48:1**, and the dark side would be 2.99:1.
Neither clears the bar, and the bar cannot be cleared without a second focus
hue, which the transcription does not have. It is recorded here at its measured
value rather than papered over, the way the border-contrast shortfall is in
`docs/design/fidelity-report.md` §7. Affected: `Toast/ToastTypes`,
`Toast/ToastStacking`, `MediaTheme/MediaThemeLightScrim`,
`SyntaxTheme/SyntaxThemeLightPreset`.

### Before and after

Tecton dark on the left of each pair, the reference render for comparison.

| | Before | After | Reference |
| --- | --- | --- | --- |
| `ButtonGroup` — three separate pills, then one slab with square seams | ![](theme-audit/button-group-before.png) | ![](theme-audit/button-group-after.png) | ![](theme-audit/button-group-neutral.png) |
| `Card` `variant` — six identical cards, then six colours | ![](theme-audit/card-variants-before.png) | ![](theme-audit/card-variants-after.png) | ![](theme-audit/card-variants-neutral.png) |
| `Table` without `isStriped` — striped anyway, then not | ![](theme-audit/table-before.png) | ![](theme-audit/table-after.png) | ![](theme-audit/table-neutral.png) |
| `TextInput`, focused — a 1.34:1 wash, then a 5.64:1 ring | ![](theme-audit/text-input-focused-before.png) | ![](theme-audit/text-input-focused-after.png) | ![](theme-audit/text-input-focused-neutral.png) |
| `Button`, focused — unchanged, and correct in both | ![](theme-audit/button-focused-before.png) | ![](theme-audit/button-focused-after.png) | ![](theme-audit/button-focused-neutral.png) |
| `Switch` — the track 2px narrower, then the component's own size | ![](theme-audit/switch-before.png) | ![](theme-audit/switch-after.png) | ![](theme-audit/switch-neutral.png) |
| `EmptyState` — unchanged; the icon is 24x24 in all three | ![](theme-audit/empty-state-before.png) | ![](theme-audit/empty-state-after.png) | ![](theme-audit/empty-state-neutral.png) |

## Findings, by root cause

Twelve causes, and one shape between the first ten of them: **a theme rule that says something the
component was already saying, in a place where saying it again overrides
something else.** Every Tecton rule lands in `@layer astryx-theme`, which comes
after `@layer astryx-base` where the components' own CSS lives, so a theme
declaration beats *any* component declaration of the same property regardless of
selector specificity — including the per-corner, per-state and per-variant rules
a component uses to do its job.

Each entry below names the line in `packages/react/src/theme/**` that was
responsible and what replaced it.

### 1. A `border-radius` shorthand flattens per-corner radii

`components.ts`, `button.base.borderRadius = var(--radius-element)` — and the
same line on `toggle-button`, `button-group`, `segmented-control`,
`segmented-control-item`, `field`, `input-group`, `text-input`, `text-area`,
`selector`, `item`, `checkbox-indicator` and `badge`.

`Button` inside a `ButtonGroup` sets `border-start-start-radius` and its three
siblings individually — 4px on the end caps, `0` in the middle — so the members
butt together into one rounded slab. `design/components/button-group.md` asks
for exactly that: *"Outer radius 4px, matching Button; inner corners are square
(radius 0) so segments butt together with no gap."* A `border-radius` shorthand
in the theme layer resets all four longhands, so every member came out fully
rounded and the group read as a row of separate pills. The audit sees it as a
corner pattern of `rrrr` where upstream has `r00r`, `0000`, `0rr0`.

Every one of those declarations was saying 4px — which is what
`--radius-element` already resolves to, because Tecton sets it. So they went,
except where the design names a corner the component does not have: the menu
panel and popover at 4px against the component's `--radius-container`
(`design/components/menu.md`), the menu item at 2px, the card-container banner
at 4px (`design/components/alert.md`), and `Token` as a pill.

Same story, different property, on `badge` (already `--radius-full`),
`checkbox-indicator` (already `--radius-inner`, which Tecton points at the 2px
`design/components/checkbox.md` measures) and `segmented-control`'s padding
(already `--spacing-0-5`; restating it desynchronised the concentric radius and
item heights the control computes from it).

### 2. A `base` rule paints over a `variant` prop

`components.ts`, `card.base.backgroundColor = var(--color-background-card)`.

`Card` maps its `variant` prop to a background — `transparent`, `muted`, and
the ten hues — over a base that has none. The theme's `base` rule beat every one
of them, so `<Card variant="muted">` and `<Card variant="blue">` came out the
same colour as a default card. `SelectableCard`'s six colour variants went the
same way. The audit flags this as `variant-collapse`: siblings that differ only
by `variant`, painted differently upstream and identically here.

The rule was redundant as well as harmful — `variant="default"` already fills
from `--color-background-card`, which Tecton already re-points — so it went.
`Card`'s border went with it, for the same reason plus one more: the component
draws it only on the default variant and subtracts its width from the padding,
so the base rule both bordered the borderless variants and bypassed that
`calc()`. Its `padding: var(--spacing-4)` went too, being the 16px the design
measures *and* exactly what `Card` and `Section` pad to when no theme says
otherwise. With that, `card` and `section` stopped being targets at all.

### 3. `box-shadow: none` erases more than elevation

`components.ts`, `card.base.boxShadow = 'none'`, and the same on `banner-frame`,
`popover` and `dropdown-menu`.

`Card`'s shadow is a two-layer list: `var(--_card-ring), var(--_card-elevation)`.
The second is the `elevation` prop. The first is an extension point, and
`SelectableCard` uses it — its selection indicator *is* an inset ring composed
into that list. Erasing the property erased both: a selected card had no visible
selection at all, and `elevation="high"` did nothing. The audit flags the second
half as `elevation-collapse`.

Tecton's flatness does not need this. The `--shadow-low/med/high` tokens are
already soft drops rather than lifts, which is the theme's own answer to *"the
design has no drop shadow on any panel"*. All four declarations went.
`segmented-control-item`'s `selected.boxShadow: 'none'` stayed: that is a leaf
state with no prop behind it, and the neutral theme does the same.

### 4. A state selector in `base` turns a prop into always-on

`components.ts`, `table-row.base[':nth-child(even)']` and
`table-row.base[':hover']`.

Striping and row hover are `Table`'s props — `isStriped`, `hasHover` — and the
component paints them from two tokens (`--color-background-muted` for the band,
`--color-overlay-hover` for the hover) *and republishes whichever is active as
`--table-row-overlay`*, which is how a pinned or sticky cell replays the same
band instead of showing a hole where its own opaque background is. Writing the
selectors into the theme striped and highlighted every table whether or not it
asked, and left the pinned cells painting the old colour.

Re-pointing the two tokens on `table-row.base` says the same thing about colour
and leaves all three behaviours where they belong.

### 5. `NO_OVERLAY_TINT` turns off the mechanism it then replaces

`components.ts`, `NO_OVERLAY_TINT` spread into `item`, `list-item`,
`dropdown-menu-item` and `table-row`.

Setting `--color-overlay-hover: transparent` and then adding a `:hover` rule
moves the *decision* as well as the colour. `Item` only lights up when it is
interactive; `ListItem` only when the list says so. With the token off and a
flat `:hover` rule on, a static list row and a read-only table row highlighted
under the pointer like buttons.

The new `hoverTint()` helper puts Tecton's fill into the token the component
already hovers with. `NO_OVERLAY_TINT` survives in exactly one place — `Button`,
where the design's matrix names a fill for enabled, hover, pressed, focus and
disabled on all five emphases, so there is nothing left for a composited wash to
do.

### 6. A border on a control that sizes itself to the pixel

`components.ts`, `switch.base.borderWidth/borderStyle/borderColor`.

`Switch` is 32×20 at `md` with a 2px inset and a 16px thumb, on a border-box,
and it keeps `border-width: 0` deliberately: the only border it ever draws is a
`CanvasText` one under `@media (forced-colors: active)`, so the control stays
perceivable when Windows strips painted backgrounds (WCAG 1.4.11). A 1px border
from the theme took 2px out of the track in both axes, squeezed the thumb
off-centre, and overrode the forced-colours rule with a colour that does not
exist in that mode.

The off track paints from `--color-background-gray`. Tecton now says what it
wants by re-pointing that, which is what the neutral theme does.

### 7. Re-colouring a border that is also the focus affordance

`components.ts`, `inputSurface.borderColor`.

A field carries `outline: none` and shows keyboard focus by turning its own
border `--color-accent` on `:focus-within`, plus an inset ring. Re-colouring the
resting border from the theme layer overrode the focused state too, because the
theme layer beats `:focus-within` no matter how specific it is. Every
`TextInput`, `TextArea`, `Selector`, `Typeahead` and `Tokenizer` in the system
stopped showing keyboard focus (WCAG 2.4.7).

`inputSurface` now restates the focused border, in the focus ink:
`design/components/textfield.md` says focus is *"a 2px hot-pink `#ff52a8` ring
around the field"*, which is the 1px border plus a 1px inset, both in
`--focus-outline-color`.

### 8. A ring colour chosen against the page, used on a saturated fill

`components.ts`, `bannerStatus()`.

`--focus-outline-color` is the design's hot pink, and against the dark page it
is 5.7:1 — comfortably past the 3:1 WCAG 1.4.11 asks of a non-text indicator.
Against a `Banner`'s severity fill it is 1.0:1 on success, 1.2:1 on info,
warning and error, and 2.3:1 on neutral: a button focused inside a banner had no
visible ring.

The ink the design already puts on those fills clears 4.8:1 on every one of
them, so `bannerStatus()` now re-points `--focus-outline-color` to it alongside
the text and icon inks it was already re-pointing. No palette value changed; a
colour the design already uses on that surface is used for one more thing on it.

### 9. Selection dressed up as focus

`tectonTheme.ts`, `--shadow-inset-selected: inset 0 0 0 2px var(--focus-outline-color)`.

The hot pink is the *focus* ink — `design/components/button.md` and
`…/textfield.md` both introduce it as what appears when a control takes keyboard
focus. Wearing it for selection as well makes a selected control and a focused
one indistinguishable. It is now a 50 % violet inset, which is the weight the
layer underneath uses for the same token.

### 10. A radius on `base` where the component squares one of its containers

`components.ts`, `banner-frame.base.borderRadius`, and the same on `popover`
and `dropdown-menu`.

`Banner` has a `container` prop: a `card` banner is a rounded panel, a `section`
banner is a full-bleed band that squares itself on purpose. `DropdownMenu` has a
`presentation` prop, and its `bottom-sheet` presentation squares itself against
the edge of the viewport. `Popover` has no prop at all, and is the surface under
a dozen things, several of which square themselves — a full-bleed mega menu, a
sheet.

So the 4px moved to where it belongs and nowhere else: `banner` on
`container:card`, `dropdown-menu` on `presentation:popover`, and `popover` left
to round from `--radius-container`.

`Banner` also needed the value said as `--_banner-radius` rather than as
`border-radius`, because it does not round all four corners at once: a banner
with its content showing rounds only the top of the header and only the bottom
of the footer, so the two meet flush. Every one of those rules reads that
variable; a shorthand overrode all of them and put corners in the middle of the
banner.

### And one more the audit found on its own

Two of these were not visible until the audit could see them, and both were
found by the focus pass rather than by reading the theme.

**Every field Tecton did *not* paint rang at 2.2:1.** A field shows keyboard
focus by turning its border `--color-accent`. Tecton's accent is a dark violet,
so on the dark page that border is 2.2:1 — under the 3:1 bar, on 87 stops across
the date, time, number, file and multi-select families. Fixing the five fields
Tecton *did* paint would have left those. All sixteen field targets now state
their focus in `--focus-outline-color`.

**And the ring was invisible inside a `Banner`:** 1.0:1 on success, 1.2:1 on
info, warning and error, 2.3:1 on neutral. The pink is chosen against the page,
and a severity fill is not the page.

## What was deliberately left alone

- **The type scale.** Tecton's ladder (10/12/14/16/20/24/32/40/48, two weights)
  is transcribed from `design/foundations/typography.json` and is most of what
  makes the system look like Tecton. It is the single largest source of measured
  difference from the neutral render, and every one of those differences is the
  theme working.
- **The radius map.** 0/2/4/8/12/16/full, from
  `design/foundations/spacing-and-radius.md`. Smaller than upstream's
  0/4/8/12/28 everywhere, on purpose.
- **`--size-element-sm/md/lg` (28/32/36) and `--border-width` (1px).** Tecton's
  design measures 32 and 28, which are the values the layer underneath already
  uses, so these are agreements rather than overrides.
- **`Card` and `Section` padding.** `design/components` puts 16px inside a
  Tecton panel, and 16px is also what both components pad to with no theme —
  so the way to get it is to say nothing, which is now what the theme does.
- **`--focus-outline-offset: 2px` and `--button-focus-offset: 1px`** against
  upstream's 3px. `design/components/button.md` measures the ring *"~1px outside
  the button edge with a ~1px gap"* and `…/link.md` *"~2–3px padding"*. A
  smaller offset also reaches less far, so it is never the reason a ring is
  clipped — and the audit found no clipped ring that the neutral render did not
  also clip.
- **The icon registry.** `theme/icons.ts` registers every glyph the way the
  neutral theme registers its Lucide ones: a `ReactNode` whose `svg` carries
  `width="1em" height="1em"` and `aria-hidden`, sized by the box `Icon` puts it
  in. Measured in the browser, an `<Icon icon={SearchIcon} size="lg" />` inside
  an `EmptyState` renders at exactly 24×24, and the audit raises no `svg-size`
  finding anywhere, on either registry or component mode. What *is* different is
  the artwork: all 131 Tecton glyphs are drawn on a 16-unit box and their ink
  fills a mean of **73 %** of it, where a Lucide glyph fills about 83 %. That
  makes a Tecton icon read about a tenth smaller at the same box size. It is a
  property of the icon set, not of the theme, and the theme has no way to reach
  it — closing the gap means redrawing or rescaling the source glyphs in
  `design/icons/tecton/`, which is a design decision rather than a bug fix.
- **The six semantic icon roles Tecton does not register** (`chevronsLeft`,
  `chevronsRight`, `calendar`, `clock`, `checkDouble`, `stop`), which fall
  through to the component library's own 24-unit stroked fallbacks. There is no
  Tecton glyph for any of them, and inventing one is not the theme's call.
- **The custom variants and text types.** `Button` `outlined` / `text-only`,
  `Banner` `neutral`, `Badge` `lime` and the eight Tecton `Text` types are
  colour and type only — the one geometric thing among them, the 1px rule on the
  outlined button, sits on a control with a fixed height and a border-box, so it
  does not move anything.
- **The borders Tecton adds to `dialog`, `popover` and `dropdown-menu`.** That
  is the design's own way of carrying depth — *"a 1px rule, and getting
  darker"* — and none of the three uses a border for anything else.
