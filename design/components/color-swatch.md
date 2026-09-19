# ColorSwatch

## Sources
- `046_components-color-swatch__variant-matrix.png`

## Anatomy
1. **Swatch** — a small rounded square filled with the colour being shown (the demo uses a saffron/tan `#cb8553`).
2. **Selection ring** (when selected) — a 1px **lime/chartreuse** ring (`#b0d54e`) drawn around the swatch with a dark gap between ring and fill.
3. **Caption** — the demo's own label under each card ("inherited default", "inherited selected", "declared default", "declared selected"); this is story scaffolding, not part of the component.

Each example sits inside a 1px-bordered demo card on the page.

## Variants
The four cards are captioned, verbatim: `inherited default`, `inherited selected`, `declared default`, `declared selected`. Two axes:
- **Size source**: `inherited` (the swatch takes its size from context — rendered small, ~6px) vs `declared` (an explicit size — rendered ~12px).
- **Selection**: `default` (no ring) vs `selected` (lime ring).

## Sizes
Measured:
| Card | Fill size | Overall footprint |
|---|---|---|
| inherited default | ~6px | 6px |
| inherited selected | ~7px | ~12px (ring outer) |
| declared default | ~12px | 12px |
| declared selected | ~8–9px | ~12px (ring outer) |

Observation: the **selected ring's outer size is the same 12px in both cases**, so on the larger (declared) swatch the coloured fill appears to shrink to make room for the ring, while on the small (inherited) swatch the ring is added outside with a visible gap. (Worth verifying against source; from the pixels alone this is what happens.)

## States
Only **default** and **selected**. No hover, focus or disabled.

## Shape and spacing
- Rounded square, radius ~2px at 6px and ~3px at 12px — proportionally quite round, close to a squircle.
- Ring thickness 1px; gap between ring and fill ~1–1.5px.

## Typography
Not applicable (the captions belong to the story page).

## Colour notes
- Demo swatch fill `#cb8553` (saffron-560).
- Selection ring `#b0d54e` (lime-1000) — a **lime green**, not the hot pink used for focus elsewhere. This is the only place in the system where lime appears as an interaction colour.
- Page and demo-card interior are both `#131214`; the cards are defined by a 1px border only.

## Notable details
- No prose captions beyond the four card labels.
- The **selection indicator is lime, not the system's hot-pink focus colour** — selection and focus are deliberately different signals here.
- This is the smallest component in the set; it is essentially a token preview dot used in colour pickers.
