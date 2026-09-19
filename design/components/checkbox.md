# Checkbox

## Sources
- `039_components-checkbox__variant-matrix.png`

## Anatomy
Only the control itself is shown (no label slot on this page — labels appear on the List and Radio stories).
1. **Box** — a small rounded square, ~16px at Medium.
2. **Glyph** — none (unchecked), a horizontal dash (indeterminate), or a check mark (checked). The glyph is drawn **dark on a light filled box**.
3. **Hover/press surface** — a larger rounded-square "halo" (~24px at Medium) that appears behind the box on hover, press and focus; it is a mauve-grey fill, not a circle.

## Variants
The page's three section headings are the **value** states, each underlined on the page: **Unchecked**, **Indeterminate**, **Checked**. There is no visual-style variant (no outlined/filled prop).

| Value | Box | Glyph |
|---|---|---|
| Unchecked | transparent, 1px light border `~#bab3c0` | none |
| Indeterminate | **filled light lilac-grey** `~#cac5d2` | dark horizontal dash, ~55% of box width |
| Checked | **filled near-white** `~#e3e0e8` | dark check mark |

## Sizes
Two, named in the row labels: **Medium** and **Small**.
- Medium: box ≈ **16px** (30 device px at 2×); hover halo ≈ 24px; focus ring bounds ≈ 28px.
- Small: box ≈ **12px** (24 device px); halo and ring scale down proportionally.

## States
Column headers: **Enabled, Hovered, Focused, Pressed, Disabled** (five columns × three value sections × two sizes).

| State | What changes |
|---|---|
| Enabled | box only, no surrounding surface |
| Hovered | a **rounded-square halo** `#3a343e` appears behind the box (≈24px at Medium, ~6px radius); the box border/fill brightens a step (`#bab3c0` → `#cac5d2`) |
| Focused | the hover halo **plus a 1px hot-pink `#ff52a8` ring** drawn ~2px outside the halo, following the halo's rounded-square shape |
| Pressed | same halo as hover but a touch lighter/denser; box unchanged from hover |
| Disabled | no halo; unchecked border drops to `~#4b4a4d`; checked/indeterminate box fill drops to `~#444346` with an even darker glyph — it reads as a flat, low-contrast grey chip |

## Shape and spacing
- Box corner radius ~2px (subtly rounded, not sharp).
- Hover halo radius ~6px, i.e. a rounded square about 1.5× the box, centred on it.
- Focus ring offset ~2px outside the halo, thickness ~1px.
- No label/gap information on this page.

## Typography
Not applicable (no label rendered). Page section headings ("Unchecked", "Indeterminate", "Checked") are a medium-weight ~16px heading with a thin underline rule beneath them; column and row labels are small muted text.

## Colour notes
- Page background `#1d1c1f`.
- Unchecked border `#bab3c0`; hover brightens to `#cac5d2`.
- Checked fill `#e3e0e8` (mauve-1300 range); indeterminate fill slightly darker, `~#cac5d2`.
- Glyph colour is the near-black page ink, not pure black.
- Hover/press halo `#3a343e`; focus ring `#ff52a8`.

## Notable details
- Page heading, verbatim: "Checkbox Variants". No prose captions.
- **The selected states are light-filled with a dark glyph** — there is no accent/brand colour on a checked box at all; the system reads selection as "bright chip".
- The hover affordance is a **rounded square**, not the circular ripple common in Material-derived systems.
- Indeterminate is a first-class value with its own section, not a modifier of checked.
