# Breadcrumbs

## Sources
- `030_components-breadcrumbs__variant-matrix.png`

## Anatomy
A single horizontal line of items:
1. **Crumb** — a text label; ancestor crumbs are dimmed, the last crumb ("Current Page") is bright.
2. **Leading icon per crumb** (optional) — a small outline glyph before the label. Different glyphs per level in the demo: a **house** for "Home", a **folder** for "Section"/"Subsection", a **cube/package** for "Current Page".
3. **Separator** — a forward slash `/` in a dim grey, with even spacing either side.
4. **Overflow node** — a horizontal ellipsis `···` replacing the collapsed middle crumbs, sitting between two separators (`Home / ··· / Current Page`).

## Variants
The page labels each row with the exact prop combination it is showing; the three axes are **number of crumbs**, **Icons**, and **Overflow**. Rows, verbatim:
- `2 crumbs / Icons=False / Overflow=False` → `Home / Current Page`
- `2 crumbs / Icons=True / Overflow=False` → 🏠 `Home` / 📦 `Current Page`
- `3 crumbs / Icons=False / Overflow=False` → `Home / Section / Current Page`
- `3 crumbs / Icons=True / Overflow=False`
- `4 crumbs / Icons=False / Overflow=False` → `Home / Section / Subsection / Current Page`
- `4 crumbs / Icons=True / Overflow=False`
- `3 crumbs / Icons=False / Overflow=True` → `Home / ··· / Current Page`
- `3 crumbs / Icons=True / Overflow=True`
- `4 crumbs / Icons=False / Overflow=True` → `Home / ··· / Current Page`
- `4 crumbs / Icons=True / Overflow=True`

Observation: with `Overflow=True` the result is the same shape for 3 and 4 crumbs — **first crumb, ellipsis, last crumb** — so overflow always collapses everything between the first and last.

## Sizes
One size only. Row height ~20px; no size axis.

## States
No state matrix (no hover/focus/disabled columns). The only implicit state distinction is **current vs ancestor**:
- ancestor crumbs: dim mauve-grey (~`#98939d`), and the icon matches.
- current (last) crumb: near-white (~`#f7f6f8`), slightly heavier in appearance, with a brighter icon.
- separators: dimmest grey, dimmer than the ancestor labels.

## Shape and spacing
- No container, background or border — breadcrumbs sit directly on the page.
- Gap around each `/` looks like ~6–8px either side.
- Icon-to-label gap ~6px.
- The ellipsis overflow node has slightly more space around it than a normal crumb, suggesting it is a small button-like target.

## Typography
All crumbs use the same size (~14px) and weight; the distinction between ancestor and current is **colour only**, not weight (the current crumb may be a step heavier — hard to tell at this resolution).

## Colour notes
- Ancestor label ~`#98939d`; current label ~`#f7f6f8`; separator ~`#5a4f62`–`#625c67`.
- Row captions on the page are the small dim caption style.

## Notable details
- No captions or prose beyond the prop-combination labels.
- Icons are **per-crumb and semantic** (house / folder / cube), not a single repeated icon — so the component takes an icon per item.
- The overflow ellipsis is rendered as literal `···` text between separators; there is no "+N" or menu chrome shown, and no popup is captured.
- Last crumb is not a link visually (no underline anywhere in the component).
