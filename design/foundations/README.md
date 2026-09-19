# Tecton foundations — transcription notes

These files are a verbatim transcription of four captured pages — `screenshots/114_foundations-colors__overview.png` (3200 x 28102, dark mode), `screenshots/116_foundations-typography__overview.png`, `screenshots/115_foundations-spacing-and-radius__overview.png` and `screenshots/129_welcome__welcome.png` — into machine-readable form: `colors.md` / `colors.json` hold **266 colour rows** in six sections (Text 6, Surfaces 6, Actions 87, Status 90, Accents 14, Component Tokens 63) with every column the page renders (Token, Value, Source token, React theme path, CSS variable); `typography.md` / `typography.json` hold all **16 variants** (display1–3, heading1–2, large, medium, mediumStrong, small, smallStrong, tiny, largeData, mediumData, smallData, actionMedium, actionSmall) with family stack, rem size, weight and line height as printed, plus derived px figures; `spacing-and-radius.md` / `spacing-and-radius.json` hold **20 spacing** and **7 radius** tokens with value, source token, CSS variable and TypeScript token; and `brand.md` records what the Welcome page states. Nothing was renamed, corrected or invented — values that the page truncates are recorded truncated, and every derived figure is labelled as derived.

## What could not be read

1. **CSS variable column is cut off.** The colour page's table overflows the captured viewport: no pixel is rendered past x=2813 of the 3200px-wide screenshot. Every CSS variable longer than roughly 26 characters is therefore only a visible prefix, recorded with a trailing `…` (for example every Actions row shows only `--tecton-color-action-prima…`). Only short variables are complete: `--tecton-color-text-primary`, `--tecton-color-text-inverse`, `--tecton-color-bg-default`, `--tecton-color-bg-paper`, `--tecton-color-bg-elevated`, `--tecton-color-focus-ring` and `--tecton-color-status-info`. The distinct prefixes that *are* visible were verified per group: `--tecton-color-action-{prima,secon,terti,outli,text-}…`, `--tecton-color-disabled-{fil,out,tex}…`, `--tecton-color-status-{succe,error,warni,info-,neutr}…`, `--tecton-color-accent-{lemon,graph,pink-,saffr,lime-,blue-,azure}…`, `--tecton-color-component-{ta,to,in,av,ba}…`.
2. **Source token and React theme path are ellipsised by the page itself** for long names, so e.g. `semantic.color.roles.action.primary.states…` cannot be resolved to the individual state key, and every Component Tokens row's theme path reads only `theme.palette.tecton.component.<group>.…`.
3. **Some token names are ellipsised**, which makes several Component Tokens rows indistinguishable by name alone. The collisions, with the values that distinguish them in page order:

   | Name as rendered | Rows sharing it (values in page order) |
   | --- | --- |
   | `input / outlined / states / active-…` | 5 — `#1e1922`, `#d8d5de`, `#bab3c0`, `#b8b4bc`, `#8b8293` |
   | `input / outlined / states / hover-…` | 3 — `#cac5d2`, `#aaa1b2`, `#a7a2ac` |
   | `input / outlined / states / focus-…` | 3 — `#cac5d2`, `#aaa1b2`, `#a7a2ac` |
   | `input / text-only / states / focus-…` | 3 — `#1e1922`, `#cac6ce`, `#aaa1b2` |
   | `input / text-only / states / hover-…` | 2 — `#cac6ce`, `#aaa1b2` |
   | `input / text-only / states / press-…` | 2 — `#e3e1e7`, `#cac5d2` |
   | `input / text-only / states / active…` | 2 — `#d8d6dc`, `#bab3c0` |

   Row order and value are preserved so the rows stay distinguishable positionally; the missing suffixes were **not** guessed. (The `input / outlined / states / press-c…`, `press-a…` and `press-…` rows happen to truncate to three different strings and so remain unique.)
4. **Every Component Tokens description is truncated** to `Component-scoped color token. Prefer …`.
5. **Several spacing descriptions are truncated** on their page: `space.25`, `space.75`, `space.150`, `space.200`, `space.250`, `space.1200` and `radius.100`.
6. **Welcome page text is partially occluded** by the wordmark and by the deliberate dimming of the background panels; `brand.md` records only text that is legible.

