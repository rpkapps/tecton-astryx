# Fidelity report — Tecton on the upstream component library

What survived the port, what was approximated, and what could not be expressed
at all.

This takes the transcribed Tecton design (`design/`, `tokens/`,
`screenshots/`) and expresses it as a theme for the third-party component
library `@tecton/react` is built on. Since v2 it is the whole of Tecton: read
§0 first. Nothing was swizzled, no upstream source
was edited, no CSS file targets an upstream class and no rule uses
`!important`. Everything below is the result of `defineTheme` — tokens,
theme-local tokens, typography, radius, focus, shadow and component overrides —
compiled by `astryx theme build`.

**Scale.** 193 token overrides across every colour, typography, radius, focus,
shadow, size and border family; 34 theme-local tokens for Tecton roles the
token layer has no name for; 73 component targets overridden; 4 custom prop
values added (2 button variants, 1 badge variant, 1 banner status) plus 8
custom `Text` types; 255 unit tests on the theme.

The component-target list changed shape in §0.1: the overrides that were
restating something a component already said are gone, and a dozen more
components now get their keyboard focus stated explicitly. What the theme says
about colour, type, radius and icons is unchanged.

**How to read the renders.** `docs/design/fidelity/` holds a capture of
`/preview/theme` in both colour modes at 1600 CSS px and 2× device pixels — the
same width and density as the design captures in `screenshots/`. Hover, pressed
and focus are forced through the debugger, so the button matrix is a real state
matrix. One caveat: the capture environment has no route to the webfont CDN, so
the renders show the declared **fallback** stack rather than Figtree and IBM
Plex Mono. Type sizes, weights and line heights are verified numerically
against `design/foundations/typography.json` instead (see
`packages/react/src/theme/__tests__/tectonTheme.test.ts`).

---

## 0. What changed in v2

**Everything below describes the theme, and the theme is now the only thing
Tecton has.**

The report was written when Tecton also shipped 48 hand-written components and
132 renamed wrappers in front of the component system. Those are gone: the
package publishes the component system as it is — its names, its props, its
types — and Tecton is the theme applied to it. Read §2–§6 as a report on that
theme, because that is all they ever measured; the verdicts, the token
counts and the component-target list are unchanged, because no token value
moved.

What *is* different is what happens to the gaps.

- **Fidelity that lived in wrapper code no longer exists.** Where a wrapper
  composed two components to reach a Tecton shape, narrowed a prop so a
  consumer could not choose something off-design, defaulted a value, or
  resolved a Tecton glyph name on an icon prop, none of that is there any
  more. A consumer writes the component's own API, with the component's own
  defaults, and Tecton reaches it through the theme or not at all.
- **The gaps in §5 are therefore honest rather than papered over.** A shape the
  theme cannot express is a shape the system does not have. The previous
  version hid some of them behind a wrapper's prop surface, which made the
  design look more faithfully reproduced than the system actually was.
- **Icons still arrive.** The theme's icon registry is unchanged, so a
  component that asks the theme for a glyph by role still gets a Tecton one.
  What is gone is the name-based `icon="drill-bit"` prop the wrappers widened;
  an application that draws its own icon imports the glyph component from
  `@tecton/react/icons`.
- **Custom variants stayed, and they are the right mechanism.** `Button`
  `outlined` and `text-only`, `Banner` `neutral`, `Badge` `lime` and the eight
  Tecton text types are declared through `defineTheme` and ship with the theme.
  They are extra values for props the components already have — sanctioned
  extensions of the component's API, not components.
- **One new consequence, for pages running several versions.** Every Tecton
  rule is now in the theme layer, so a per-component decision is a
  cross-version contract in exactly the way a token is. §7 of
  `docs/engineering/surface.md` and the micro-frontend README have the detail.

One thing was lost outright and is worth naming: cross-copy **toast** merging.
Tecton's own `useToast` carried plain data, which could cross from one copy of
the package to another and be rendered once. The component system's `useToast`
carries a `ReactNode`, which cannot. Each copy now shows its own toasts in its
own viewport.

## 0.1 Audit

Everything from §1 down is a report on **fidelity** — how close the theme gets
to the transcribed design. It is not a report on **correctness**, and the two
are not the same question. A theme can carry every colour of the design and
still take a component apart, because the rules it writes land in a later
cascade layer than the component's own and can override geometry the component
depends on.

That second question is answered separately, by measurement, in
**`docs/design/theme-audit.md`**. All 646 ported examples are rendered twice —
once under Tecton and once, from the same example files, under
`@astryxdesign/theme-neutral`, the theme the upstream documentation site renders
them with — and the two renders are diffed element by element, with a keyboard
focus audit on top.

The first run of that audit found **186 of the 646 examples** carrying a
difference the theme could not justify: 538 structural findings and 138 focus
findings, from twelve root causes. Among them a `border-radius` that flattened
every `ButtonGroup` into a row of separate pills, a `background-color` that
painted over `Card`'s `variant` prop, a `box-shadow: none` that erased
`SelectableCard`'s selection ring, `:nth-child(even)` and `:hover` rules that
striped and highlighted tables with those props switched off, a border that
squeezed `Switch`'s thumb off-centre, and — the ones that matter most — a field
family that had stopped showing keyboard focus at all, and a focus ring that was
invisible against every one of a `Banner`'s severity fills.

All twelve are fixed in `packages/react/src/theme/**`. The same audit now reports
**4 examples** with a finding, **0 structural**, and 5 focus findings that are
all one recorded deviation: the design's focus pink does not reach 3:1 on a
light surface, and there is no second focus hue in the transcription to reach it
with. Every rule the fixes restored is pinned by a test in
`packages/react/src/theme/__tests__/tectonTheme.test.ts`, so none of them can
come back quietly.

