# Theme audit — Tecton against the components it themes

Tecton is a theme and nothing else: `@tecton/react` republishes every
`@astryxdesign/core` component unchanged, and `packages/react/src/theme/**` is
the whole of what Tecton says about them. That makes one question the only
question worth asking about it — **does the theme restyle these components, or
does it change them?** — and it makes the question answerable, because the same
components are also rendered by somebody else's theme.

This is the answer, measured rather than eyeballed.

It is in **two parts**, because there are two ways for a theme to be wrong and
only one of them shows up in a render nobody has touched.

- **Part one — the resting render.** Geometry, props and focus rings, diffed
  element by element against the reference theme. Sections up to "What is not
  covered".
- **Part two — states and paints.** The paint of every stateful control through
  rest, hover, press, the state change and keyboard focus, on both renders.
  Sections from "States and paints" onward. Part one came back clean while a
  `ToggleButton` was painting nothing at all when pressed; part two is why that
  is no longer possible.

## What was measured, and against what

Upstream's own documentation site renders its examples under
`@astryxdesign/theme-neutral` (npm, 0.6.2, MIT). That is the reference for "not
broken": a theme by the component authors, on the components the authors wrote,
showing what each component is supposed to do.

`fixtures/theme-audit/` is a throwaway Vite app that mounts **all 646 ported
examples** (`apps/docs/examples/components/<Dir>/<Name>.tsx`) twice:

- **Tecton** — the built package, `@tecton/react/styles.css`, inside
  `TectonProvider`. The diff runs in **dark**, which is the mode the design was
  transcribed from; `--light` adds a Tecton light capture for looking at, and
  the light side of every pair is checked numerically in
  `packages/react/src/theme/__tests__/contrast.test.ts` instead.
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

Twelve causes, and one shape between the first ten of them: **a theme rule that
says something the component was already saying, in a place where saying it
again overrides something else.** Every Tecton rule lands in `@layer astryx-theme`, which comes
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
panel at 4px against its own `--radius-container` (`design/components/menu.md`),
the menu item at 2px, the card-container banner at 4px
(`design/components/alert.md`), and `Token` as a pill. Two of those three had to
be narrowed further before they were safe — see §10.

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

A new `inputFocus` block restates the focused border, in the focus ink:
`design/components/textfield.md` says focus is *"a 2px hot-pink `#ff52a8` ring
around the field"*, which is the 1px border plus a 1px inset, both in
`--focus-outline-color`. It goes on all sixteen field targets, not only the five
Tecton paints — see below for why.

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

### 11 and 12. Two the audit found that reading the theme would not have

Both came out of the focus pass, and neither is a line that looks wrong on its
own page.

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

## What is not covered

- **Hover and pressed states** — not by *this* diff, which measures a resting
  render. They are measured in Part two, which drives a pointer over all 646
  examples; §4 and §5 above are the part of the mechanism that is visible at
  rest, and §14 below is the rest of it.
- **Light mode, structurally.** The diff runs in dark, the mode the design was
  transcribed from. Every token's light side is derived by the rule in
  `docs/design/light-mode.md` and asserted numerically, including its contrast,
  in `packages/react/src/theme/__tests__/`.
- **Anything above 30 tab stops** in a single example, which a handful of the
  larger page-scale examples exceed.
- **`apps/docs`**, which renders these examples for people rather than for a
  diff, and is somebody else's to change.
---

## Part two — states and paints

Everything above measures a render **nobody has touched**. That was enough to
find a theme taking a button group apart and a theme that had stopped drawing
focus rings, and it is structurally blind to the other half of what a theme
says: a control's paint when it is hovered, held down, checked, pressed or
selected. A resting diff cannot tell a `ToggleButton` whose activated fill is
right from one whose activated fill compiles to a selector that matches nothing
in the document — both render an unpressed toggle correctly, and the run comes
back clean.

It came back clean. The toggle painted nothing.

So `fixtures/theme-audit/scripts/state-audit.mjs` drives the controls.

## States and paints — what was measured

The same 646 examples, the same two renders — Tecton dark, and the identical
example files resolved onto `@astryxdesign/core` under
`@astryxdesign/theme-neutral`. In each one, the harness collects every
**stateful control**:

`[aria-pressed]`, `[role="switch"]`, `input[type=checkbox]`,
`input[type=radio]`, `[role="tab"]`, `[role="radio"]` (segmented control),
`[aria-selected]`, `[aria-expanded]`, `[role="menuitemcheckbox"]` /
`[role="menuitemradio"]`, `[role="treeitem"]`, `[aria-current]`,
`[role="slider"]`, a selectable or clickable card, and a link — up to three of
each kind and eight per example, and only the ones inside the 1100×900 viewport,
because the driver points a real mouse at them.

A checkbox's focusable element is a visually hidden `<input>` and a switch's is
a sibling of its track, so the paint is read from the control's **paint root**:
the nearest ancestor that occupies space, which is the box holding both the
input and whatever draws for it. That root and up to 24 of its visual
descendants are recorded — `background-color`, `background-image`, `color`, all
four border colours and widths, `box-shadow`, `outline`, `opacity`, `transform`,
`font-weight` and `text-decoration` — in five conditions:

| | |
| --- | --- |
| **rest** | the page as loaded, pointer parked in the corner |
| **hover** | the mouse moved onto the control |
| **active** | the mouse button held down on it |
| **changed** | after the click completes, with the pointer moved away |
| **focused** | a keypress to establish keyboard modality, then focus moved programmatically — a real Tab lands wherever the tab order says, which is what Part one walks |

Every control gets a **freshly loaded page** before its turn, because a click on
one control moves others: a radio group, an accordion, a menu that opens over
the next item. A "rest" measured after that is not rest.

Both renders are driven in parallel, and `--light` adds a Tecton light capture
of the first control of each example, recorded rather than charged — the design
was transcribed from the dark rendering, and light is derived from it by the
rule in `docs/design/light-mode.md`.

### What counts as a finding

| Kind | Meaning |
| --- | --- |
| `flattened` | the reference render's paint moves between rest and this state and Tecton's does not — a theme rule has painted over a state the component draws |
| `flat-hover` | the same, for hover, which is the one state a user meets without committing to anything |
| `indistinct` | Tecton's paint in this state is the same as Tecton's own hover paint, so the state cannot be told from a passing pointer |
| `contrast` | ink inside the control, in this state, on the surface that state paints behind it: under 4.5:1 for text or 3:1 for a glyph (WCAG 1.4.3, 1.4.11), where the reference clears the same bar |

Two things are deliberately **not** charged. A state neither render reaches — a
click that toggled nothing on either side — compares nothing. And a disabled
control is exempt from the contrast rule, because "greyed out" is the platform's
disabled affordance and WCAG 1.4.3 exempts it.

Colours are compared with a tolerance, and the tolerance is the difference
between measuring a state and measuring a rounding. Almost every state style in
the reference theme is a `color-mix()` with 5–15 % of a tint, and at either end
of a ramp that mix moves a channel by two or three units: upstream's link goes
`#f1f1f1` → `#f3f3f3` on hover, and on an inverted surface `#1b1b1b` →
`#171717`. Compared exactly, those read as "the reference paints a hover state",
and any theme that does not match them to the last digit is charged with
flattening something nobody can see.

So two colours count as the same paint when they are within **four units out of
255 on every channel**, *or* within **1.06:1** of each other. The second
yardstick is there because a flat channel count is the wrong measure at the dark
end, and it leaves a comfortable margin: the smallest real state change in
either theme — a row lifting to its hover fill — is 1.15:1. Everything that is
*not* a colour — a shadow that gains an offset, an outline that changes style, a
weight that steps up, an underline that appears — is compared exactly.

One bug in the instrument is worth naming, because it silently weakened the
contrast rule: Chromium serialises a resolved `color-mix()` as
`color(srgb 0.22 0.2 0.24)`, with 0–1 floats. The probe's colour parser only
knew `rgb()`, so a hovered row's fill read as "not a colour", the compositor
fell through to the page, and every ratio measured on a hovered control was
measured against the wrong surface. Fixed, and the numbers below are from after
it was.

Reproduce with:

```
pnpm --filter @tecton/react build
pnpm --filter @tecton-fixture/theme-audit audit:states -- --out <dir>
node fixtures/theme-audit/summarise-states.mjs <dir>/results.json
```

## States and paints — result

