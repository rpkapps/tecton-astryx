# IconButton

## Sources
- `060_components-iconbutton__activated-states.png`
- `064_components-iconbutton__variant-matrix.png`
- `065_components-iconbutton__variants.png`

## Anatomy
1. **Icon** — a single glyph, centred. The matrix uses the outline "cube" icon; story 060 uses the edit/pencil-in-square icon.
2. **Container** — a circle or a rounded square carrying the fill/border, sized so the icon has even padding on all sides.

No label, no badge slot.

## Variants
Two axes.

**Emphasis** (row labels, identical vocabulary to Button): `primary`, `secondary`, `tertiary`, `outlined`, `textOnly`.
| Emphasis | Container |
|---|---|
| primary | solid violet `#5d4d68` |
| secondary | solid graphite `#3a343e` |
| tertiary | no container at all when enabled; gains a fill on hover/activated |
| outlined | 1px light mauve ring/border, no fill |
| textOnly | bare icon, no container in any state except focus |

**Shape** — the 8 unlabelled columns of the matrix are two blocks of four: **columns 1–4 are circular**, **columns 5–8 are rounded-square** (radius ≈ 4px on a 32px box). So circle vs rounded-square is a shape prop.

## Sizes
Two, given as the page's section labels: **medium** and **small**.
- medium: **32px** container (64 device px), icon ~20px.
- small: **28px** container (56 device px), icon ~16px.
These match Button's md/sm heights exactly.

## States
The matrix gives **no column headers**. Reading the fills across a shape block (primary row, medium):
| Column | Fill | Reading |
|---|---|---|
| 1 / 5 | `#5d4d68` | Enabled |
| 2 / 6 | `#5d4d68` (identical fill; only the icon looks a shade brighter) | Hover **or** Focus — see note |
| 3 / 7 | `#111012` near-black, dim icon | Disabled (the same recessed near-black Button uses) |
| 4 / 8 | `#80708b` | Activated |

Secondary follows the same pattern: `#3a343e` / `#3a343e` / near-black / `#5a4f62`.

**Note (uncertainty):** exactly one cell in the whole page — *small / textOnly, column 6* — renders a hot-pink `#ff52a8` focus ring around a rounded-square container. No other cell has one. That suggests column 2/6 is the **Focus** column and the story only painted the ring in that single cell; with no headers this cannot be settled from the screenshot alone.

Story 060 shows five **activated** icon buttons side by side (primary, secondary, tertiary, outlined, textOnly, all circular): the activated treatment gives every variant a visible container except textOnly, which merely brightens its icon.

## Shape and spacing
- Circle: radius 50%. Rounded square: **4px** radius, same as Button.
- Icon is centred with ~6px of padding at medium.
- Outlined border is 1px; in the activated state the border reads noticeably brighter/whiter.

## Typography
Not applicable.

## Colour notes
- Fills reuse the Button ladder exactly: `#5d4d68` → `#80708b` (primary enabled → activated), `#3a343e` → `#5a4f62` (secondary), `#111012` for disabled.
- Icon ink follows the emphasis: brightest on primary, dimmest on textOnly.

## Notable details
- Captions on the pages are only the emphasis names (`primary`, `secondary`, `tertiary`, `outlined`, `textOnly`) and the size labels (`medium`, `small`). No prose.
- **The rounded-square shape is unusual for an icon button** — most systems only offer the circle — and Tecton treats it as a first-class option with equal state coverage.
- The single stray focus ring is worth double-checking against the live Storybook.