Nothing in §1–§7 changed as a result: **no token colour moved**, and the theme
still says everything about palette, type, radius and icons that it said before.
What changed is that it no longer says anything about layout. Two consequences
are worth naming here because they read as gaps elsewhere in this report:
`card` and `section` are no longer component targets at all (their 16px is the
components' own default), and `tooltip` is not one either (the transcription has
no tooltip page, so there was no Tecton shape to reach for).

**Part two of the same report answers the half that a resting render cannot
show.** A diff of an untouched page cannot tell a control whose pressed fill is
right from one whose pressed fill compiles to a selector that matches nothing —
and that is exactly what `ToggleButton` was doing while the run above came back
clean. The state audit drives all 646 examples through rest → hover → mouse
down → the state change → keyboard focus, on both renders, and compares the
paint of every stateful control and its visual descendants. Its first run found
**300 findings in 84 examples** from six causes: a state key that could not
match, a state colour said as the property instead of as the token the component
mixes its next state from (a checked box, a checked radio and an on switch all
inert under the pointer, and an off switch with no visible knob at all), a fill
colour used as ink, and two hover/press washes strong enough to lift a row out
from under the glyph on it. All of them are fixed; the run now reports **0**.
The three states that matter most — a pressed toggle, a switch on and off, and a
field's validation — carry before/after/reference screenshots in
`docs/design/theme-audit/`.

## 1. Summary

| Area | Verdict | One line |
| --- | --- | --- |
| **Palette** | **Exact** | All 266 transcribed rows resolve to a foundational token, and every colour in the theme is a reference to one. 50 portable-token roles and 22 theme-local roles are asserted against `colors.json`, in both modes. |
| **Typography (scale)** | **Exact** | All 16 Tecton variants are expressed: 14 as explicit `--text-*` tokens, 8 as custom `Text` types. Sizes, weights and leadings match the foundation exactly. |
| **Typography (weights)** | **Approximated** | Tecton has two weights, 400 and 500. `semibold` is mapped to 500 (there is no 600 in the design) and `bold` to 600 so prose `<strong>` has somewhere to go. |
| **Shape** | **Approximated** | Tecton's 7-step radius scale onto 5 semantic steps + none/full. 2, 4, 8, 12 and 16px all land; nothing is lost, but `chat` carries 12px and `page` carries 16px, which is not what those names mean. |
| **Spacing** | **Exact** | Identical 4px grid. Tecton's 2px and 6px steps exist as `--spacing-0-5` and `--spacing-1-5`. Tecton's names are exposed through the `tecton.space` map. |
| **States** | **Approximated** | Enabled / hover / pressed / focus / disabled are exact for every button emphasis, and every one of them is measured in a browser rather than read off the theme (Part two of the audit). `activated` has no slot on a plain button — it is `ToggleButton` with `isPressed`. |
| **Components** | **Approximated** | 65 targets recoloured; the shapes that differ from the design are listed in §5. The three biggest are the field appearances, the indeterminate checkbox and the tab focus treatment. |
| **Icons** | **Not expressible** | Tecton has 131 bespoke glyphs, ~23 of them subsurface-domain shapes with no equivalent anywhere. The default semantic set is kept. See the open questions. |
| **Motion** | **Not assessed** | No Tecton source. Upstream defaults kept unchanged. |

---

## 2. Token table

Every token the theme sets, with the Tecton role it carries and its resolved
value in both modes. "Role" is the name the colour foundation prints; where a
value is carried by more than one row, the first two are listed. A blank role
means the value is a derived wash or a non-colour token.

Verdicts: **exact** — the transcribed value; **derived** — the light side comes
from the rule in `docs/design/light-mode.md`; **approximated** — Tecton has no
value for this role and the closest one was chosen; **wash** — an alpha step of
a Tecton ramp used where the component composites rather than fills.

### Core semantic colour

| Token | Tecton role | Dark | Light | Verdict |
| --- | --- | --- | --- | --- |
| `--color-accent` | primary Background | `#5d4d68` | `#b89dc8` | exact / derived |
| `--color-accent-muted` | violet 25 % wash | `#80708b40` | `#976dac40` | wash |
| `--color-on-accent` | primary Text | `#e5e0eb` | `#35214b` | exact / derived |
| `--color-neutral` | secondary Background | `#3a343e` | `#d5cddb` | exact / derived |
| `--color-background-body` | Background default | `#1d1c1f` | `#f6f4f7` | exact / derived |
| `--color-background-surface` | Background elevated | `#131214` | `#fafafb` | exact / derived |
| `--color-background-card` | Background elevated | `#131214` | `#fafafb` | exact / derived |
| `--color-background-popover` | Background elevated | `#131214` | `#fafafb` | exact / derived |
| `--color-background-muted` | input / filled / background | `#28232c` | `#ebe9ee` | exact / derived |
| `--color-background-inverted` | Text primary | `#f6f5f8` | `#1e1825` | exact / derived |
| `--color-background-error-inverted` | error Bright | `#e3a6a6` | `#8b1f0b` | exact / derived |
| `--color-overlay` | textOnly Focus background (black 50 %) | `#00000080` | `#00000080` | approximated |
| `--color-overlay-hover` | — (ink 5 %) | `#ffffff0d` | `#0000000d` | approximated |
| `--color-overlay-pressed` | — (ink 10 %) | `#ffffff1a` | `#0000001a` | approximated |

### Text and icon

