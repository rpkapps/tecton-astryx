# theme-audit

A dev-only harness that answers one question: **does the Tecton theme restyle
the components it themes, or does it change them?**

It renders all 646 ported examples (`apps/docs/examples/components/*/*.tsx`)
twice — once on `@tecton/react` under `TectonProvider`, and once on the same
files with every `@tecton/react/<Module>` import resolved to
`@astryxdesign/core/<Module>` under `@astryxdesign/theme-neutral`, the theme
upstream's own documentation site uses — then diffs the two element trees box by
box and tabs through the Tecton render checking every focus ring.

It is not published, not part of `pnpm build`, and not run by `pnpm check`. The
report it produced is `docs/design/theme-audit.md`.

## Running it

```sh
pnpm --filter @tecton/react build      # the harness consumes dist/
pnpm --filter @tecton-fixture/theme-audit audit -- --out .audit
node fixtures/theme-audit/summarise.mjs .audit/results.json
```

Flags: `--only <substring>` narrows to matching example ids, `--limit N` caps
the count, `--shots all|findings|none` chooses which examples get screenshots
(default `findings`), `--light` adds a Tecton light capture, `--port N` moves
the two dev servers (neutral on `N`, Tecton on `N + 1`) so two runs can overlap.

## What is where

| File                | What it does                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vite.config.ts`    | Two flavours of one config: `mode=tecton` and `mode=neutral`, the second rewriting the examples' imports onto core. Also compiles the seven examples that write StyleX of their own. |
| `src/Stage.tsx`     | Mounts one example inside `#stage`, keeps the stage on the page when an example throws, and flags readiness for the driver.                                                          |
| `scripts/probe.js`  | Injected into every page: `__measure()`, `__focusables()`, `__describeActive()`. DOM only.                                                                                           |
| `scripts/audit.mjs` | Drives the two dev servers and Chromium, diffs, and writes `results.json`.                                                                                                           |
| `summarise.mjs`     | Groups a `results.json` by root cause. `--ids` lists every example behind each row.                                                                                                  |
| `inspect.mjs`       | One example, both sides, every box printed. For chasing a single finding.                                                                                                            |
| `icons.mjs`         | Every `svg` in one example: rendered box, viewBox, and how much of it the ink fills.                                                                                                 |
| `focusshot.mjs`     | One example with a control focused, captured on both sides. For looking at a ring rather than counting it.                                                                           |

## Notes

- `@tecton/react/icons` is **not** rewritten for the neutral side. Both renders
  draw the same Tecton glyphs, so an icon that measures differently measures
  differently because of the theme.
- Differences the type scale explains are bucketed separately and are not
  findings: Tecton's ladder is not upstream's, and that is the point of it.
- A handful of examples lay out to tens of thousands of pixels and can take the
  renderer down. The driver notices a crashed page, relaunches, and carries on;
  screenshots are viewport-sized for the same reason.
