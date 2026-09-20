# theme-audit

A dev-only harness that answers one question: **does the Tecton theme restyle
the components it themes, or does it change them?**

It renders all 646 ported examples (`apps/docs/examples/components/*/*.tsx`)
twice — once on `@tecton/react` under `TectonProvider`, and once on the same
files with every `@tecton/react/<Module>` import resolved to
`@astryxdesign/core/<Module>` under `@astryxdesign/theme-neutral`, the theme
upstream's own documentation site uses — then diffs the two element trees box by
box and tabs through the Tecton render checking every focus ring.

There are **two audits** over that same pair of renders:

- **the resting audit** (`scripts/audit.mjs`) — geometry, variant collapse and
  focus rings, measured on a render nobody has touched;
- **the state audit** (`scripts/state-audit.mjs`) — the paint of every stateful
  control through rest → hover → active → changed → focused, on both renders.
  A resting diff cannot see a control that paints nothing once it is pressed,
  which is how a `ToggleButton` whose activated fill never matched anything
  survived a clean run.

Neither is published, part of `pnpm build`, or run by `pnpm check`. The report
they produced is `docs/design/theme-audit.md`.

## Running it

```sh
pnpm --filter @tecton/react build      # both harnesses consume dist/
pnpm --filter @tecton-fixture/theme-audit audit -- --out .audit
node fixtures/theme-audit/summarise.mjs .audit/results.json

pnpm --filter @tecton-fixture/theme-audit audit:states -- --out .state-audit
node fixtures/theme-audit/summarise-states.mjs .state-audit/results.json
```

Flags, both: `--only <substring>` narrows to matching example ids, `--limit N`
caps the count, `--light` adds a Tecton light capture, `--port N` moves the two
servers (neutral on `N`, Tecton on `N + 1`) so two runs can overlap, and
`--shots all|findings|none` chooses which examples get screenshots (the resting
audit defaults to `findings`, the state audit to `none` — its evidence is
`state-evidence.mjs`).

## The state audit in one paragraph

For every example it collects the stateful controls — anything carrying
`aria-pressed`, `role="switch"`, a checkbox or radio, `role="tab"`,
`aria-selected`, `aria-expanded`, a menu check item, a tree item, a segmented
radio, `aria-current`, a slider thumb, a selectable card, a link — up to three
of each kind and eight per example, and walks each one through hover, mouse
down, the click, and keyboard focus, recording the background, image, ink,
border, shadow, outline, opacity, transform, weight and decoration of the
control **and its visual descendants** at each step. A control is reloaded
before its turn, because a click on one control moves others. Then:

| Finding      | What it means                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flattened`  | the reference render's paint moves between rest and this state and Tecton's does not — a theme rule has painted over a state the component draws                    |
| `flat-hover` | the same, for hover, the one state a user meets without committing to anything                                                                                      |
| `indistinct` | Tecton's paint in this state is identical to its own hover paint, so the state cannot be told from a passing pointer                                                |
| `contrast`   | ink inside the control, in this state, on the surface that state paints behind it: under 4.5:1 for text or 3:1 for an icon, where the reference clears the same bar |

## What is where

| File                      | What it does                                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vite.config.ts`          | Two flavours of one config: `mode=tecton` and `mode=neutral`, the second rewriting the examples' imports onto core. Also compiles the seven examples that write StyleX of their own. |
| `src/Stage.tsx`           | Mounts one example inside `#stage`, keeps the stage on the page when an example throws, and flags readiness for the driver.                                                          |
| `scripts/probe.js`        | Injected into every page: `__measure()`, `__focusables()`, `__describeActive()`. DOM only.                                                                                           |
| `scripts/audit.mjs`       | Drives the two dev servers and Chromium, diffs, and writes `results.json`.                                                                                                           |
| `summarise.mjs`           | Groups a `results.json` by root cause. `--ids` lists every example behind each row.                                                                                                  |
| `inspect.mjs`             | One example, both sides, every box printed. For chasing a single finding.                                                                                                            |
| `scripts/state-probe.js`  | The state audit's browser side: `__controls()`, `__paint()`, `__stateOf()`, `__focusControl()`. DOM only.                                                                            |
| `scripts/state-audit.mjs` | Drives both renders through every state and writes `results.json`.                                                                                                                   |
| `summarise-states.mjs`    | Groups a state run by finding kind, control and state. `--ids` lists every example behind each row.                                                                                  |
| `state-evidence.mjs`      | The before/after/reference triples the "States and paints" part of the report cites — each one may put a control into a state first.                                                 |
| `icons.mjs`               | Every `svg` in one example: rendered box, viewBox, and how much of it the ink fills.                                                                                                 |
| `focusshot.mjs`           | One example with a control focused, captured on both sides. For looking at a ring rather than counting it.                                                                           |

## Notes

- `@tecton/react/icons` is **not** rewritten for the neutral side. Both renders
  draw the same Tecton glyphs, so an icon that measures differently measures
  differently because of the theme.
- Differences the type scale explains are bucketed separately and are not
  findings: Tecton's ladder is not upstream's, and that is the point of it.
- A handful of examples lay out to tens of thousands of pixels and can take the
  renderer down. The driver notices a crashed page, relaunches, and carries on;
  screenshots are viewport-sized for the same reason.
- The state audit only looks at controls that are **in the viewport**: it points
  a real mouse at them, and a control 4000px down the page cannot be pointed at.
  That is the same 1100×900 window the resting audit measures.
- `:focus-visible` follows the modality of the last interaction, so the state
  audit presses Tab (to establish keyboard modality) and _then_ moves focus
  programmatically. A real Tab would land wherever the tab order says, which is
  what the resting audit's focus pass already walks.