| Token | Tecton role | Dark | Light | Verdict |
| --- | --- | --- | --- | --- |
| `--color-text-primary` | Text primary | `#f6f5f8` | `#1e1825` | exact / derived |
| `--color-text-secondary` | Text secondary | `#a7a2ac` | `#604e6e` | exact |
| `--color-text-disabled` | Text disabled | `#545356` | `#ada3b2` | exact / derived |
| `--color-text-accent` | primary Adornment | `#beb1c8` | `#5c3878` | exact |
| `--color-on-dark` | Text primary (fixed) | `#f6f5f8` | `#f6f5f8` | exact |
| `--color-on-light` | Text inverse (fixed) | `#131214` | `#131214` | exact |
| `--color-icon-primary` | Text primary | `#f6f5f8` | `#1e1825` | exact / derived |
| `--color-icon-secondary` | Text subtlest | `#89848e` | `#7b668b` | exact |
| `--color-icon-disabled` | disabled Filled adornment | `#403f42` | `#c7c1cc` | exact / derived |
| `--color-icon-accent` | primary Adornment | `#beb1c8` | `#5c3878` | exact |

### Status

| Token | Tecton role | Dark | Light | Verdict |
| --- | --- | --- | --- | --- |
| `--color-success` | success Filled background | `#4fa66f` | `#0c703e` | exact |
| `--color-on-success` | success Filled text | `#001607` | `#f3fef8` | exact |
| `--color-success-muted` | green 25 % wash | `#61b67f40` | `#10a05540` | wash |
| `--color-error` | error Filled background | `#c16e6c` | `#d22f11` | exact |
| `--color-on-error` | error Filled text | `#2e0000` | `#fffaf9` | exact |
| `--color-error-muted` | red 25 % wash | `#b25d5940` | `#ed371d40` | wash |
| `--color-warning` | warning Filled background | `#e59306` | `#7a4a00` | exact |
| `--color-on-warning` | warning Filled text | `#1d0f01` | `#fffbf1` | exact |
| `--color-warning-muted` | yellow 25 % wash | `#fbbc3b40` | `#ffb61f40` | wash |

### Borders and effects

| Token | Tecton role | Dark | Light | Verdict |
| --- | --- | --- | --- | --- |
| `--color-border` | Divider subtle | `#342f39` | `#e4dde7` | exact |
| `--color-border-emphasized` | Divider medium | `#57515c` | `#b2a1bb` | exact |
| `--color-skeleton` | secondary Background | `#3a343e` | `#d5cddb` | approximated |
| `--color-track` | Divider strong | `#6e6873` | `#9884a4` | exact |
| `--color-shadow` | black 50 % / 15 % | `#00000080` | `#00000026` | approximated |
| `--color-tint-hover` | white / black | `#ffffff` | `#000000` | exact |

### Hue families

Ten hue slots, seven Tecton accents. `cyan` and `teal` both take azure,
`orange` takes saffron, `yellow` takes lemon, `gray` takes graphite, `purple`
takes lilac (which the Accents page does not list — it is the ramp the primary
action is drawn from). `background-*` is the family's 25 % alpha step.

| Token | Tecton role | Dark | Light |
| --- | --- | --- | --- |
| `--color-background-blue` / `-border-` / `-icon-` / `-text-` | blue 25 % / blue fill / blue fill / blue text | `#4874cb40` / `#8ca7de` / `#8ca7de` / `#b7c9eb` | `#507bd340` / `#2850a1` / `#2850a1` / `#1c3a75` |
| `--color-*-cyan` | azure 25 % / azure fill / azure fill / azure text | `#32c9c940` / `#29a6a6` / `#29a6a6` / `#68d9d9` | `#31c4c440` / `#1b6b6b` / `#1b6b6b` / `#114242` |
| `--color-*-teal` | azure (duplicate of cyan) | same as cyan | same as cyan |
| `--color-*-gray` | graphite 25 % / graphite fill / graphite fill / graphite text | `#7a747f40` / `#98939d` / `#98939d` / `#cac6ce` | `#8c769a40` / `#6d5a7d` / `#6d5a7d` / `#433751` |
| `--color-*-green` | green 25 % / success Filled bg / success Filled bg / success Outline text | `#61b67f40` / `#4fa66f` / `#4fa66f` / `#92d6a8` | `#10a05540` / `#0c703e` / `#0c703e` / `#07452a` |
| `--color-*-orange` | saffron 25 % / saffron fill / saffron fill / saffron text | `#dcac8940` / `#cb8553` / `#cb8553` / `#e5c2a9` | `#e1a57940` / `#914f20` / `#914f20` / `#593114` |
| `--color-*-pink` | pink 25 % / pink fill / pink fill / pink text | `#d5aca440` / `#c2867a` / `#c2867a` / `#e1c3bd` | `#d5aaaa40` / `#994c4c` / `#994c4c` / `#5c2e2e` |
| `--color-*-purple` | lilac 25 % / lilac 560 / lilac 560 / lilac 1000 | `#836e9140` / `#9f8ead` / `#9f8ead` / `#cdc4d8` | `#9d6ab540` / `#7a4e9b` / `#7a4e9b` / `#4a3067` |
| `--color-*-red` | red 25 % / error Outline strong border ×2 / error Outline press border | `#b25d5940` / `#cc7f7d` / `#cc7f7d` / `#ecbbbc` | `#ed371d40` / `#ba2a0f` / `#ba2a0f` / `#751a0a` |
| `--color-*-yellow` | lemon 25 % / lemon fill / lemon fill / lemon text | `#fcf21e40` / `#9e9813` / `#9e9813` / `#d6ce1a` | `#ffed2940` / `#735e01` / `#735e01` / `#473a01` |

### Focus, shape, size