All 646 examples, dark mode, **672 stateful controls**. Both columns are
measured with the same instrument — the "before" run is the theme as it stood at
the end of Part one, rebuilt and re-driven.

| | Before | After |
| --- | ---: | ---: |
| Examples with a finding | **81** of 646 | **0** of 646 |
| Total findings | **252** | **0** |
| — a state Tecton does not paint and the reference does (`flattened`) | 58 | 0 |
| — the same, on hover (`flat-hover`) | 40 | 0 |
| — a state that paints exactly like hover (`indistinct`) | 0 | 0 |
| — ink under its contrast bar in some state (`contrast`) | 154 | 0 |

Grouped by root cause, which is how they were fixed:

| Root cause | Before | After |
| --- | ---: | ---: |
| 13. A state key that compiles to a selector nothing matches | 18 | 0 |
| 14. A state colour said as the property instead of as the token the component mixes from | 80 | 0 |
| 15. A fill colour used as ink | 54 | 0 |
| 16. The hover and press washes lifted the surface out from under its ink | 97 | 0 |
| 17. The page's ghost ink on a banner's severity fill | 3 | 0 |

Two more entries below carry no row here, because neither is something this
audit can see. §18 is the instrument. §19 is a place where the theme and the
*reference* agree with each other and both disagree with the Tecton design —
which a diff against the reference cannot, by construction, report.

The numbering continues Part one's twelve. §18 below is a sixth entry with no
row in this table: it is the instrument being taught the difference between a
paint and a rounding, and it is why the "before" column reads 252 where the
first, cruder run reported 300.

**Part one is unaffected.** The resting audit, re-run on the same build, still
reports 646 examples, **0 structural findings**, 4 examples with a finding and 5
focus findings — all of them the one recorded deviation in its own Result
section, the focus pink on a light surface.

### Before and after

Tecton dark on the left of each pair, the reference render for comparison.

| | Before | After | Reference |
| --- | --- | --- | --- |
| §13 `ToggleButton` — "Pressed" identical to "Default", then an activated fill | ![](theme-audit/toggle-button-pressed-before.png) | ![](theme-audit/toggle-button-pressed-after.png) | ![](theme-audit/toggle-button-pressed-neutral.png) |
| §13 `ToggleButton`, activated, hovered — nothing, then a step lighter | ![](theme-audit/toggle-button-hover-before.png) | ![](theme-audit/toggle-button-hover-after.png) | ![](theme-audit/toggle-button-hover-neutral.png) |
| §14 `Switch` off — a featureless mauve blob, then an outlined track with a knob in it | ![](theme-audit/switch-off-before.png) | ![](theme-audit/switch-off-after.png) | ![](theme-audit/switch-off-neutral.png) |
| §14 `Switch` on — the design's violet track and near-white knob, in all three | ![](theme-audit/switch-on-before.png) | ![](theme-audit/switch-on-after.png) | ![](theme-audit/switch-on-neutral.png) |
| §14 `Switch` on, hovered — inert, then the track brightens | ![](theme-audit/switch-hover-before.png) | ![](theme-audit/switch-hover-after.png) | ![](theme-audit/switch-hover-neutral.png) |
| §19 `TextInput` validation — a solid tinted box bleeding into the field, then a coloured rule and plain coloured helper text | ![](theme-audit/text-input-validation-before.png) | ![](theme-audit/text-input-validation-after.png) | ![](theme-audit/text-input-validation-neutral.png) |
| §14 `CheckboxInput`, checked, hovered — inert, then the chip brightens a step | ![](theme-audit/checkbox-hover-before.png) | ![](theme-audit/checkbox-hover-after.png) | ![](theme-audit/checkbox-hover-neutral.png) |
| §14 `RadioList`, checked — the ring, the transparent centre and the near-white dot | ![](theme-audit/radio-before.png) | ![](theme-audit/radio-after.png) | ![](theme-audit/radio-neutral.png) |
| §15 `Stepper` — the accent glyphs at 2.2:1 and the number badge at 2.0:1, then in the adornment lilac | ![](theme-audit/accent-as-ink-before.png) | ![](theme-audit/accent-as-ink-after.png) | ![](theme-audit/accent-as-ink-neutral.png) |
| §16 `SideNav`, an item held down — the row lifted 20 % under a glyph chosen against the page, then 10 % | ![](theme-audit/pressed-row-before.png) | ![](theme-audit/pressed-row-after.png) | ![](theme-audit/pressed-row-neutral.png) |
| §17 `Banner` — the collapse chevron and the close mark at 1.2:1 on the warning band, then in the band's own ink | ![](theme-audit/banner-ghost-before.png) | ![](theme-audit/banner-ghost-after.png) | ![](theme-audit/banner-ghost-neutral.png) |
| §18 `Link`, hovered — unchanged, which is what the design asks for | ![](theme-audit/link-hover-before.png) | ![](theme-audit/link-hover-after.png) | ![](theme-audit/link-hover-neutral.png) |

