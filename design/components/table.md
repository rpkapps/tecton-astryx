# Table

## Sources
- `098_components-table__footer.png`
- `099_components-table__header.png`
- `100_components-table__overview.png` (docs page, 3200×3018 — includes a Parameters table)
- `101_components-table__row.png`
- `102_components-table__variant-matrix.png` (3200×2192)

## Anatomy
**Header row**
1. **Select-all checkbox** in the first, narrow column.
2. **Column header cells** — label plus a **sort affordance** appended after the text.
3. **Settings/column-config icon** (gear) pinned at the far right of the header row.
The header row has its own lighter fill, distinctly lighter than the body.

**Body row**
1. **Row checkbox**.
2. **Leading cell icon** — a small person glyph before the first cell's text (demo data).
3. **Cells** — plain text, left aligned, except the last (`ID`) which is **right aligned**.
4. **Status cell** — a check-in-circle icon followed by a word ("Active", "Pending", "Disabled").
5. **Row overflow** — a vertical kebab at the far right.

**Footer** — a full-width bar with, right-aligned: `Rows per page:` + a "100" select with chevron, `Page 1 of 13`, and prev/next chevron buttons. The left portion of the footer is empty.

## Variants
- **Density / size** (`size`): **Medium** and **Small** — section headings on 098/099/101/102.
- **Small screen** (`smallScreen`): a third layout, captioned "Small Screen" on 102, which narrows every column and **truncates cell text mid-word** ("Avery Sto", "avery.stone@l", "Noah Pate"), drops the checkbox column and drops the pagination controls (only "Rows per page: 100" remains in the footer).
- **Alternate rows** (`alternateRows`): zebra striping is on by default.
- **Checkboxes** (`showCheckboxes`): the selection column can be turned off.

### Sort states (story 099, header cells captioned by their own label)
- **Down** — label + a single **down arrow ↓**; the label is near-white/bold (actively sorted descending).
- **Up** — label + a single **up arrow ↑**; label bright (actively sorted ascending).
- **Default** — label + a **double up/down arrow ⇅** in a dim grey (sortable but not sorted).
- **None** — label with **no arrow at all** and dim text (not sortable).

## Sizes
- Medium header/rows ≈ **44px** tall.
- Small header/rows ≈ **34px** tall.
- Small-screen rows ≈ **34px** with much narrower columns.

## States
Row states, captioned on story 101: **Default, Alternate, Hover, Selected** (each shown at Medium and Small).
| Row state | Fill |
|---|---|
| Default | transparent / page colour |
| Alternate | a barely-lighter band `~#232227` (the zebra stripe) |
| Hover | mauve-tinted `~#3a3340` |
| Selected | lighter mauve `~#4a4350`, **and the row checkbox becomes checked** (light box + dark tick) |

The header row has a **partially-selected (indeterminate) checkbox** when some rows are selected (visible on 099 Medium and on the 102 Medium example where "Maya Chen" is selected).

## Shape and spacing
- Rows are **square-cornered, full-bleed rectangles**; the table has no outer border or radius in the demos.
- Header fill `~#453e4b`; footer fill `~#2b2531` (a violet-tinted band, distinct from both header and body).
- Cell horizontal padding ~16px; the checkbox column is ~48px wide.
- The sort arrow sits ~6px after the label.

## Typography
- Header labels ~14px; the actively sorted one reads brighter/heavier than the rest.
- Cell text ~14px regular, near-white; Small drops to ~13px.
- Footer text ~13px muted.

## Colour notes
- Header `~#453e4b` — the lightest surface in the component.
- Footer `~#2b2531`.
- Alternate row `~#232227`; hover `~#3a3340`; selected `~#4a4350`.
- Status icons are monochrome (all three statuses use the same check-in-circle glyph in the same colour — **"Disabled" and "Pending" are not colour-coded**).

## Notable details
### Prose from the overview page, quoted verbatim
> "Use tables for dense structured data that benefits from aligned columns, sorting, selection, or pagination. For simpler row summaries, consider List."

> **Column comparison** — "Use tables when users need to compare values across rows and columns."

> **Actions** — "Keep row actions predictable and reserve bulk actions for selected rows."

> **Density** — "Choose density based on scanning needs and available space, not just visual preference."

"Related Components" lists **List** and **Tree View**. "Related Stories" lists **Variant Matrix** ("Medium, small, and small-screen user table examples."), **Header** ("Header cells and sort label states."), **Row** ("Row states and alternate cell styling."), **Footer** ("Table pagination footer examples.").

### Parameters table (verbatim)
| Name | Type | Description | Default |
|---|---|---|---|
| `size` | string | "Shared table density." | `medium` |
| `smallScreen` | boolean | "Applies the compact small-screen table layout." | `false` |
| `showCheckboxes` | story control | "Documentation-only toggle for checkbox cells." | `true` |
| `selectedRow` | story control | "Documentation-only toggle for selected row and header checkbox state." | `false` |
| `alternateRows` | story control | "Documentation-only toggle for alternate row cell styling." | `true` |

Note the three `story control` props are explicitly documentation-only, so the real component's API is `size` + `smallScreen` plus whatever the row/cell children expose.

### Other
- **The status column is not colour-coded** — Active / Pending / Disabled all use the same grey check-in-circle icon, which loses meaning at a glance.
- The **small-screen layout truncates without ellipsis** in the capture (text is simply cut off by the column edge).
- The footer's pagination control is a bespoke composition (label + select + page counter + two chevron buttons), not a numbered pager.