| Token | Value | Tecton source |
| --- | --- | --- |
| `--focus-outline-color` | `#ff52a8` / `#ff00aa` | Focus ring (`hotPink.460`) — exact |
| `--focus-outline-width` | `2px` | measured on the button matrix |
| `--focus-outline-style` | `solid` | measured |
| `--focus-outline-offset` | `2px` | measured (`~1px` outside the edge with a `~1px` gap; buttons pull it to 1px with `--button-focus-offset`) |
| `--radius-none` | `0px` | `radius.0` — exact |
| `--radius-inner` | `2px` | `radius.25` — exact |
| `--radius-element` | `4px` | `radius.50` "default Tecton corner radius" — exact |
| `--radius-container` | `8px` | `radius.100` — exact |
| `--radius-chat` | `12px` | `radius.150` — carried here for want of a better slot |
| `--radius-page` | `16px` | `radius.200` — carried here for want of a better slot |
| `--radius-full` | `9999px` | `radius.round` is `1000px`; 9999 is the same thing in practice |
| `--size-element-sm` | `28px` | Button sm / TextField Small — exact |
| `--size-element-md` | `32px` | Button md / TextField Medium — exact |
| `--size-element-lg` | `36px` | no Tecton source; upstream default kept |
| `--border-width` | `1px` | every Tecton border and divider — exact |

### Elevation

Tecton is flat: no panel in `design/patterns/panels.md` carries a drop shadow,
and only FAB has one. The three steps are kept soft so a component that insists
on elevation does not break the look.

| Token | Value |
| --- | --- |
| `--shadow-low` | `0px 1px 2px light-dark(#0000001a, #00000066)` |
| `--shadow-med` | `0px 2px 6px light-dark(#00000026, #00000080)` |
| `--shadow-high` | `0px 8px 24px light-dark(#00000033, #00000099)` |
| `--shadow-inset-hover` | `inset 0 0 0 2px` mauve 25 % |
| `--shadow-inset-selected` | `inset 0 0 0 2px` violet 50 % |
| `--shadow-inset-success` / `-warning` / `-error` | `inset 0 0 0 2px` green / yellow / red 30 % |

### Theme-local tokens

Tecton roles with no portable token. All 34 are `[light, dark]` pairs and all
are asserted against `colors.json`.

| Token | Tecton role | Dark | Light |
| --- | --- | --- | --- |
| `--tecton-color-text-placeholder` | Text placeholder | `#6a696c` | `#92879a` |
| `--tecton-color-divider-strong` | Divider strong | `#6e6873` | `#9884a4` |
| `--tecton-color-success-muted` | success Muted | `#217846` | `#10a055` |
| `--tecton-color-warning-muted` | warning Muted | `#995b04` | `#c07d00` |
| `--tecton-color-error-muted` | error Muted | `#832d28` | `#f69c8f` |
| `--tecton-color-info` | info Main | `#8ca7de` | `#2850a1` |
| `--tecton-color-info-bright` | info Bright | `#b7c9eb` | `#1c3a75` |
| `--tecton-color-info-muted` | info Muted | `#3766c4` | `#638ad9` |
| `--tecton-color-info-filled` | info Filled background | `#6086d2` | `#3a6acb` |
| `--tecton-color-on-info` | info Filled text | `#0a1324` | `#f7f7fa` |
| `--tecton-color-info-adornment` | info Filled adornment | `#1d3566` | `#bed0ee` |
| `--tecton-color-status-neutral` | neutral Main | `#959497` | `#685d72` |
| `--tecton-color-status-neutral-filled` | neutral Filled background | `#2c2b2e` | `#e1dee4` |
| `--tecton-color-on-status-neutral` | neutral Filled text | `#c8c7ca` | `#3a3343` |
| `--tecton-color-accent-lime` | lime fill | `#84a138` | `#546918` |
| `--tecton-color-text-lime` | lime text | `#b0d54e` | `#33400e` |
| `--tecton-color-top-nav-background` | top-nav / solid-background | `#000000` | `#000000` |
| `--tecton-color-top-nav-text` | top-nav / contrast-text | `#ffffff80` | `#ffffff80` |
| `--tecton-color-top-nav-adornment` | top-nav / adornment | `#90809e` | `#8b5ba9` |
| `--tecton-color-table-header` | table / header / background | `#433d47` | `#cbc0d1` |
| `--tecton-color-table-footer` | table / footer | `#28232c` | `#ebe9ee` |
| `--tecton-color-table-stripe` | table / cell / background-alt | `#323134` | `#dbd6dd` |
| `--tecton-color-table-row-hover` | table / cell / states / hover-background | `#3a343e` | `#d5cddb` |
| `--tecton-color-table-row-selected` | table / cell / states / active-background | `#4e4853` | `#bcafc4` |
| `--tecton-color-input-filled-background` | input / filled / background | `#28232c` | `#ebe9ee` |
| `--tecton-color-input-filled-hover` | input / filled / states / hover-background | `#342f39` | `#e4dde7` |
| `--tecton-color-input-border` | input / outlined / border | `#57515c` | `#b2a1bb` |
| `--tecton-color-input-border-hover` | input / outlined / states / hover-border | `#cac5d2` | `#463458` |
| `--tecton-color-input-value` | input / outlined / value-text | `#f7f6f8` | `#21172a` |
| `--tecton-color-input-placeholder` | input / outlined / placeholder-text | `#89848e` | `#7b668b` |
| `--tecton-color-input-text-only-rule` | input / text-only / contrast-text | `#98939d` | `#6d5a7d` |
| `--tecton-color-action-outlined-border` | outlined Strong border | `#aaa1b2` | `#644a78` |
| `--tecton-color-action-text-only` | textOnly Text | `#9a91a2` | `#725687` |
| `--tecton-color-action-tertiary-text` | tertiary Text | `#bab3c0` | `#563f67` |

### Contrast

Measured with the WCAG 2.x formula, asserted in
`packages/react/src/theme/__tests__/contrast.test.ts`.

