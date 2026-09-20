# Brand

Transcribed from `screenshots/129_welcome__welcome.png` (the Welcome page). Everything below is what the page states or shows; nothing is inferred about intent or strategy.

## Naming and versions

The page is a full-bleed cover. Its type block, top to bottom:

| Element | Text as shown |
| --- | --- |
| Wordmark (largest type on the page) | `Tecton MUI` |
| Subtitle | `Component UI Kit v9.0.0` |
| URL under the subtitle | `https://mui.com/` |
| Footer mark (bottom left, dimmed) | `Tecton v1.0` |

So the page names three things at once: the design system (**Tecton**, at **v1.0**), the component layer it is built on (**MUI**, whose **Component UI Kit** is at **v9.0.0**), and the MUI site as the reference link. The wordmark "Tecton MUI" joins the two.

## Visual tone

- **Dark-first.** The whole page is near-black; there is no light variant on this screen. The product panels behind the wordmark are dark surfaces on a darker page, separated by hairline dividers rather than shadows.
- **Wordmark type.** The wordmark and subtitle are set in a geometric/humanist sans with a single-storey `a`-free lowercase and a wide `M` — visually the same Figtree family the typography page names as the interface font. The wordmark is near-white on near-black; the footer mark `Tecton v1.0` is the same face at low emphasis in a grey-mauve.
- **Palette in the composition.** The chrome is neutral mauve/graphite (the same family the colour page uses for surfaces, dividers and actions), and colour is spent only on data: teal/azure for well geometry and the selected comparison marker, salmon/red for risk bars and a casing string, amber and olive for lithotype swatches, a muted green for a "Good" economics verdict, and a mauve primary button fill (`Generate Facies Model`, `View Design`).
- **Layering.** The wordmark sits in front of the product panels and partially occludes them; the panels are dimmed toward the left so the type stays readable. Faint construction lines (a light cross-hair grid) run behind the subtitle.

## Product panels shown behind the wordmark

Left to right, the cover uses real-looking subsurface / well-engineering product screens:

1. **AI assistant / chat panel** — an agent turn reading "I've updated the shoe depth of the Production Casing section to 7,700ft MD, resolving the shoe depth overlap with the ProductioN Liner section.", a suggestion chip `Update shoe depth`, a run summary `1 action · 8s`, an `Apply changes` button, a status line `Applying casing changes…`, and a prompt field `What should we do next?` with a microphone affordance.
2. **Facies modelling panel** — `Facies Template: Migrating fluvial channels`, `Input Data: RGB SpecD 20 - 50 Hz`, `Target Surface: Spekk FM Top, Meleke FM Top`, `Volume: Survey 2 / Full Survey`, `Method: Plurigaussian Simulation`, and a `Lithotype Density` group with sliders for `Floodplain`, `Levee Sand`, `Channel Sand` and `Crevasse Splay Sand` (all `Moderate`), ending in a `Generate Facies Model` button.
3. **Horizons panel** — `2 Horizons`, `Color` / `Line` selectors (`Mixed`, `4`), `Horizon 1: Spekk fm top`, `K70: Spekk FM Top`, colour value `218585`, and `Horizon 2: Are fm top`.
4. **Context menu** — `Open  Cmd+O`, `Rename` (highlighted), `Export`, `Delete` (disabled).
5. **Comparison list and tab bar** — numbered rows with status chips `Nominated` and `Ref Case`, labelled `FDA 2.3 Phased tie-back` and `FDA 1.2 Existing tie-ins`, plus `+ Add Comparison`; above it a tab bar `Overview | Framing | Team | Project Well | Analytics | FD Builder` with a badge count of `3`.
6. **Well design panel** — a `Reduced DLS` card with a `Primary` crown chip, a rendered casing schematic with depth callouts (`2,000 ft`, `2,900 ft`, `13,359 ft`) and hole sizes (`17 1/2"`, `12 1/4"`, `8 1/2"`), a row of discipline icons, and a metrics stack: `AFE Cost 3M-12M`, `Plan Days 23d-38d`, `DDI 2.6`, `Risk High` (a segmented red bar), with a `View Design` button.
7. **Cost-vs-risk comparison panel** — `2 Selected`, a `Compare: Cost` selector, a scatter/quadrant plot labelled `High Risk` / `Low Risk` / `Low Co…` with hatched circular markers, a legend `Initial Design | DLS | HTD`, and stacked cost bars under `Cost`: `Drilling & Labor`, `Casing Material Cost`, `BHA & Tubing Cost`.
8. **Opportunity / economics panel** — a `Description` disclosure reading "Targets a nearby accumulation drilled independently, with production routed back to a host facility.", an `Economics` row marked `Good`, a four-up metric strip `NPV 170.3 mmusd`, `IRR 20.1 %`, `Breakeven $44 usd boe`, `CapEx 270.5 mmusd`, and a `Complexity` row marked `Moderate` over a segmented meter.

## What this implies for the foundations (facts only)

- The system is presented as an **MUI-based component kit**, which matches the colour page's "React theme path" column (`theme.palette.tecton.*`) and its note that product React code should use the theme path while non-MUI consumers use the CSS variable.
- The domain shown is **upstream energy / subsurface engineering**: well design, casing and hole sizes, facies and horizons, cost versus risk, and project economics. Dense numeric readouts dominate, which matches the typography page's dedicated `largeData` / `mediumData` / `smallData` variants and its statement that data variants use tabular numbers.
- Dark mode is the presented default, which matches the colour page being captured in dark mode with a single value per token.