## States and paints — findings, by root cause

### 13. A state key that compiles to a selector nothing matches

`components.ts`, `toggle-button: {isPressed: {…}}`.

The theme compiler turns a **bare** state key into
`[data-<state>="<state>"]` — `checked` becomes `[data-checked="checked"]`,
`selected` becomes `[data-selected="selected"]` — and that is right for every
state in the system but two. `ToggleButton` writes
`themeProps('toggle-button', {isPressed: isPressed ? 'true' : 'false'})`, so the
attribute is `data-is-pressed="true"`. The bare key compiled to
`.astryx-toggle-button[data-is-pressed="isPressed"]`, which matches nothing at
all: the toggle flipped `aria-pressed` correctly, announced itself correctly,
and painted **nothing**, in all six `ToggleButton` and `ToggleButtonGroup`
examples.

The compiler can express it. `parseStyleKey` splits a key on `:` and only the
*prop* half is validated against the component's known props and states, so
`'isPressed:true'` is accepted and compiles to `[data-is-pressed="true"]`. That
is the fix.

`SelectableCard` is the only other target that reflects a state as
`true`/`false`; Tecton does not theme it. `builtTheme.test.ts` now asserts
against the built stylesheet that `[data-is-pressed="true"]` is present, that
`[data-is-pressed="isPressed"]` is not, and — generically — that the only
attributes whose value repeats their own name are the three states that really
do reflect that way.

**The second half of the same bug, and the thing that makes it interesting.**
`ToggleButton` paints its pressed background from `--color-overlay-pressed`
(`pressedStyles.background` in core's `ToggleButton.tsx`), and `NO_OVERLAY_TINT`
on the `button` base sets that token to `transparent`. So even with the selector
fixed there would be no fill — *if that were the mechanism in play*. It is not,
and re-pointing the token does not work:

- `ToggleButton` renders `<Button variant="ghost">`, and the theme's
  `variant:ghost` rule sets `background-color` from `@layer astryx-theme`, which
  beats **any** StyleX declaration regardless of specificity. The component's
  own pressed paint never gets a say.
- `Button` also composites its press state as a `background-image` **gradient**
  of that same token. The design's activated fill is opaque, so a re-pointed
  token would paint the resting activated fill *over* the `:active` one and
  flatten the press — trading one flattened state for another.

So the fill is the theme's own `background-color` on `isPressed:true`, and
`:hover` and `:active` are stated beside it for the same cascade reason: without
them the ghost variant's hover fill (`#3a343e`, *darker* than the activated
`#4e4853`) wins on a pressed toggle, and hovering an activated toggle looks like
turning it off. `design/components/toggle-button.md` measures the activated
square at `~#433d47`–`#4e4853` with a brighter icon `~#cbc4d5`; the hover and
press steps are the next two stops of the same graphite ramp, because the matrix
documents no hover or pressed column for the control.

`--color-overlay-pressed` therefore stays suppressed on the button family and
stays live everywhere else — rows, menu items, cards, thumbnails, which have no
Tecton fill of their own and press through it. That is pinned by a test.

### 14. A state colour said as the property instead of as the token the component mixes from

`components.ts`, `checkbox-indicator`, `radio-indicator`, `switch`,
`switch-thumb`, `slider-thumb`.

This is §5 of Part one — *"the colour goes into the mechanism"* — one level
down. Part one was about a theme taking away the component's say in **when** a
hover happens. This is about taking away its ability to compute **what** the
hover is.

Every one of these controls paints a state from a token and derives the next
state from the *same* token with a `color-mix()`:

```
backgroundColor: {
  default: colorVars['--color-accent'],
  [when.ancestor(':hover', scope)]:
    `color-mix(in srgb, ${colorVars['--color-accent']}, ${colorVars['--color-tint-hover']} 15%)`,
}
```

A theme rule that sets `background-color` on `checked` lands in the later layer
and overrides **both** branches. The resting colour comes out right, so a
resting diff sees nothing, and the control is inert under the pointer.

Measured: 36 findings on the checkbox indicator, 36 on the radio indicator, 8 on
the switch. Said as the token — `--color-background-surface` for the box,
`--color-border-emphasized` for its rule, `--color-accent` for the checked chip,
`--color-background-gray` for the switch's off track — the component keeps its
mix and lands on the value the design asks for anyway:
`design/components/checkbox.md` says *"Hovered: the box border/fill brightens a
step (`#bab3c0` → `#cac5d2`)"*, and a 20 % white mix of `#bab3c0` **is**
`#c8c2cc`.

Three more things fell out of doing it this way:

- **The off switch was a blob.** `design/components/switch.md` gives the off
  track and the off knob *the same* mauve `#aaa1b2`, because one of them is a
  1px ring: *"the off track is an outline, not a filled grey pill — a
  distinctive, low-ink treatment"*. Part one removed a 1px border from the
  switch (correctly — it ate 2px of a border-box track and overrode the
  forced-colours rule) and replaced it with a **fill** in the border's colour.
  Track and knob then cancelled out and the knob disappeared. The ring is now an
  inset `box-shadow`, which costs no layout, leaves `border-width: 0` and the
  `CanvasText` forced-colours branch alone, and displaces nothing — `Switch`
  draws no shadow of its own. `checked+disabled` is expressible as a key, so the
  design's "disabled-on drops the violet to neutral grey" is now reachable too.
- **Forced colours survives.** `switch-thumb`, and the radio's dot, both carry a
  `@media (forced-colors: active)` branch (`CanvasText` / `HighlightText`) that a
  `background-color` from the theme layer overrode with a colour that does not
  exist in that mode. Re-pointing the token they read leaves the branch standing.
- **`radio-indicator-dot` stopped being a target at all** — the dot paints from
  `--color-on-accent`, which the checked ring re-points.

`Link` belongs to the same family, and is the one place where saying it as the
token does not get the state back. It is treated in §18.

`slider-thumb` was the same rule with no finding behind it — no example in the
catalogue puts a slider thumb where the driver can point at one — so it is
fixed on inspection rather than on measurement, which is noted here rather than
counted above.

### 15. A fill colour used as ink

`tectonTheme.ts` maps `--color-accent` to the design's *primary button
background* and `--color-error` / `--color-success` to the *filled* severity
colours. That is right: those are the roles the design gives those names.

But several components read those same tokens as a **foreground**:

| Component | What it paints with the fill token | Measured |
| --- | ---: | ---: |
| `Icon color="accent"` | the glyph | 2.20:1 |
| `Stepper` indicator | the completed/in-progress glyph | 2.20:1 |
| `Stepper` number badge | its own digit, on its own accent fill | 1.98:1 |
| `MetadataList` "Show more" | the button's label | 2.20:1 |
| `ChatToolCalls` | the `+6` / `-3` diff stat | 4.02:1 hovered |

Tecton already draws this distinction for text — `--color-text-accent` is the
design's *adornment* lilac, and `--color-icon-accent` is the same value — so the
fix is to hand the components that use accent as ink the ink. Scoped to the
targets that need it, never globally: `--color-accent` on `stepper` itself would
reach a primary button inside a step's content panel, whose fill this is.

- `icon: {'color:accent': …}` — the same shape as `link`'s, on the one prop
  value that means it.
- `step-indicator`, `step-connector` — one re-point fixes the glyph *and* the
  number badge at once, because the adornment lilac is light where the accent is
  dark, and the badge's digit is `--color-background-surface`.
- `metadata-list`.
- `chat-tool-calls` — `--color-success` → `--color-text-green`,
  `--color-error` → `--color-text-red`: the same two severities as ink, four
  ramp steps lighter.

### 16. The hover and press washes lifted the surface out from under its ink

