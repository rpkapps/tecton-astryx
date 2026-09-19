# Divider

## Sources
- `047_components-divider__horizontal-all-emphases.png`
- `049_components-divider__variant-matrix.png`
- `050_components-divider__vertical-all-emphases.png`

## Anatomy
A single hairline rule. No label, no inset markers, no content slot.

## Variants
Two axes, both named on the pages.

**Orientation** (section headings on 049, spelled in small caps as `HORIZONTAL` and `VERTICAL`; row labels read `Horizontal` and `Vertical`):
- **Horizontal** — a full-width rule separating stacked content ("Section A" above, "Section B" below).
- **Vertical** — a full-height rule separating side-by-side content ("Left" | "Right").

**Emphasis** (column headings on 049; section headings on 047/050): **Subtle, Medium, Strong**.
| Emphasis | Measured colour | Reads as |
|---|---|---|
| Subtle | `#342f39` | barely visible against the surface; a whisper |
| Medium | `#57515c` | a clear but quiet rule |
| Strong | `#6e6873` | an obvious structural rule |

## Sizes
No size prop. Thickness is **1px** (2 device px at 2×) for all three emphases — emphasis changes colour only, **not** thickness.

## States
None. Divider is purely decorative.

## Shape and spacing
- Square ends, no radius.
- In the 047 demo the horizontal rule spans the full inner width of the surrounding card, edge to edge of the content column, with roughly 8px of space above and below.
- In the 050 demo the vertical rule runs the full height of the row's content, with ~16px of space either side of the text.
- The rule sits flush; there is no margin baked in that is visible from these captures beyond the demo's own layout.

## Typography
Not applicable. Page captions ("Subtle", "Medium", "Strong", "HORIZONTAL", "VERTICAL", "Horizontal", "Vertical") are the small muted style; the small-caps section headings on 049 are letter-spaced.

## Colour notes
- Host card surfaces in these demos are a barely-lighter block on the `#131214` page — the demo card and the page background are extremely close, so the rules are the only visible structure.
- The three emphases sit on the graphite ramp: `graphite-120 #342f39`, `graphite-220 #57515c`, `graphite-310 #6e6873`.

## Notable details
- No prose captions.
- **Emphasis is colour-only**: all three are 1px. If Astryx's Divider only exposes a thickness/size prop, the three Tecton emphases have to be mapped to colour tokens instead.
- The 049 matrix renders each cell inside a small dark demo card so the rule has something to divide; the card is not part of the component.
