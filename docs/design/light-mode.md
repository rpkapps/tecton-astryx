# Light mode

Tecton's design source is a dark-mode rendering. Every colour on the foundation
page, every component story and every panel screenshot is dark; there is no
light artefact anywhere in `screenshots/`. The theme still has to answer in
light mode, because the colour scheme is an operating-system preference and
`TectonProvider` accepts `mode="light"`.

So: **dark is transcribed, light is derived.** This file is the derivation rule,
the exceptions to it, and the places where it is visibly weak.

## The rule

`tokens/tecton.tokens.json` publishes every colour family twice — once as
`onDark` and once as `onLight` — on the same stop ladder (50, 100, 105, 110,
115, 120, 130, 140, 160, 190, 220, 260, 310, 370, 460, 560, 680, 830, 1000,
1170, 1300, 1440, 1570). The two ramps run in opposite directions:

| | stop 50 | stop 1570 |
| --- | --- | --- |
| `onDark` | darkest | lightest |
| `onLight` | lightest | darkest |

A stop therefore names a **role**, not a lightness: `graphite.680` is "secondary
text" on either surface. The derivation follows from that:

> **Same family, same stop, the other ramp.**
> `graphite.onDark.680` (`#a7a2ac`) → `graphite.onLight.680` (`#604e6e`).

Three shapes need a footnote.

1. **The neutral ramp.** `gray` publishes its dark side under a `contrasts`
   sub-ramp and its light side as a plain ramp, so the pairing drops that
   segment: `gray.onDark.contrasts.N ↔ gray.onLight.N`. The transcription left
   36 rows without a light value for exactly this reason; the rule fills them.
2. **Alpha ladders.** Each family publishes its `transparent` ladder on one stop
   per surface, and the two surfaces do not always agree on which stop (yellow
   is `onDark.1000` but `onLight.160`). The ladder step — 25 %, 30 % — is the
   address, and the family's own choice of stop is honoured on each side.
3. **Shades.** `shades.white`, `shades.black` and their alpha ladders have no
   light/dark pair at all. Each role that uses one decides individually; the
   table below lists every such decision.

`packages/react/src/theme/semantic.ts` is where the rule is applied, one role at
a time, and `packages/react/src/theme/__tests__/tectonTheme.test.ts`
re-implements it from `tokens/tecton.tokens.json` and checks the theme against
it — so the theme cannot drift from the rule without a test failing.

## Shade decisions, role by role

| Role | Dark | Light | Decision |
| --- | --- | --- | --- |
| `--color-overlay` (modal scrim) | black 50 % | black 50 % | **Kept.** A scrim darkens whatever is behind it in either scheme. |
| `--color-overlay-hover` | white 10 % | black 10 % | **Inverted.** The tint has to move the surface *away* from its own lightness. |
| `--color-overlay-pressed` | white 20 % | black 20 % | **Inverted**, same reason. |
| `--color-tint-hover` | white | black | **Inverted** — this token exists to be mixed into a surface. |
| `--color-shadow` | black 50 % | black 15 % | **Kept in hue, reduced in weight.** A shadow is black on both, but a light page needs far less of it. |
| `--color-on-dark` | `#f6f5f8` | `#f6f5f8` | **Fixed.** "Ink that reads on a dark surface" does not change with the page. |
| `--color-on-light` | `#131214` | `#131214` | **Fixed**, same reason. |
| `--tecton-color-top-nav-background` | `#000000` | `#000000` | **Kept.** The Tecton top nav is a solid black band in the design, and nothing in the source suggests it becomes white. |
| `--tecton-color-top-nav-text` | white 50 % | white 50 % | **Kept**, because it sits on that black band, not on the page. |
| Button `textOnly` focus fill | black 50 % | black 5 % | **Exception.** See below. |
| Disabled filled background | black 40 % | black 10 % | **Exception.** See below. |

## Two exceptions

Tecton expresses two states as *a fill darker than the page*:

- the disabled filled button — "a near-black recessed fill `#111012`, darker
  than the page background … a distinctive 'carved out' look rather than a
  simple opacity drop";
- the `textOnly` focus state — "a `#0e0e0f` fill, darker than the page".

Both are written in the source as a black wash (40 % and 50 %), which is exactly
right over `#1d1c1f`. Over `#f6f4f7` the same wash is a slab of mid-grey: a
disabled button would read as *more* prominent than an enabled one, and a
focused text button would turn into a dark chip. Light mode therefore takes the
same idea at a tenth of the weight — 10 % and 5 % — which keeps "recessed"
without keeping "dark". Both are marked in `semantic.ts`.

## One resolved ambiguity

`#f7f6f8` — the value ink of every field — is carried by three ramps at stop
1570 (`mauve`, `graphite`, `violet`). The dark side is the same colour whichever
one you pick; only the light side differs, and only slightly (`#22162f`,
`#21172a`, `#231430`). Tecton's fields are drawn from the graphite ramp
everywhere else, so graphite is the one the light value is derived through.

Two other hexes are ambiguous in the transcription and neither reaches the
theme's light side: `#fbbc3b` (warning, `yellow.1000` vs `yellow.core.100`) is
only used as an alpha wash, and `#b0d54e` (lime, `lime.1000` vs
`lime.core.100`) is read as the ramp stop, matching its role as the lime accent
*text*.

## Where light mode is weak

The rule is arithmetically sound and visually approximate. These are the places
to look at first if light mode is ever promoted from "best effort" to
"supported".

1. **Disabled controls lose contrast.** The light-mode disabled label
   (`#ada3b2`) on the 10 % black wash is around 2.2:1. Dark mode has the same
   problem (`#545356` on `#111012`), so this is inherited from the design rather
   than introduced by the derivation — but it is more noticeable on a light
   page. See `docs/design/fidelity/light-buttons.png`.
2. **The default border is invisible.** `--color-border-emphasized` reaches
   2.20:1 against the body in light mode (2.21:1 in dark). Tecton's "Divider
   medium" is a quiet rule by design; use `divider strong`
   (`--tecton-color-divider-strong`, 3.11:1) anywhere a separator has to be
   seen. A test pins both numbers.
3. **Elevation inverts.** Tecton's panels are *darker* than the page, which is
   what `--color-background-surface` encodes. In light mode the derived surface
   (`#fafafb`) is *lighter* than the body (`#f6f4f7`) — the ramp flips the
   relationship, which happens to match the usual light-mode convention but is
   not what the design says. Nothing in the source says what a light Tecton
   panel should be.
4. **The primary action is pale.** `#b89dc8` against `#f6f4f7` is 2.2:1, the
   same ratio as dark mode. The *label* on it clears AA (5.9:1), so this is a
   boundary-contrast question rather than a readability one, but a light-mode
   primary button is much softer than a dark-mode one.
5. **Status fills flip weight.** The `onLight` status ramps are saturated and
   dark (`error` is `#d22f11`), so a light-mode banner is a much louder object
   than its dark-mode counterpart. Compare
   `docs/design/fidelity/dark-banners.png` with `light-banners.png`.
6. **The scrim is heavy.** `--color-overlay` stays at 50 % black in light mode,
   which is darker than most light-mode scrims. Kept for consistency with the
   dark value; worth revisiting with a real light-mode design.

None of the six is a bug in the rule. They are all the same fact: a palette
authored for one surface, read on the other.
