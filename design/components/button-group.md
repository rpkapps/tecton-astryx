# ButtonGroup

## Sources
- `032_components-button-group__figma-matrix.png`
- `035_components-button-group__stickers.png`

## Anatomy
1. **Segments** — two or more Buttons joined into one continuous control; each segment holds a "Label".
2. **Internal separators** — a 1px rule between adjacent segments:
   - in `primary` / `secondary` the separator is a slightly *darker* hairline cut through the shared fill;
   - in `tertiary` (no fill) it is a free-standing 1px vertical (or horizontal) rule between the labels;
   - in `outlined` it is a segment of the shared border.
3. **Outer container** — the group's outer corners are rounded; interior corners are square, so the whole thing reads as one rounded slab.
4. **Split-button trailing affordance** (story 035, first item) — a two-segment group whose second segment holds a **chevron-down icon instead of a label**, i.e. the split/dropdown button pattern.

## Variants
Section labels on 032, for both orientations: `primary`, `secondary`, `tertiary`, `outlined` — the same variant vocabulary as Button (minus `textOnly`).
- **primary** — continuous violet-mauve fill (`~#5d4d68`) across all segments, white-ish labels, darker hairlines between segments.
- **secondary** — continuous dark graphite fill (`~#3a343e`), light mauve labels.
- **tertiary** — no fill at all; only thin separator rules between labels.
- **outlined** — 1px light mauve border around the whole group plus a border between segments; no fill.

**Orientation** is the second axis, shown as two blocks on 032:
- **horizontal** (top block) — segments side by side, outer left/right corners rounded.
- **vertical** (lower block) — segments stacked, outer top/bottom corners rounded, separators horizontal.

## Sizes
One size in these stories, matching Button `md` (32px per segment). No sm/lg variants of the group shown.

## States
No state matrix. Story 035 ("stickers") shows one segment of a vertical primary group rendered **lighter than its siblings** (the middle "Label" of the vertical primary group is a lighter violet), which reads as a selected/active segment — but the page does not label it.

## Shape and spacing
- Outer radius **4px**, matching Button; inner corners are square (radius 0) so segments butt together with no gap.
- No gap between segments: the fills are contiguous and only the hairline separates them.
- Segment padding matches Button md (~14px horizontal).
- In vertical groups each segment is full-width of the group, so the group width is set by the widest label.

## Typography
Same as Button: ~14px medium-weight label, no case change.

## Colour notes
- primary fill `#5d4d68`, separator a step darker; labels `~#e5e0eb`.
- secondary fill `#3a343e`, labels `~#bab3c0`.
- tertiary separator rule ~`#3a343e`–`#433d47` on the `#1d1c1f` page.
- outlined border `~#aaa1b2`.

## Notable details
- Page headings, verbatim: "Button Group Variants" and "Button Group Stickers".
- The **split button** (label + chevron segment) is only shown on the stickers page and only in primary; it is the clearest evidence that the group is also the host for dropdown buttons.
- No focus state is shown for the group, so how the pink focus ring interacts with joined segments is undocumented.
- `textOnly` is absent from ButtonGroup even though Button has it.
