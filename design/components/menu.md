# Menu

## Sources
- `077_components-menu__state-matrix.png`

## Anatomy
1. **Menu surface** — a rounded panel with a 1px border, filled **darker than the page** (`#131214` on a `#1d1c1f` page). It reads as a recessed well rather than a raised popup — there is no shadow.
2. **Menu items** — stacked rows inside the surface. The demo shows two: "Menu item" and "Secondary", each with a leading outline "open-in-new" icon.
3. Internal padding of ~6px around the item stack; no dividers between items in these demos.

(The same popup surface appears attached beneath an Autocomplete field in story 012, where its rows also carry leading icons.)

## Variants
No style variants shown. The demo uses two items where the first is the one exercising the state.

## Sizes
Two, as section headings: **Medium** and **Small**.
- Medium: item rows ≈ 34px; panel ≈ 86px tall for two items.
- Small: item rows ≈ 30px; panel ≈ 78px tall for two items.

## States
Column labels, verbatim: **Enabled, Hovered, Selected, Disabled**. The state applies to the *first* item; the second item ("Secondary") stays in its resting look in every column — except in the Disabled column, where the whole menu (both items) dims.

| State | First item | Panel |
|---|---|---|
| Enabled | no fill | normal |
| Hovered | `#3a343e` fill across the item | normal |
| Selected | `#3a343e` fill and a **brighter, heavier label** | normal |
| Disabled | no fill; icon and label dim to `~#4b4a4d` | the second item dims too, so Disabled looks like a whole-menu state |

No focus state is shown.

## Shape and spacing
- Panel radius ~4px; 1px border `~#342f39`.
- Item fill radius ~2px, inset a few px from the panel's inner edge.
- Vertical gap between items ~2px.

## Typography
Item labels ~14px regular (Medium) / ~13px (Small); the selected item's label is a weight step heavier.

## Colour notes
- Panel surface `#131214` — **darker than the page background**, the opposite of the usual "menus float above" convention.
- Panel border `#342f39`.
- Item hover/selected fill `#3a343e`.

## Notable details
- Page headings, verbatim: "Medium", "Small"; column captions "Enabled", "Hovered", "Selected", "Disabled".
- **The menu surface is darker than the page and has no shadow** — elevation is expressed by recession + border, not by lift. This matters when re-implementing on a library whose menus assume an elevated, lighter surface.
- The Disabled column dims every item, suggesting disabled is a property of the Menu as well as of individual items.
