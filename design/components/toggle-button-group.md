# ToggleButtonGroup

## Sources
- `107_components-toggle-button-group__size-matrix.png`
- `111_components-toggle-button__variants.png` (shows the group at each emphasis)

## Anatomy
1. **Segments** — two or more ToggleButtons joined edge to edge into one control; the demos use four view-mode icons (grid, list, split-panel, table).
2. **Separators** — a 1px rule between adjacent segments.
3. **Outer container** — rounded outer corners, square inner corners; in the `outlined` emphasis a 1px border wraps the whole group.
4. **Selected segment** — one segment carries a lighter fill; the rest sit at the group's base fill.

## Variants
- **Emphasis** (from 111): `primary`, `secondary`, `tertiary`, `outlined` — same vocabulary and same fills as ToggleButton / Button.
- **Orientation** (from 107): **horizontal** (a row, outer left/right corners rounded) and **vertical** (a column, outer top/bottom corners rounded, horizontal separators). Both are shown for every size, side by side.

## Sizes
Four, as the row labels on 107: **large, medium, small, extraSmall**, matching ToggleButton's scale (≈56 / 46 / 34 / 28px per segment).

## States
No state matrix at group level. Only **selected vs unselected segment** is demonstrated — the first segment is selected in every example.

## Shape and spacing
- Outer radius ~4px; inner corners square; segments are flush with no gap.
- Separator is a 1px line one step lighter/darker than the fill.
- In the vertical group the segments are full-width of the group, so the group's width equals one segment.

## Typography
Not applicable — icon only.

## Colour notes
- Base fill per emphasis: `#5d4d68` (primary), `#3a343e` (secondary), none (tertiary), none + border (outlined).
- Selected segment is one step lighter than the base in every emphasis.

## Notable details
- Page heading, verbatim: "Toggle Button Group Sizes".
- Only **single-select** behaviour is demonstrated (exactly one lit segment in every example); no multi-select example exists in these captures.
- Combined with TabGroup's `Background=True`, Tecton has **two components that both render as a segmented control** — one for icons, one for labelled tabs.