## Mismatches against `tokens/tecton.tokens.json`

There are **no value contradictions**: every one of the 266 hex values on the colour page (100 distinct values) occurs somewhere in `foundational.color.*`. That 266/266 hit rate also doubles as a read check — a mis-transcribed hex would almost certainly not land on a real palette entry. The differences are structural, and are recorded per row in `colors.json` (`resolvedFromJson` / `matchesJson` / `notes`) rather than resolved silently:

1. **The cited source paths are not in the tokens file at all.** The page cites `semantic.color.*` and `semantic.component.*` paths, while `tokens/tecton.tokens.json` contains only `foundational.color.*` (its single top-level branch is `foundational`, whose only child is `color`). So no row's `sourceToken` can be resolved against the file: `resolvedFromJson` is `null` and `matchesJson` is `null` for all **266** rows. The instruction to resolve `foundational.color.<family>.onDark.<stop>` paths does not apply to any row on this page.
2. **Light counterparts are derived by hex match, not by path.** Because no `onDark` path is cited, `light` was filled only where a value matches **exactly one** `foundational.color.<family>.onDark.*` token; the same path with `onDark` swapped for `onLight` was then resolved. That produced a light value for **200 of 266** rows (each annotated `light derived from onLight (<path>)`). Example: `#9a91a2` (`secondary Adornment`, `tertiary Adornment`, `textOnly Text`) matches only `foundational.color.mauve.onDark.560`, whose counterpart `foundational.color.mauve.onLight.560` is `#725687`.
3. **66 rows have no derived light value**, for three reasons:
   - **36 rows** match a `gray.onDark.contrasts.*` token, and the `gray` family has no `onLight.contrasts` sub-ramp (its `onLight` branch is a plain 50…1570 ramp), so there is no counterpart to swap to. Affected values: `#f6f5f8`, `#545356`, `#6a696c`, `#131214`, `#1d1c1f`, `#403f42`, `#323134`, `#4b4a4d`, `#959497`, `#c8c7ca`, `#2c2b2e`, `#b6b5b8`, `#a5a4a7`.
   - **21 rows** resolve to non-ramp `foundational.color.shades.*` entries (`#ffffff`, `#000000`, and the transparents `#ffffffb3`, `#ffffffcc`, `#ffffff80`, `#00000000`, `#00000080`, `#00000066`), which have no onDark/onLight pair. Note `#ffffff` and `#000000` also appear in the MPL and Colorcet data palettes.
   - **9 rows** match more than one `onDark` token, so the counterpart would be a guess: `#fbbc3b` (`yellow.onDark.1000` and `yellow.onDark.core.100`), `#b0d54e` (`lime.onDark.1000` and `lime.onDark.core.100`) and `#f7f6f8` (`mauve.onDark.1570`, `graphite.onDark.1570`, `violet.onDark.1570`).
4. **`foundational.scale.*` cannot be verified.** The spacing/radius page cites `foundational.scale.space.*` and `foundational.scale.borderRadius.*`; `foundational.scale` does not exist in the tokens file, so none of the 27 spacing/radius tokens could be cross-checked. This is noted on every record in `spacing-and-radius.json`.

## Oddities recorded as-is (not corrected)

- Two Surfaces rows cite `semantic.color.surface.elevation 1.backgro…` — with a literal space inside the path segment. Transcribed exactly as rendered.
- `Background paper` and `Background elevated` both show `#131214` and both cite the same (truncated) `elevation 1` source path, yet they are separate tokens with separate CSS variables.
- The typography page's **Data** section heading says "Numeric readouts use Figtree with tabular numbers", but the CSS printed for `largeData`, `mediumData` and `smallData` lists `"IBM Plex Mono", "Consolas", "Monaco", monospace`. Both are transcribed; the contradiction is the page's.
- The colour page shows one value per token with no light/dark columns, consistent with the capture being a dark-mode render.
- No reading was left ambiguous enough to need a `(?)` marker; where a value could not be read it is recorded as truncated (`…`) instead of guessed.