| Pairing | Dark | Light | Bar | Result |
| --- | --- | --- | --- | --- |
| text-primary on body | 15.62 | 15.84 | 4.5 | pass |
| text-primary on surface | 17.20 | 16.60 | 4.5 | pass |
| text-secondary on body | 6.79 | 6.83 | 4.5 | pass |
| on-accent on accent | 5.94 | 5.91 | 4.5 | pass |
| on-success on success | 6.28 | 5.98 | 4.5 | pass |
| on-warning on warning | 7.59 | 7.24 | 4.5 | pass |
| on-error on error | 5.12 | 4.88 | 4.5 | pass |
| on-info on info fill | 5.16 | 4.79 | 4.5 | pass |
| text-primary on table header | 9.68 | 9.90 | 4.5 | pass |
| focus ring on body | 5.67 | 3.29 | 3.0 | pass |
| divider strong on body | 3.14 | 3.11 | 3.0 | pass |
| icon-secondary on body | 4.65 | 4.67 | 3.0 | pass |
| **border-emphasized on body** | **2.21** | **2.20** | 3.0 | **fail — inherited from the design** |

The last row is Tecton's "Divider medium", the default border. It is a quiet
rule by design and the port did not change it; the test pins the number so a
future change is visible. Use `divider strong` where a separator has to be seen.

---

## 3. Typography

All 16 variants from `design/foundations/typography.json`. 14 are bound to
`--text-*` tokens; 8 are additionally declared as custom `Text` types so they
can be reached by name.

| Tecton variant | Size | Weight | Leading | Carried by | Verdict |
| --- | --- | --- | --- | --- | --- |
| display1 | 3rem | 500 | 1.2083 | `--text-display-1-*` | exact |
| display2 | 2.5rem | 500 | 1.2 | `--text-display-2-*` | exact |
| display3 | 2rem | 500 | 1.1875 | `--text-display-3-*` | exact |
| heading1 | 1.5rem | 500 | 1.25 | `--text-heading-1-*` | exact |
| heading2 | 1.25rem | 500 | 1.2 | `--text-heading-2-*` | exact |
| large | 1rem | 500 | 1.25 | `--text-large-*`, `--text-heading-3-*` | exact |
| medium | 0.875rem | 400 | 1.2857 | `--text-body-*` | exact |
| mediumStrong | 0.875rem | 500 | 1.2857 | `--text-label-*`, `--text-heading-4-*`, `type:mediumStrong` | exact |
| small | 0.75rem | 400 | 1.3333 | `--text-supporting-*` | exact |
| smallStrong | 0.75rem | 500 | 1.3333 | `--text-heading-5-*`, `type:smallStrong` | exact |
| tiny | 0.625rem | 500 | 1.4 | `--text-heading-6-*`, `type:tiny` | exact |
| largeData | 1rem | 400 | 1.25 | `type:largeData` | exact |
| mediumData | 0.875rem | 400 | 1.2857 | `--text-code-*`, `type:mediumData` | exact |
| smallData | 0.75rem | 400 | 1.3333 | `type:smallData` | exact |
| actionMedium | 0.875rem | 500 | 1.2857 | `type:actionMedium`, button label | exact |
| actionSmall | 0.75rem | 500 | 1.3333 | `type:actionSmall` | exact |

Notes.

- **Headings 3–6 are extrapolated.** Tecton names two heading levels; the
  library has six. Levels 3–6 continue the ladder with the interface variants
  that sit at those sizes (`large`, `mediumStrong`, `smallStrong`, `tiny`),
  which is what the component screenshots actually use for sub-headings.
- **The scale is not geometric,** so it is written out token by token rather
  than generated from a base and a ratio. Tecton jumps 10 → 12 → 14 → 16 → 20 →
  24 → 32 → 40 → 48; a 1.2 ratio from 14 would give 17, 20, 24, 29, 35, 42.
- **`--font-size-4xs/3xs/2xs`** (6, 7, 8px) have no Tecton equivalent and keep
  their defaults. Nothing in the theme references them.
- **Weights.** Tecton uses 400 and 500 only. `semibold` therefore resolves to
  500, so a component that asks for semibold gets medium; `bold` is set to 600
  so `<strong>` in prose is still distinguishable. Consumer-visible
  consequence: `<Text weight="semibold">` and `<Text weight="medium">` render
  identically.
- **Data variants** get `font-family: var(--font-family-code)` plus
  `font-variant-numeric: tabular-nums`. The foundation page contradicts itself
  here — the section heading says "Figtree with tabular numbers" while the CSS
  it prints lists IBM Plex Mono. The printed CSS was followed, which also
  matches the panels, where every numeric readout is monospace.

---

## 4. Component by component

Design source on the left, Tecton render on the right.

### Button — `screenshots/037_components-button__variant-matrix.png` vs `docs/design/fidelity/dark-buttons.png`

**Close to exact.** All five Tecton emphases exist: `primary`, `secondary`,
`ghost` (= Tecton tertiary), and two custom variants `outlined` and `text-only`.
Enabled, hover, pressed, focus and disabled all match the measured fills,
including the two details that are easy to miss — the near-black *recessed*
disabled fill rather than an opacity drop, and `text-only`'s focus painting a
fill **darker** than the page.

