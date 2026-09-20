# Tab

## Sources
- `097_components-tab__state-matrix.png` (3200×2120)

## Anatomy
1. **Leading icon** — a magnifier glyph in the demos, ~16px.
2. **Label** — "Tab".
3. **Indicator** — a bar marking the active tab: a **horizontal rule under the tab** in Horizontal orientation, and a **vertical rule on the tab's right edge** in Vertical orientation.
4. **Surface** — none in Underline; a rounded fill in Filled.

## Variants
Three nested axes, all named as page headings:

**Style** (top-level headings): **Underline** and **Filled**.
- **Underline** — no fill at rest; the activated tab gets a 2px light rule on its edge (bottom for horizontal, right for vertical). Focus draws a near-black box.
- **Filled** — the tab has a rounded fill in every state from hover onward; the activated tab gets the brightest fill.

**Orientation** (second-level headings): **Horizontal** and **Vertical**.
- Vertical tabs are left-aligned in a column; the active indicator is a vertical bar to the *right* of the label.

## Sizes
Two, as third-level headings: **Medium** and **Small**. Medium tabs are ~32px tall, Small ~28px; the icon and label shrink one step.

## States
Column captions, lowercase, verbatim: `enabled`, `hovered`, `focused`, `pressed`, `activated`, `disabled`.

| State | Underline | Filled |
|---|---|---|
| enabled | bare icon + label, both dim (`~#98939d`) | bare icon + label, dim |
| hovered | label brightens; no fill | a **dark fill** `~#2b262e` appears behind the tab |
| focused | a **near-black filled box** `~#111012` appears behind the tab (darker than the page); label brightens. **No pink ring** | a fill one step lighter than hover; no pink ring |
| pressed | label brightens further; no fill | fill lightens another step |
| activated | label goes near-white **and the indicator bar appears** (bottom/right) | the **brightest violet-grey fill** `~#6b6076` plus a near-white bold label; no separate indicator bar |
| disabled | icon and label drop to `~#4b4a4d`; no fill or indicator | same, no fill |

**Notable:** Tab's focus is the *only* focus treatment in the system that is **not** a hot-pink ring — it is a dark box.

## Shape and spacing
- Underline tab: no box; the focus/hover boxes have ~4px radius.
- Filled tab: ~4px radius rounded rectangle.
- Icon-to-label gap ~8px; horizontal padding ~12px.
- The activated underline bar is ~2px thick and spans the tab's full width (horizontal) or height (vertical).

## Typography
Label ~14px (Medium) / ~13px (Small); the activated label is one weight heavier and near-white.

## Colour notes
- Resting label `~#98939d`; activated `#f7f6f8`; disabled `~#4b4a4d`.
- Filled activated `~#6b6076` — a violet-grey, lighter than Button secondary but darker than Button primary.
- Focus box `~#111012` (darker than the `#1d1c1f` page).

## Notable details
- No prose captions.
- The **focus state is a dark box, not a pink ring**, which is inconsistent with every other interactive component.
- In the Filled style the activated tab has no separate indicator bar — the fill *is* the indicator.
