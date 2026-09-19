# Slider

## Sources
- `089_components-slider__variant-matrix.png`
(Also used heavily in the panel compositions — see `design/patterns/panels.md`.)

## Anatomy
1. **Track** — a full-width horizontal bar with rounded ends; the portion up to the value is the accent colour, the remainder a mid grey.
2. **Thumb** — a filled circle in the accent colour, carrying a **soft drop shadow** beneath it (the second component after FAB with visible elevation).
3. **Marks** (optional) — small tick dots drawn *on* the track at regular intervals; they read as slightly darker/lighter pips inside the bar rather than ticks below it.
4. **Range** — two thumbs with the accent filling the span between them; the track outside the span is grey on both sides.
5. **End labels** — "0" and "12" beneath the track at its left and right ends, in the muted caption style. No live-value bubble/tooltip is shown.

## Variants
**Colour** (the three page section headings): **Primary, Secondary, Tertiary** — the same trio as Progress, with the same palette.
| Colour | Filled track / thumb |
|---|---|
| Primary | neutral light grey `#98939d` |
| Secondary | teal `#29a6a6` |
| Tertiary | lime/olive `#84a138` |

**Type** (the column captions, lowercase on the page): `continuous`, `marks`, `range`, plus a fourth column captioned `Disabled`.

## Sizes
Two, as sub-headings under each colour: **Medium** and **Small**.
| | Medium | Small |
|---|---|---|
| Track thickness | **6px** | **~2–3px** |
| Thumb diameter | **20px** | **12px** |
The small variant is dramatically lighter — it is not a proportional scale, the track thins much more than the thumb.

## States
The only state column is **Disabled**: the accent is discarded entirely and both track and thumb render in neutral grey (`~#57515c` track, `~#6e6873` thumb), with the end labels dimmed. All three colours look identical when disabled.

No hover, focus or pressed states are shown anywhere for Slider.

## Shape and spacing
- Track has fully rounded caps.
- Thumb is a plain circle with no ring or border; its shadow is a soft ~4–6px blur below it.
- End labels sit ~10px below the track, left- and right-aligned to the track ends.
- Marks are evenly spaced pips within the track.

## Typography
End labels ~12px regular, muted grey. Section headings "Primary"/"Secondary"/"Tertiary" are ~18px medium white; "Medium"/"Small" and the type captions are small muted text.

## Colour notes
- Unfilled track `#66636a` — fairly bright, so an empty slider still reads clearly.
- Accent colours are the 560 step of each ramp: graphite `#98939d`, azure `#29a6a6`, lime `#84a138`.

## Notable details
- No prose captions.
- **No focus state is documented** — which is a gap given that the rest of the system has a strong hot-pink focus treatment.
- Tick marks are drawn *inside* the track rather than below it, which makes them subtle at Small size (nearly invisible).
- Slider and Progress share the exact Primary/Secondary/Tertiary colour vocabulary, so a re-implementation should treat them as one colour scale.
