# TreeView (Tree Item)

## Sources
- `112_components-tree-view__overview.png` (docs page, 3200×3346 — includes a Parameters table)
- `113_components-tree-view__state-matrix.png`

## Anatomy
A tree **row**, left to right:
1. **Expand chevron** — chevron-down when expanded, chevron-right when collapsed; **absent** on leaf rows and on rows with no children.
2. **Kind icon** — an **open folder** glyph for expanded folders, a **closed folder** for collapsed ones, and a small **well/log-curve tick glyph** for leaf items (a domain icon, not a file icon).
3. **Colour tag** (`startAdornment`) — a small **filled square or dot in a colour** immediately before the label. Folders in the demo carry a mint-green **square**; nested items carry a smaller mint-green **dot**. This is the "color tag" the docs refer to.
4. **Label** — e.g. "K70: Spekk fm top", "Asset group", "Well pick", "Collapsed folder", "Hidden folder".
5. **Suffix** (`suffix`) — optional content after the label; the demo renders a small grey **chip reading "Ready"**, right-aligned.
6. **End adornment** (`endAdornment`) — a trailing **kebab (⋮)** for actions, or an **eye-with-slash** icon on hidden rows.
7. **Indentation** — nested rows are indented by depth; there is **no guide line/rail** between levels, only whitespace.

## Variants
- `kind`: **folder** | **item** (default `folder`) — controls the icon and, apparently, the presence of the chevron.
- `expanded`: folder rows only.
- `hidden`: renders the label at reduced opacity plus an eye-off icon in the end slot.

## Sizes
One size. Rows measure ~40px tall in the state matrix. `depth` is a number prop controlling indentation; each level indents ~30px.

## States
Captions on 113 under the heading **"Inventory item states"**, verbatim: **Rest, Hover, Focused, Pressed, Selected, Right-click, Hidden, Disabled**.

| State | Appearance |
|---|---|
| Rest | no fill, 1px demo outline; label near-white |
| Hover | filled `~#332d38` across the full row |
| Focused | a **1px hot-pink `#ff52a8` border** around the whole row (a border on the row edge, like List) plus a dark fill |
| Pressed | filled a step lighter than hover `~#3d3642` |
| Selected | the **lightest fill** `~#443d4a`; label near-white |
| Right-click | a mid fill `~#3a3340`, visually between hover and selected — a distinct context-menu-open state |
| Hidden | no fill; label and icons dim to ~50%; **the kebab is replaced by an eye-with-slash icon** |
| Disabled | no fill; everything dims to `~#4b4a4d`, including the colour tag; the kebab dims but stays |

The second section, **"Expansion and nesting"**, shows a live tree: `Asset group` (expanded folder) → `K70: Spekk fm top` (expanded folder) → `Well pick` (leaf, with a "Ready" chip) ; then `Collapsed folder` (chevron-right) and `Hidden folder` (no chevron, dimmed, eye-off icon).

## Shape and spacing
- Rows are **square-cornered** full-width rectangles (radius 0–2px), matching List rather than Button.
- Chevron → icon → colour tag → label are spaced ~8px apart.
- Depth indent ≈ 30px per level.
- The tree container in the demo is a bordered panel with `surfaceWidth` of 370px.

## Typography
Label ~15px regular near-white; the "Ready" chip is ~11px on a small grey pill. Section headings on 113 ("Inventory item states", "Expansion and nesting") are ~18px medium white.

## Colour notes
- Hover `~#332d38`, pressed `~#3d3642`, right-click `~#3a3340`, selected `~#443d4a` — four very close fills.
- Focus border `#ff52a8`.
- The demo colour tag is a **mint green** `~#a8ddb9`; the tag colour is clearly meant to be data-driven.

## Notable details
### Prose from the overview page, quoted verbatim
> "Use tree views for nested inventory, project, or file structures where users need to expand branches. For flat collections, consider List or Table instead."

> **Hierarchy** — "Use trees only when parent-child relationships are essential to the task."

> **Expansion** — "Keep expanded content predictable so users can maintain their place in the structure."

> **Row state** — "Use selected, hidden, disabled, and color-tag states to support scanning complex structures."

"Related Components" lists **List**, **Accordion**, **Table**. "Related Stories" lists **State Matrix** — "Tree item visual states, expansion, nesting, hidden items, and suffixes."

### Parameters table (verbatim)
| Name | Type | Description | Default |
|---|---|---|---|
| `label` | ReactNode | "Tree item label." | `Folder` |
| `kind` | string | "Folder or item styling." | `folder` |
| `depth` | number | "Indentation depth for nested rows." | `0` |
| `state` | string | "Forced visual state for documentation and static previews." | `rest` |
| `selected` | boolean | "Selected row state." | `false` |
| `disabled` | boolean | "Disabled row state." | `false` |
| `hidden` | boolean | "Hidden row state." | `false` |
| `expanded` | boolean | "Expanded state for folder rows." | `true` |
| `startAdornment` | ReactNode | "Optional leading color tag." | – |
| `suffix` | ReactNode | "Optional suffix content rendered after the label." | – |
| `endAdornment` | ReactNode | "Optional trailing action or visibility icon." | – |
| `surfaceWidth` | story control | "Documentation-only wrapper width in pixels." | `370` |

This confirms the API is a **flat tree-item component** (`depth` is a number you pass, not derived from nesting), which is unusual — the consumer is responsible for indentation depth.

### Other
- **"Right-click" is a first-class visual state**, which is rare; it needs a bespoke implementation on most libraries.
- **`hidden` is a first-class row state** with its own eye-off affordance — a visibility toggle baked into the row, reflecting the subsurface-data domain (layers you can show/hide).
- The colour tag is a **data-driven colour swatch inside a list row** — see also the `ColorSwatch` component.