Gaps: no `activated` state (the design's "stuck in the pressed look") — that is
`ToggleButton` with `isPressed`, which is themed to the same fill. `destructive`
has no Tecton source at all; it is painted from the error role so a consumer
reaching for it gets something coherent. The design's `outlined` border is
`#aaa1b2` on the button matrix but `#5a4f62` in the colour foundation ("outlined
Border" vs "outlined Strong border"); **the inventory wins** — the button draws
the strong border.

### TextField — `screenshots/105_components-textfield__variant-matrix.png` vs `docs/design/fidelity/dark-text-input.png`

**Approximated.** The default field is Tecton's *outlined*: transparent, a 1px
graphite rule, near-white value ink, a placeholder two steps down, 4px corners,
the pink focus ring. Error recolours the rule and the message.

Validation is now the design's: a coloured rule and plain coloured helper text,
with no box. `FieldStatus` ships a tinted message surface, which on Tecton's
*transparent* field also bled up into the bottom of the control (the `attached`
message overlaps the field by 6px, which upstream hides behind an opaque input
surface). Turning the fill off on the `field-status` target removes both and
costs no geometry — see §17 of `theme-audit.md`. The `--color-*-muted` washes
themselves are untouched, because `Banner` and `ChatComposer` draw tinted
surfaces from them on purpose.

Gaps: `Filled` and `TextOnly` have no variant axis to hang off, so the theme can
only express one of Tecton's three field appearances (see §5). The dotted bottom
rule on a disabled filled field, the solid-red filled error surface and the
violet-tinted "Enabled + Active" interior are all unreachable.

### Table — `screenshots/102_components-table__variant-matrix.png` vs `docs/design/fidelity/dark-table.png`

**Close to exact** for surfaces: the header is the lightest surface in the
component (`#433d47`), the body is the page colour, the zebra stripe is the
neutral `#323134` band (reached with a `:nth-child(even)` rule, because the
built-in stripe uses the muted surface), the hover fill is `#3a343e`, the footer
is `#28232c`.

Gaps: no built-in selection column, sort affordance or pagination footer — those
are composed by the consumer. The `smallScreen` layout has no equivalent.

### Badge / Chip — `screenshots/024`, `026` (badge), `042` (chip) vs `docs/design/fidelity/dark-badges-and-chips.png`

**Approximated, and deliberately re-mapped.** The library's `Badge` is a
standalone pill, which is Tecton's **Chip**, not Tecton's Badge (an overlay on a
child). The badge variants are therefore painted from the chip matrix: `neutral`
is the dark graphite chip with light ink, the four severities are solid fills
with dark ink, `lime` is added as a custom variant, and the ten hue variants
stay tinted. Radius is a full pill, as the design draws it.

Gaps: Tecton's actual Badge — an overlay anchored to a child's top-right corner,
with a count that caps at "99+" and a `Default` colour that renders bare text
with no bubble — has no equivalent and is a Phase 2 component. Chip's
outlined emphasis has no slot.

### Alert / Banner — `screenshots/008_components-alert__variant-matrix.png` vs `docs/design/fidelity/dark-banners.png`

**Close to exact for the filled emphasis.** Each status paints the Tecton
"Filled background" and re-points the ink tokens inside the banner so the title,
description and icon all render in the dark on-colour ink the design uses. A
fifth status, `neutral`, is added as a custom variant — the design has five
severities, the library ships four.

Gaps: Tecton's *outlined* alert emphasis (transparent fill, 1px severity border,
severity-coloured text) has no axis to hang off. The status glyphs are the
library's filled marks rather than Tecton's outlined ones.

### Checkbox / Radio / Switch — `screenshots/039`, `082`, `092` vs `docs/design/fidelity/dark-selection-controls.png`

**Approximated.** The important structural fact survives: Tecton reads selection
as a **bright chip**, not as the accent. A checked box is near-white `#e3e0e8`
with a dark glyph; a checked radio is a near-white dot; only the switch carries
the violet (`#80708b` on, `#e5e0eb` knob), and the off track is an outline with
no fill — a distinctive low-ink treatment.

All three brighten a step under the pointer, which is what
`design/components/checkbox.md` asks for and what the components already
compute: the theme states the *token* each control mixes its hover out of
rather than the property, so the mix survives. §14 of `theme-audit.md` is the
measurement, and the run before it is why the off switch had no visible knob at
all (track and knob are the same mauve in the design, because one of them is a
1px ring, and the theme was painting the ring's colour as a fill).

`disabled + checked` **is** reachable — `checked+disabled` compiles to
`[data-checked="checked"][data-disabled="disabled"]` — so the design's
"disabled-on drops the violet to neutral grey" is expressed.

Gaps: **indeterminate is not themeable.** The library styles the indeterminate
box exactly like the unchecked one and only swaps the mark, and its
`data-checked="indeterminate"` is not an addressable state — a theme can reach
`checked` and `disabled` and nothing else. Tecton's indeterminate is a *filled*
`#cac5d2` box with a dark dash; Tecton renders an unfilled box with a light
dash.

### Tabs — `screenshots/097_components-tab__state-matrix.png` vs `docs/design/fidelity/dark-tabs.png`

**Approximated.** Rest label `#98939d`, selected label `#f7f6f8`, a near-white
2px indicator — the underline style is right.

Gaps: Tecton's **filled** tab style (a violet-grey `~#6b6076` fill on the active
tab, no separate indicator) lives on the strip, not the tab, and has no variant
axis; the closest thing is `SegmentedControl`, which the theme paints to match.
Vertical orientation has no equivalent. And Tecton's tab focus is a **dark box,
not a pink ring** — the only component in the design that breaks the focus
convention — which cannot be expressed per-component, so tabs focus with the
same ring as everything else. Arguably an improvement; recorded as a difference.

### Progress — `screenshots/079_components-progress__linear-matrix.png` vs `docs/design/fidelity/dark-progress.png`

**Close to exact.** The track is drawn at divider-strong weight (`#6e6873`),
which is what the design shows — a visible channel, not a faint rail — and
`accent` is Tecton's neutral "primary" (`#b8b4bc`), barely above the track,
exactly as the design renders it.

Gaps: Tecton's `secondary` (teal) and `tertiary` (lime) colour roles have no
variant slot; `buffer` (a dotted segment out to `valueBuffer`) does not exist;
determinate *circular* progress with a percentage label has no equivalent at all
— `Spinner` is indeterminate only.

### Avatar — `screenshots/017` vs `docs/design/fidelity/dark-avatar-divider-panel.png`

**Approximated.** Fill `#c2867a` with the dark `#131214` initials, and the three
shapes (circle / rounded / square) map exactly.

Gaps: Tecton's seven accent colours are a per-instance choice with no prop; the
`off` state (neutral fill, greyscale image) has no equivalent; Tecton's sizes
are literal pixels (40/32/24/18) against named sizes of 20/24/36/48, so a
consumer has to pass numbers.

### Divider — `screenshots/049` vs the same render

**Approximated.** `subtle` is `#342f39` and `strong` is `#6e6873`, both exact.
Tecton's third emphasis, **Medium** (`#57515c`), has nowhere to go: the variant
axis is `subtle | strong` and `subtle` is the default, so the base rule never
shows. Medium is reachable only through `--color-border-emphasized` in a custom
style.

### Panel / Card — `design/patterns/panels.md` vs the same render

**Close to exact.** A 1px subtle rule, 16px padding, 8px radius, no shadow, and
the elevated (darker) surface — Tecton's inverted elevation survives because it
is expressed entirely in tokens.

### Link — `screenshots/069`

**Approximated.** Tecton links carry **no colour**: the only affordance is the
underline. The theme re-points `--color-text-accent` on the default link to
`--color-text-primary` to match, which is what reaches the rule the compiler
emits for a colour prop (a `color` declaration here is overwritten by it). The
focus treatment (a tight rounded-rect ring) is close to the library's ring.

Gap: that emitted rule also flattens `Link`'s own hover `color-mix()`, which no
theme can restore. It costs nothing — `design/components/link.md` gives the
hovered link, in both underline policies, as "text unchanged".

### Menu, MenuItem, List, Item — `screenshots/075`, `072`, `077`

**Approximated.** Hover and selected fills map to `#3a343e` / `#4e4853`, and the
popover surface is the darker elevated colour with a 1px rule and no shadow,
which matches the design's "menus are darker than the page".

Gaps: Tecton signals selection on a menu item by *type weight and brightness at
the same fill as hover*, which is not an addressable state; Tecton's list rows
are square-cornered where the rest of the system is 4px; Tecton's list focus is
a 1px pink border on the row rather than an offset ring.

### Slider — `screenshots/089`

**Approximated.** The rail takes `--color-track` and the thumb takes the bright
chip colour, consistent with the other selection controls. Tecton's two sizes
and its teal/lime colour roles have no props.

### Tree view — `screenshots/112`, `113`

**Approximated.** Selected rows take `#4e4853`. Tecton's per-row `hidden`,
`disabled` and **right-click** visual states, its leading colour tag, suffix
chip and trailing kebab are all structural and out of scope for a theme.

### Toggle button / SegmentedControl — `screenshots/110`, `107`

**Approximated.** `isPressed` takes Tecton's "activated" fill `#4e4853` with the
brighter `#cac5d2` glyph, and stays activated under the pointer (two further
steps of the same graphite ramp, since the matrix documents no hover or pressed
column). The key is `isPressed:true`, not `isPressed`: `ToggleButton` reflects
the state as `data-is-pressed="true"`, and the bare key compiled to a selector
that matched nothing, so for one release the activated toggle painted nothing at
all — see §13 of `theme-audit.md`.

Tecton has four sizes against three, and no variant axis at all on the toggle.

### Icon button, FAB, Button group — `screenshots/060`, `053`, `032`

**Inherited.** Icon buttons share the `button` target, so all five emphases
(including the two custom variants) apply to them automatically. FAB is an
`elevation` prop rather than a component; the shadow tokens are Tecton's flat
ones, so a FAB reads flatter than the design. Tecton's circular-vs-rounded-square
icon-button shape has no prop.

### Accordion, Breadcrumbs, Autocomplete, Select — `screenshots/004`, `030`, `012`, `086`

**Inherited only.** These take the palette, radius and typography but none of
them was given a dedicated override this phase; the Select/Autocomplete field
colours come from the shared input targets. Their structural gaps (accordion
secondary text and header actions, breadcrumb overflow collapse, the tokenised
autocomplete) are Phase 2 work and are listed in `design/components/README.md`.

---

## 5. Deviations — where the library's grain won

Each of these is a place where Tecton's design and the library's model disagree
and the library's model was followed, because the alternative was a mechanism
outside what a theme is allowed to do.

1. **Three field appearances became one.**
   *Tecton:* `Outlined`, `Filled` and `TextOnly` fields, each with seven states,
   sharing a vocabulary with Select and Autocomplete.
   *Here:* `TextInput` has no variant axis, so only the outlined appearance is
   themed. The filled and text-only colours exist as theme-local tokens
   (`--tecton-color-input-filled-*`, `--tecton-color-input-text-only-rule`) but
   nothing consumes them yet.
   *Consumer sees:* one field appearance. Phase 2 should expose the other two as
   StyleX presets on the Tecton `TextField` — a sanctioned mechanism that does
   not need a variant axis. A custom `variant:` on the input target was
   rejected because `TextInput` has no such prop, so the CSS would never match.

2. **`--color-*-muted` is a wash, not Tecton's "Muted".**
   The components composite these tokens *behind* status text (validation
   messages, tinted surfaces). Tecton's "Muted" step is a solid mid-tone; used
   directly it turned the validation message into a solid dark-red slab.
   *Here:* the portable tokens carry a 25 % alpha step of the same family, and
   the solid values live on `--tecton-color-{success,warning,error,info}-muted`.
   *Consumer sees:* tinted status surfaces rather than solid ones, which is what
   the components were drawn for — except on a field's status message, where
   Tecton draws no box at all and the `field-status` target turns the fill off
   directly.

3. **Hover and pressed tints are switched off on the button family only.**
   The base components composite `--color-overlay-hover` on top of whatever
   background a button has. The design's button matrix names a fill for enabled,
   hover, pressed, focus and disabled on all five emphases, so the two stacked:
   a `text-only` button grew a background it should never have.
   *Here:* the `button` target sets both overlay tints to `transparent` and
   paints the Tecton fill directly. Everywhere else — rows, list and menu items,
   table rows — the Tecton fill goes *into* `--color-overlay-hover` instead, so
   the component keeps deciding when a hover happens (§5 of `theme-audit.md`).
   The two washes themselves are 5 % and 10 %, not 10 % and 20 %: at the heavier
   weights a pressed row lifted far enough that the subtle icon on it fell to
   2.44:1 (§16).
   *Consumer sees:* exactly the design's fills on buttons, and the component's
   own hover behaviour everywhere else.

4. **Indeterminate is not addressable.** (See Checkbox above.) The box stays
   unfilled with a light dash instead of a filled light box with a dark dash.

5. **Two-axis states are not addressable.** `disabled + checked` on a switch,
   `hovered + selected` on a menu item, `enabled + active` on a field: the style
   key is one axis, so these render as whichever single state the component
   reports.

6. **Tab focus is a ring, not a dark box.** The design gives Tab the only
   non-pink focus treatment in the system. Focus is a system-wide token, so the
   inconsistency was not reproduced.

7. **Custom `Text` types get CSS but no types.** The theme declares eight
   custom `Text` types and the compiler emits their CSS
   (`.astryx-text[data-type="mediumData"]` and friends), but not their TypeScript
   augmentation: its augmentation lookup expects a `<Component><Prop>Map`
   interface, and the extension point for text types is `CustomTextTypes` on the
   theme module instead. The four custom *variants* (button ×2, badge, banner)
   do get augmentations.
   *Consumer sees:* `<Text type="mediumData">` renders correctly but does not
   type-check until Phase 2's Tecton `Text` wrapper owns the variant names. The
   preview page declares the augmentation locally to demonstrate the shape.

8. **Unknown state keys do not fail the build.** An unknown *target* is caught,
   but a made-up state key (we tried `indeterminate`) compiles happily into a
   selector that can never match. This is worth knowing when reading a theme:
   the fact that it builds does not prove every rule lands.

9. **Radius names drift.** Tecton's 12px and 16px steps are carried by
   `--radius-chat` and `--radius-page`, whose names mean something else. Nothing
   in Tecton is 28px, so no value is lost, but a consumer reading token names
   will find `page` where they expect `2xl`. The `tecton.radius` map re-labels
   them.

10. **The elevation story is inverted and mostly unused.** Tecton panels are
    *darker* than the page and carry a 1px rule instead of a shadow. Tokens
    express that; a component that hard-codes an elevation prop still draws a
    (soft) shadow.

---

## 6. Open questions

1. **Icons.** Tecton's gallery is **131 bespoke glyphs**, about 23 of them
   subsurface/energy-domain shapes — `DrillBitIcon`, `SeismicIcon`,
   `HorizonIcon`, `StrataIcon`, `WellPickIcon`, `VelocityModelIcon` and so on —
   with no equivalent in any general icon library. Tecton also has outlined and
   filled variants at 16/20/24px, and one icon (`StrataIcon`) that is rendered in
   red rather than inheriting colour. The theme currently keeps the upstream
   default semantic set plus three generic marks drawn inline, because adding an
   icon library would be a new consumer-facing dependency. **How should the icon
   set be shipped** — as SVG source exported from Figma into
   `packages/react/src/theme/icons/`, or as a separate `@tecton/icons` package?
   Either way the artwork has to come from somewhere; nothing in this repository
   contains it.

2. **Light mode.** Every light value in the theme is *derived*, not designed —
   there is no light-mode artefact anywhere in the source. `docs/design/light-mode.md`
   lists six places where the derivation is visibly weak. **Is derived light mode
   acceptable as a shipped feature**, or should `TectonProvider` reject
   `mode="light"` / `mode="system"` until a real light palette exists?

3. **The filled and text-only field appearances.** The plan is to expose them as
   StyleX presets on Tecton's own `TextField` in Phase 2 (an `appearance` prop
   that applies a Tecton-owned style object), rather than as theme variants.
   **Is an `appearance` prop the right shape**, or should the outlined field
   simply be the only one Tecton ships? The design uses all three, and the same
   three recur on Select and Autocomplete.

4. **`semibold` resolves to `medium`.** Tecton's type foundation has two
   weights. A component that asks for `semibold` gets 500. **Should Tecton
   suppress the heavier weights from its public surface** (so a consumer cannot
   ask for something that does not exist), or keep them as aliases?

5. **Tecton's own Badge.** The upstream `Badge` was mapped to Tecton's *Chip*,
   because that is what it is. Tecton's Badge — an overlay on a child, count
   capped at "99+", a `Default` colour that draws bare text with no bubble — is
   unbuilt. **Should Phase 2 build it**, and if so on `Indicator` (the overlay
   primitive, which takes a state rather than a count) or from scratch?

6. **The `activated` state.** Tecton gives Button, IconButton, Tab, List and
   MenuItem a persistent "activated" look distinct from pressed. On a plain
   button that means `ToggleButton` with `isPressed`, which changes the
   component. **Should Tecton's `Button` grow an `isActive` prop** that switches
   the underlying component, or should consumers reach for a toggle explicitly?
