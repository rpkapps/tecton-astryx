# Panel patterns (test pages 117–124)

These eight screenshots are product panels composed from the Tecton components. They are the best evidence for how the primitives are meant to be assembled, and for the surface-layering rules.

---

## Surface layering (the "panel on panel" question)

Measured across all eight pages:

| Layer | Measured colour | Note |
|---|---|---|
| Page / canvas | `#1d1c1f` | the warm near-black everything sits on |
| Panel border | `#342f39`, 1px | every panel has one; there is **no drop shadow** on any panel |
| Panel surface (tone A) | `#131214` | used by `117` 2 Horizons, `122` FDA 1.02, `124` Reduced DLS |
| Panel surface (tone B) | `#000000` (pure black) | used by `118` AI Agent, `120` 2 Selected, `123` Facies Modeling |
| Panel surface (tone C) | `#141316` | `121` FDA comparison table body/footer |
| Inset media / chart box inside a panel | `#1d1c1f` | **lighter** than the panel — the same value as the page |
| Form controls inside a panel (Select, TextField) | `~#28232c` – `#2b2232` | lighter again |
| Icon buttons / kebab chrome | `~#3a343e` | lightest chrome |
| Table header inside a panel | `#433d47` | the lightest surface of all |

**The rule is the inverse of the usual convention: the closer a surface is to the top of the stack, the DARKER it is.** A panel is darker than the page it floats on; a menu (see `menu.md`, surface `#131214`) is darker than the page; and in `119` the frontmost panel is pure black while the panels behind it are lighter and dimmed. Content *inside* a panel then steps back up in lightness — insets, fields and buttons are all lighter than the panel that holds them.

`119` (background panels) is a collage of six or seven panels at different depths. The rear panels are rendered at reduced contrast (their text fades toward `~#2a2a2c`, their surfaces toward `~#171618`) while the frontmost panel keeps full contrast on pure black, with a soft dark halo bleeding a few pixels beyond its border. Depth is communicated by **contrast and darkness, not by shadow or by getting lighter**.

---

## Panel by panel

### 117 — "2 Horizons" (property panel)
- **PanelHeader**: title "2 Horizons" left, a single **panel-collapse icon button** (a split-panel glyph) right. A 1px divider under the header.
- **Paired field row**: two labelled fields side by side — "Color" (a Select showing a colour swatch + the word "Mixed") and "Line" (a Select showing a line-weight glyph + "4").
- **Repeating group**: a muted group label ("Horizon 1", "Horizon 2") followed by three controls:
  1. a name field with a **leading horizon-curve icon** ("Spekk fm top"),
  2. a Select with the same leading icon ("K70: Spekk FM Top"),
  3. a paired row of a **colour field showing a green swatch and a hex value ("218585", "2D7856")** and a line-weight Select.
- **Key–value block** at the foot: `Volume — Survey 2`, `Top Depth (TVDSS) — 2,525m`, `Bottom Depth (TVDSS) — 2,639m`. Labels left in muted grey, **values right-aligned in a monospace face** with subtle character-level colour (digits slightly warmer than units).

### 118 — "AI Agent" (conversation panel)
- **PanelHeader**: a leading **layers icon**, the title "AI Agent", then a **kebab** and a **close ✕** at the right.
- **Progress/step lines** at the top in muted grey: "Calculated impact on drilling time and rig schedule (0.5+ days)", "Calculated impact on cost ($2.0-2.3M)".
- **Assistant message**: a plain text block, near-white, no bubble, full panel width.
- **Suggested-action buttons**: right-aligned filled buttons — "Add casing liner", "Update shoe depth", "Apply changes" (violet-grey fill `~#5a6274`/`#5d4d68`, ~4px radius). These are right-aligned as if they were the user's replies.
- **Collapsible run summary**: a muted line with a chevron, e.g. "4 actions - 37s ⌄", "1 action - 8s ⌄".
- **Inline link inside prose**: "shoe depth at 13,359ft MD." is **underlined** in the body text — the Link component in `Underline=always` mode.
- **Status pill**: "Applying casing changes…" — a left-aligned lighter violet pill indicating work in flight.
- **Composer** pinned at the bottom: an outlined TextField with the placeholder "What should we do next?" and a **microphone icon button** to its right, sitting on a bar separated from the transcript by a divider.

### 119 — "Background panels"
A layered collage used to check surface contrast. Visible fragments: the AI Agent panel, an FDA card, a **DropdownMenu** (items `Open  Cmd+O`, `Rename` (hovered), `Export`, `Delete` (disabled) with leading icons and a trailing shortcut), the FDA comparison table, a **TabGroup** ("Overview" selected, then "Framing", "Team", "Project Well", "Analytics", "FD Builder", with two icon buttons and a **badge "3"** at the right end), the Facies Modeling panel, the Reduced DLS card, and the 2 Selected panel. See the layering table above.