`tectonTheme.ts`, `--color-overlay-hover: ink('10')`,
`--color-overlay-pressed: ink('20')`.

These two wash every row, nav item, tree item, menu item and calendar day that
Tecton has no named fill for. The ink on top of them is chosen against the
**page**, and at 20 % white a pressed row came up to `#4a494c` — which took
`--color-icon-secondary` on it to **2.44:1**, under the 3:1 bar, on the side
nav, the top nav, the tree list, the mega menu and a multi-selector's field
icons at once. 97 findings across 44 examples, and every one of them the same
arithmetic.

The washes are the one part of this theme with no design source: Tecton states
are named fills, and these were invented here at 10 % and 20 %. At 5 % and 10 %
— which is exactly what the layer underneath uses, so nothing is being invented
to get there — the same glyph clears the bar everywhere, and every marginal case
in the list goes with it.

One more shortfall of the same shape needed a different answer.
`<Icon color="secondary" />` *inside a button* keeps `--color-icon-secondary`
while the button under it fills with its own hover or press colour, and on the
tertiary press fill that pairing measures 2.88:1 whatever the wash does. The
design already says what should happen — `design/components/toggle-button.md`,
*"Enabled: icon `~#9a91a2`; Activated: a brighter icon `~#cbc4d5`"* — so the
`secondary`, `ghost` and `outlined` emphases now re-point
`--color-icon-secondary` on `:hover` and `:active` to the ink their label
already takes.

### 17. The page's ghost ink on a banner's severity fill

`components.ts`, `button['variant:ghost'].color`.

A ghost button has no fill at rest, so it wears whatever is behind it — and one
of the places it is dropped is inside a `Banner`, on a saturated severity band.
A banner's collapse chevron measured **1.21:1** on the warning fill.

This is the same shape as §8 of Part one, which re-pointed the *focus ring*
inside a banner to the ink the design already puts on that fill. `bannerStatus()`
already re-points `--color-text-*` and `--color-icon-*`; the ghost button's ink
was the one thing on that surface still stated as a literal value. It is now a
theme-local token, `--tecton-color-action-tertiary-text`, which `bannerStatus()`
re-points alongside the others. No palette value changed.

### 18. A link whose reference hover is below a just-noticeable difference

This one is the instrument, not the theme, and it is worth writing down because
the first reading of it was wrong.

Six findings said Tecton's `Link` does not paint a hover or an active state
where the reference does. It does not — but neither does the reference, to any
perceptible degree: upstream's link mixes 15 % of `--color-tint-hover` into an
ink that is already `#f1f1f1` and comes out at `#f3f3f3`; inside a `Toast`,
where the surface is inverted, `#1b1b1b` becomes `#171717`. Four units of a
channel, 1.04:1, on text.

And the design is explicit that Tecton's link should not move.
`design/components/link.md` tabulates both underline policies and gives the
hovered row as *"underline appears; text unchanged"* and *"underlined,
unchanged"*. The affordance is the underline, which Tecton draws — and all six
findings were on the two examples that set `hasUnderline`, where the underline
is there at rest and there is nothing else to change.

Two consequences:

1. The comparison gained the two tolerances described above, so a
   sub-perceptual reference change is no longer counted as a state the theme
   failed to match. Non-colour differences are still exact. That is the whole
   of the difference between the 300 findings the first run reported and the
   252 in the table.
2. While looking at it, one real thing turned up. The moment a theme names
   `link`, `text` or `heading` as a target, the compiler emits its own
   `.astryx-link[data-color="accent"] { color: var(--color-text-accent) }`
   (`generateColorOverrides`, so a colour prop always beats a token change),
   later in the same layer. Tecton's `link` rule set `color` directly, which
   that rule overwrote anyway. Saying it as `--color-text-accent` is what
   actually reaches the emitted rule, and it leaves every other value of the
   `color` prop alone. The link renders identically and the theme now says it
   in the one place that is not overwritten. It also means `Link`'s own hover
   `color-mix()` is unreachable for *any* theme that styles `link` — which
   costs Tecton nothing, and would cost a theme whose design did want a
   coloured link hover quite a lot.

### 19. Validation drawn as a box where the design draws ink

`components.ts`, `field-status`.

