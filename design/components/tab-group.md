# TabGroup

## Sources
- `094_components-tab-group__group-variants.png`

## Anatomy
1. **Tab strip** — a row (or column) of Tab components. The demo uses four: "Overview", "Framing", "Team", "Project Well"; the first is active.
2. **Strip background** (optional) — a container fill behind the whole strip.
3. **Underline rail** — in the Underline variant, a continuous hairline runs the length of the strip, with the active tab's segment rendered brighter/thicker.

## Variants
Section captions on the page, verbatim:
- **"Horizontal / Underline"** — tabs in a row on the page background, a 2px light bar under the active tab and a faint rail under the rest.
- **"Horizontal / Filled / Background=False"** — tabs in a row, the active tab carries a violet-grey rounded fill, the strip itself has **no background**.
- **"Horizontal / Filled / Background=True"** — the same, but the whole strip sits on a **slightly lighter container** (a rounded bar `~#2b262e`) with the active tab's fill inside it. This is the segmented-control look.
- **"Vertical / Underline"** — tabs stacked in a column, each right-aligned to a common right edge, with a 2px vertical bar to the right of the active tab. (In the capture the labels are staggered — each successive label starts further left — because they are right-aligned to the indicator rail.)

So the group exposes at least three props: `orientation` (horizontal | vertical), `variant` (underline | filled) and `background` (true | false).

## Sizes
Not exercised on this page; the Tab story provides Medium and Small.

## States
Not a state matrix. The only state shown is **active vs inactive**: the active tab is near-white and bold with the indicator/fill; inactive tabs are dim `~#98939d`.

## Shape and spacing
- Horizontal tabs are spaced ~12–16px apart.
- The `Background=True` container is a rounded bar with ~4px radius and ~4px internal padding; the active tab's fill sits inside with a small inset.
- Vertical tabs are ~50px apart vertically, right-aligned against the indicator rail.

## Typography
Active tab label is near-white and looks one weight heavier; inactive labels are the dim mid-grey. Each tab carries a leading magnifier icon in these demos.

## Colour notes
- Active fill `~#6b6076`; strip background `~#2b262e`; underline rail `~#3a343e` with the active segment near-white.

## Notable details
- Page heading, verbatim: "Tab Group Variants"; section captions as quoted above.
- **`Background=True` turns the TabGroup into a segmented control** — this is the closest thing Tecton has to a SegmentedControl component, and it is a prop on TabGroup rather than a separate component.
- The vertical underline group's right-alignment produces a ragged left edge, which looks unintentional but is what the capture shows.