### 120 — "2 Selected" (comparison panel)
- **PanelHeader**: title "2 Selected" + panel-collapse icon button.
- **Compare row**: the sentence `Compare [Cost ⌄] and [Risk ⌄]` — two inline Selects embedded in a line of text.
- **Scatter/quadrant chart**: a bordered inset with axis labels at the edges ("High Risk", "Low Risk", "Low Co…", "High C…"), a faint cross of axis lines, and four **hatched bubbles** (teal, olive, brown, tan). The lead bubble carries a **crown glyph** marking the primary option. Bubble fills use diagonal hatching rather than solid colour.
- **Legend row**: four small chips, each a coloured square + label — "Initial Design" (selected: lighter chip fill), "DLS", "HTDP", "Liner". Only the selected one has a filled chip background.
- **Metric group**: a group heading ("Cost", "Risk") then repeating **MetricRow**s: a label line ("Drilling & Labor", "Casing Material Cost", "BHA & Tubing Cost", "Casing & Liner Run", "Drilling Torque & Drag", "Drilling Hydraulics"), then **two stacked mini bars** (teal = option A, tan = option B) each with a **hatched tail representing the uncertainty range**, faint tick marks across the track, and a right-aligned monospace value or range ("$98M - $112M", "$34-$41M", "68%-83%", "2%"). A 1px divider separates each MetricRow.

### 121 — "FDA comparison table" (table panel)
- A **Table** with header `Rank ↓ | FDA | NPV | IRR | CAPEX | Peak Production | Risk` (Rank is the active sort, descending).
- Each row: a **tall colour swatch bar** at the far left (salmon, periwinkle) acting as a series key, the rank number, a **Chip** ("Nominated" — a filled violet pill with a leading layers icon; "Ref Case" — an outlined grey pill), then the FDA name, then numeric cells.
- **Numbers are monospace and semantically coloured**: green for favourable, red/salmon for unfavourable ("$350.4 mm" green, "21%" red, "22%" green, "$240.5 mM" red, "Low" green, "Medium" red). Units ("mm", "mM", "Mbbl/d") are rendered smaller and dimmer than the number.
- A **kebab** ends each row.
- **Footer row** is an action rather than pagination: `+ Add Comparison`, left-aligned with a leading plus icon.

### 122 — "FDA 1.02" (summary card)
- **CardHeader**: a **checkbox** for selection, the title "FDA 1.02" in monospace, a right-aligned **outlined status chip "Ongoing"** (periwinkle border and text) and a **kebab**.
- **Media block**: a bordered inset holding a map/plan image, with the caption "Satellite drill locations" overlaid top-left in bold.
- **Collapsible "Description"**: a muted label with a chevron, then the body text "Targets a nearby accumulation drilled independently, with production routed back to a host facility."
- **SectionHeader with verdict**: "Economics" left, and right-aligned a **coloured verdict word plus a right chevron** — "Good ›" in green.
- **Metric tiles row**: four columns separated by faint vertical rules — `NPV 170.3 mmusd`, `IRR 20.1 %`, `Breakeven $44 usd boe`, `CapEx 270.5 mmusd`. Each tile is label (small, muted) / **value (large, monospace)** / unit (small, muted).
- **Rating rows**: repeated three times — a label ("Complexity", "Risk", "Emissions"), a right-aligned coloured verdict with a chevron ("Moderate ›" amber, "High ›" red, "Low ›" green), and beneath it a **segmented meter**: seven equal dashes, the leading N filled in the verdict's colour (amber 3/7, red 6/7, green 2/7) and the rest grey. A divider separates each rating row.

### 123 — "Facies Modeling" (settings panel)
- **PanelHeader**: title "Facies Modeling" + panel-collapse icon button, divider below.
- **Top field**: "Model Name" label + Select ("Facies Model 01").
- **Collapsible SectionHeader**: a bold section title ("Parameters", "Lithotype Density") with, right-aligned, a **settings/sliders icon button** and a **collapse chevron**. A divider sits above each section header.
- **Stacked labelled Selects**: "Facies Template" (with a leading orange colour swatch inside the field), "Input Data", "Target Surface", "Volume" (two Selects stacked with only the first labelled), "Method".
- **Slider rows**: each is a **colour swatch + name on the left, a value word right-aligned ("Moderate") in monospace, and a full-width Slider beneath** — "Floodplain" (blue swatch), "Levee Sand" (olive), "Channel Sand" (salmon), "Crevasse Splay Sand" (mauve).
- **Primary action** pinned at the bottom: a **full-width violet Button "Generate Facies Model"**.