This one has no finding behind it, and it could not have. `FieldStatus` paints
its message on a `--color-{error,warning,success}-muted` wash — that is what
the component is drawn as, and the reference theme draws it the same way — so
the diff sees two renders agreeing and says nothing. It is in this report
because it is one of the three things a person looked at and called broken, and
because the fix belongs with the rest.

`design/components/textfield.md` draws validation as *"Helper text below the
field … replaced by 'Validation failed' in red in the Error state"*, and the
state matrix gives the error as *"border, label and helper all red"*: ink on
the page, with nothing behind it. There is no box anywhere in the
transcription.

Worse, on Tecton the box did not stay under the field. The `attached` message
carries `margin-top: calc(-1 * 6px)` so it tucks under the control, which
upstream hides behind an **opaque** input surface — and Tecton's field is
transparent, because `design/components/textfield.md` says the outlined field
is *"transparent fill, 1px grey border"*. So the wash showed through the bottom
6px of every errored, warned and succeeded field in the system. That is the
"the field body itself is tinted" half of the report.

`field-status` now sets `background-color: transparent` on its base, which
removes both at once and costs no geometry: the padding that positioned the
text still positions it, and the per-type inks the theme already set are what
is left. The `--color-*-muted` tokens are untouched — `Banner`'s muted
severities and `ChatComposer`'s error strip are drawn as tinted surfaces on
purpose, and both read correctly in dark and light.

The fidelity report had this recorded as a gap under "TextField" and as
deviation 2 in §5; both now say what the theme does instead.

## States and paints — what was deliberately left

- **No palette value moved.** Every colour above is a stop of a ramp in
  `tokens/tecton.tokens.json`, reached through `semantic.ts`. Five new roles
  were *named* (`toggleButton.activatedFill` / `activatedHoverFill` /
  `activatedPressFill` / `activatedText`, and `switch.disabledBorder`) and one
  new theme-local token added (`--tecton-color-action-tertiary-text`, which is
  in `theme-token-manifest.json`); every one of them resolves to a value the
  design already measures.
- **No component behaviour.** Everything here is a colour, said in a different
  place. The one geometric-looking change — the switch's ring as an inset
  shadow rather than a border — is the *removal* of a geometric change: a border
  resizes a border-box track, an inset shadow does not.
- **The `--color-*-muted` washes.** Turning off `FieldStatus`'s box was done on
  the `field-status` target, not by re-weighting the tokens, because `Banner`'s
  muted severities and `ChatComposer`'s error strip are drawn as tinted surfaces
  on purpose and read correctly in both modes.
- **`--color-accent` itself.** It is the design's primary-button fill and it
  stays that. Only the targets that read it as ink were re-pointed.

## States and paints — what is still not covered

- **Drag.** A slider thumb is captured at rest, hovered, pressed and focused,
  but nothing here drags one along its track. `[role="slider"]` is excluded from
  the state comparison for that reason — a driver that presses a thumb and
  releases without moving is not exercising the control.
- **Long-press, double-click, multi-select, and any state reached by more than
  one gesture.** The driver does one click per control.
- **Controls below the fold.** Only what is inside the 1100×900 viewport can be
  pointed at; the resting audit measures the whole tree.
- **More than eight controls per example, or three of a kind.** A page with 300
  links would otherwise become the audit.
- **Light mode, as a bar.** `--light` records the light render's contrast
  failures per example; they are not counted as findings. Light is derived, and
  the derivation's own numbers are asserted in
  `packages/react/src/theme/__tests__/contrast.test.ts`.

  What it recorded on the final run, for the record: **125 shortfalls across 14
  of the 294 examples** that had a light capture, in three groups. 51 of them
  are content inside the **top-nav band**, which Tecton paints black in *both*
  modes while the ink inside it resolves light mode's near-black primary and
  secondary — 1.21:1 and 2.81:1. 44 are `--color-text-disabled` on the light
  page at 2.22:1, which is the platform's disabled affordance and exempt from
  WCAG 1.4.3. The remaining two are a 4.15:1 pairing. The top-nav one is a real
  derivation gap and belongs with the six already listed in
  `docs/design/light-mode.md`; it is not fixed here, because the band's ink
  reaches a dozen components through inheritance and getting it right needs the
  light render measured as a first-class target rather than as a footnote.
