# MenuItem

## Sources
- `075_components-menu-item__state-matrix.png`

## Anatomy
1. **Leading icon** — outline "open-in-new / external link" glyph, ~18px, at the left of the row.
2. **Label** — "Menu Item".
3. **Trailing keyboard shortcut** — "Cmd+O", right aligned, in a dimmer colour.

There is no checkmark, submenu chevron or trailing-icon slot in these captures.

## Variants
No style variants. Only size and state.

## Sizes
Two, as the page's section headings: **Medium** and **Small**.
- Medium row ≈ **34px** tall.
- Small row ≈ **28px** tall, with a slightly smaller icon and label.

## States
Column labels, verbatim: **Enabled, Hovered, Selected, Disabled**. (Note: no Focused and no Pressed column — different from List and Accordion.)

| State | Appearance |
|---|---|
| Enabled | no fill; label near-white, shortcut dimmer |
| Hovered | filled `#3a343e` across the full row width |
| Selected | the **same** `#3a343e` fill, but the label renders brighter/heavier — selection is signalled by **type weight and brightness, not by fill** |
| Disabled | no fill; icon, label and shortcut all drop to `~#4b4a4d` |

## Shape and spacing
- The row fill is a rectangle with a **small radius (~2px)** spanning the item's full width.
- Icon at ~14px from the left, ~12px gap before the label.
- The shortcut is right-aligned with ~12px of trailing padding.

## Typography
Label ~14px regular (Medium) / ~13px (Small); the Selected state's label appears one weight step heavier. Shortcut text is the same size, lower contrast.

## Colour notes
- Hover/selected fill `#3a343e`; page `#1d1c1f`.
- Label `#f7f6f8`; shortcut `~#98939d`; disabled `~#4b4a4d`.

## Notable details
- **Rendering artefact in the capture:** the demo's item width is too narrow, so the label "Menu Item" and the shortcut "Cmd+O" **overlap and collide** in every cell of story 075. The intended layout (label left, shortcut right, with space between) is only legible from the wider Menu story (077). The gap between label and shortcut therefore cannot be measured from these screenshots.
- Hover and Selected share the same fill, so a hovered-but-unselected item and a selected-but-unhovered item look almost identical.
- No focus state is documented for MenuItem at all.
