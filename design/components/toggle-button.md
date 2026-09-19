# ToggleButton

## Sources
- `110_components-toggle-button__state-matrix.png`
- `111_components-toggle-button__variants.png`

## Anatomy
A square button containing a **single icon** and nothing else. The demos use the outline "cube" glyph (110) and view-mode icons — grid, list, split-panel, table — on 111. No label slot.

## Variants
Row labels on 111, verbatim: `primary`, `secondary`, `tertiary`, `outlined`. Each row shows a **3-segment group** and a **standalone toggle button** side by side.
| Variant | Unselected segment | Selected segment | Standalone |
|---|---|---|---|
| primary | violet `~#5d4d68` | lighter violet `~#80708b` | lighter violet fill |
| secondary | dark graphite `~#3a343e` | lighter mauve `~#5a4f62` | mauve fill |
| tertiary | **no fill** (page shows through) | a mauve fill `~#433d47` | dark fill |
| outlined | no fill, 1px light border around the whole group | a lighter fill inside the border | bordered square with a fill |

The state matrix (110) uses the outlined/tertiary look as its default rendering.

## Sizes
Four, named as row labels on 110 and 107: **large, medium, small, extraSmall**. Measured outer squares:
| Size | Measured |
|---|---|
| large | ≈ **56–58px** |
| medium | ≈ **46px** |
| small | ≈ **34px** |
| extraSmall | ≈ **28px** |
The icon scales with the box (roughly 24 / 20 / 16 / 14px).

**ToggleButton has the widest size scale of any component in the set** — four steps where everything else has two or three.

## States
Column captions on 110, verbatim: **Enabled, Activated, Disabled**.
| State | Appearance |
|---|---|
| Enabled | 1px border `#342f39`, no fill, icon `~#9a91a2` |
| Activated | a filled mauve square `~#433d47`–`#4e4853` with a brighter icon `~#cbc4d5`; the border disappears into the fill |
| Disabled | a **near-black recessed fill** with a very dim icon — the same "carved out" disabled treatment as Button |

No hover, pressed or focus states are shown.

## Shape and spacing
- Square with **~4px corner radius** (matching Button).
- The icon is centred with even padding.
- In a group the segments butt together with a 1px separator and only the outer corners are rounded.

## Typography
Not applicable.

## Colour notes
- Enabled border `#342f39`; icon `#9a91a2`.
- Activated fill `~#433d47`, icon `~#cbc4d5`.
- Variant fills reuse the Button ladder (`#5d4d68` / `#3a343e` / none / bordered).

## Notable details
- Page headings, verbatim: "Toggle Button", "Toggle Button Variants".
- **No focus state is documented** for ToggleButton, despite it being a keyboard-reachable control.
- The gallery page (`059`) uses ToggleButtonGroups for its own "Variant" and "Size" controls, so the component doubles as the system's segmented control for icon-only choices.