### 124 — "Reduced DLS" (design card)
- **CardHeader**: selection **checkbox**, bold title "Reduced DLS", and a **kebab inside a filled square icon button** at the right.
- **Diagram inset**: a bordered box holding a well-schematic illustration in teal and salmon, with a **"Primary" chip (crown icon + label)** pinned top-left inside it, depth labels down the left ("2,000 ft", "2,900 ft", "13,359 ft") and hole-size labels down the right in teal ("17 1/2\"", "12 1/4\"", "8 1/2\"").
- **Status icon row**: six items — four **circular icon chips** (three periwinkle, one salmon) each carrying a domain glyph, two of them with a **small padlock badge at the top-right corner**, followed by two bare monochrome icons (a well-pick glyph and a `$`). This is an at-a-glance attribute strip.
- **MetricRows**: `AFE Cost — 3M-12M`, `Plan Days — 23d-38d`, `DDI — 2.6`; label left in muted grey, **value right-aligned in monospace**, 1px divider between rows.
- **Rating row**: "Risk" left, "High" right, with a seven-segment salmon meter beneath (6/7 filled) — identical to 122's rating pattern.
- **Primary action**: a **full-width violet Button "View Design"** at the foot.

---

## Reusable composition patterns

1. **PanelHeader** — `title (left) + optional leading icon + action icons (right)`. Right-hand actions seen: panel-collapse (split-panel glyph), kebab overflow, close ✕. Always followed by a 1px divider. Height ~44px.
2. **CardHeader** — `selection checkbox + title + status chip + kebab`. Used by the two card-shaped panels (122, 124).
3. **SectionHeader** — a bold section title with right-aligned `settings icon + collapse chevron` (123), or with a right-aligned `coloured verdict word + › chevron` (122). Preceded by a divider.
4. **CollapsibleLabel** — a muted lowercase-ish label plus a small chevron used to disclose a block of text or a run summary: "Description ⌄", "4 actions - 37s ⌄".
5. **LabelledField** — a small muted label above a full-width Select or TextField. Fields are stacked with ~10px gaps; two can be paired side by side in one row (117's Color/Line).
6. **FieldWithSwatch** — a Select or TextField whose value is prefixed by a small **colour square**: used for facies types, horizon colours and hex values. This is the ColorSwatch component embedded in a field.
7. **MetricRow** — `label (left, muted, sans) + value (right, monospace)`, one per line, separated by 1px dividers. The dominant data pattern across 117, 121, 122, 124.
8. **MetricTileRow** — several `label / big monospace value / unit` tiles in a row, separated by faint vertical rules (122's NPV / IRR / Breakeven / CapEx).
9. **SegmentedMeter** — a 7-segment dash bar under a rating row, N segments filled in the verdict's semantic colour. Used for Complexity, Risk, Emissions (122) and Risk (124).
10. **RangeBarRow** — label, then one or two mini bars with a **hatched tail for the range** and faint tick marks, plus a right-aligned monospace range value (120).
11. **SliderRow** — `colour swatch + name (left) + value word (right, monospace)` on one line with a full-width Slider beneath (123).
12. **LegendChipRow** — a row of small chips, each `colour square + label`, with only the active one carrying a chip fill (120).
13. **StatusIconStrip** — a row of circular coloured icon chips, some with a small corner badge (a padlock), followed by bare monochrome icons (124).
14. **InsetMedia** — a bordered box, one step **lighter** than the panel, holding a chart, diagram or image, with labels and a chip overlaid inside it.
15. **FooterAction** — either a **full-width primary Button** pinned at the bottom of a panel ("Generate Facies Model", "View Design") or a left-aligned `+ Add …` text action in a table footer.
16. **Composer** — a bottom-pinned input bar: outlined TextField + trailing icon button, separated from the content above by a divider (118).
17. **SuggestedActionButtons** — right-aligned filled buttons interleaved in a conversation transcript (118).

---

## Typography and colour conventions in the panels

- **Two typefaces are in play.** Labels, titles and prose use the UI sans; **every numeric value, unit, code and "verdict" word is set in a monospace face** ("2,525m", "170.3", "23d-38d", "Moderate", "High", "Good", "USR-2048", "FDA 1.02"). This monospace/sans split is the strongest and most consistent convention in the panels, and it is not documented on any component story.
- Semantic colour is applied to **numbers and verdict words**, not to surfaces: green `~#4fa66f` = good/low, amber `~#d18404` = moderate, red/salmon `~#cc7f7d` = high/bad, periwinkle `~#8ca7de` = informational.
- Units are always smaller and dimmer than the number they follow.
- Charts use **diagonal hatching** to show ranges/uncertainty rather than opacity or a second solid colour.
- The primary action button is the violet `#5d4d68` Button primary, usually full-width at the foot of the panel.
