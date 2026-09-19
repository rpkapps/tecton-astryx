# List / ListItem

## Sources
- `070_components-list__gutters-and-subheader.png`
- `072_components-list__state-matrix.png`

## Anatomy
**List container** (story 070): a bordered panel (1px `~#3a343e`) containing
1. **Subheader** — a text line at the top of the list ("Subheader"), near-white, slightly smaller than the item label, sitting above the items with no separator.
2. **List items** — stacked rows.

**List item** (story 072):
1. **Leading icon** — outline "cube" glyph, ~20px.
2. **Label** — "List item", left aligned after the icon.
3. **Row surface** — a full-width rectangle that carries the state fill.

No trailing slot, secondary text, checkbox or avatar is shown in these stories.

## Variants
Two density variants, given as the page's section headings on 072:
- **Default** — taller rows.
- **Condensed** — shorter rows, tighter icon-to-label gap.

Story 070 adds a second, orthogonal axis captioned on the demos themselves: **"With gutters"** vs **"No gutters"** — with gutters the row content is inset from the container's left/right edges (icon starts ~16px in); without gutters the icon sits flush at ~8px from the border. The Subheader is present in both.

## Sizes
Measured from the state matrix:
- Default row height ≈ **44px**.
- Condensed row height ≈ **36px**.
No sm/md/lg naming.

## States
Column labels on 072, in order: **Enabled, Hovered, Focused, Pressed, Activated**, plus a **Disabled** cell on its own second line under Enabled.

| State | Appearance |
|---|---|
| Enabled | no fill; a 1px `~#3a343e` border outlines the row (this is the demo's row outline rather than a component border — it is present on Enabled and Disabled only) |
| Hovered | filled mauve-grey `~#3f3844`; no border |
| Focused | same fill as hover **plus a 1px hot-pink `#ff52a8` border** around the whole row (a border, not an offset ring — it sits on the row's edge) |
| Pressed | fill one step lighter than hover, `~#443d49` |
| Activated | fill similar to pressed, `~#453e4b`; label reads slightly brighter | 
| Disabled | no fill; icon and label drop to `~#4b4a4d`; the row outline stays but dims |

## Shape and spacing
- Rows are **square-cornered rectangles** (radius 0 or very close to it) — noticeably different from the 4px radius used by Button/Accordion/Menu.
- Default: icon at ~16px from the left with gutters, ~24px gap before the label.
- Condensed: icon at ~16px, ~20px gap before the label, and ~4px less vertical padding.
- List container corner radius ~2px with a 1px border.

## Typography
Item label ~15px regular, near-white. Subheader ~14px regular, near-white but sitting alone at the top. Column/row captions on the story page are the small muted style.

## Colour notes
- Hover `#3f3844`, pressed `#443d49`, activated `#453e4b` — a very compressed ladder, the three are hard to tell apart.
- Focus border `#ff52a8`.
- Page background `#1d1c1f`; the demo row outline `#3a343e`.

## Notable details
- Page headings, verbatim: "Default", "Condensed"; captions "Enabled", "Hovered", "Focused", "Pressed", "Activated", "Disabled", "Subheader", "With gutters", "No gutters".
- **Focus is drawn as a 1px border on the row itself**, not as an offset ring — different from Button/Checkbox where the pink sits outside the control.
- Hover / Pressed / Activated fills are very close together; in a real UI these three states will look nearly identical.
- Rows are square-cornered while the rest of the system is 4px-rounded.
