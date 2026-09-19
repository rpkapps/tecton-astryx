# Chip

## Sources
- `042_components-chip__variant-matrix.png` (a tall page, 3200×3264)

## Anatomy
1. **Label** — "Chip" / "Clickable" / "Disabled" / "Deletable".
2. **Trailing delete affordance** (optional) — a small `×` glyph at the right end of the pill, inside the chip's fill/border, with ~6px of space before it.
3. No leading-icon or avatar slot is shown on this page. (A tokenised Autocomplete field, story 009, shows a chip-like token with a *circled* `⊗` remove icon, which is a slightly different glyph from the plain `×` used here.)

## Variants
The page is organised as **colour section → emphasis column → behaviour row → size**.

**Colour** (section headings, in order): **Default, Primary, Error, Warning, Info, Success**.

**Emphasis** (the two column groups inside every section, labelled on the page): **Filled** and **Outlined**.

| Colour | Filled fill | Filled label | Outlined border + label |
|---|---|---|---|
| Default | dark graphite `#2c2b2e` | light `#c8c7ca` | grey border, light grey label |
| Primary | violet `#5d4d68` | near-white `#e5e0eb` | violet-grey border, light label |
| Error | salmon red `#c16e6c` | near-black | `#c16e6c` border, `#cc7f7d` label |
| Warning | amber `#e59306` | near-black | amber border, amber label |
| Info | blue `#6086d2` | near-black | blue border, blue label |
| Success | green `#4fa66f` | near-black | green border, green label |

Note the split: **Default and Primary are dark fills with light text; the four semantic colours are bright fills with dark text** — the same inversion the Alert component uses.

**Behaviour** (row labels are the chip's own text, which doubles as the caption):
- `Chip` — static/display chip.
- `Clickable` — visually identical to `Chip` in the resting state (no extra chrome captured); differs only by being interactive.
- `Disabled` — colour is dropped entirely: a flat grey fill (~`#2c2b2e`) with `~#545356` text for Filled, and a dim grey border for Outlined. **All six colours render the same disabled appearance.**
- `Deletable` — as `Chip` plus the trailing `×`.

## Sizes
Three per row, largest to smallest, unlabelled on the page but consistent everywhere. Measured heights:
- **lg ≈ 24px** (48 device px)
- **md ≈ 20px** (40 device px)
- **sm ≈ 18px** (36 device px)
Label size and horizontal padding scale with them (lg label ~14px, sm label ~11px).

## States
No hover/pressed/focus columns. The only state shown is **Disabled**, which is a whole row rather than a column.

## Shape and spacing
- **Full pill** — border radius = half the height at every size.
- Horizontal padding ~10px at lg, ~8px at md, ~6px at sm.
- The `×` sits inside the pill with ~6px before it and ~8px of padding after it.
- Outlined border is 1px.
- Chips in a row are separated by ~12–16px.

## Typography
Label is regular weight; ~14px (lg), ~12px (md), ~11px (sm). No uppercasing.

## Colour notes
- Page background `#1d1c1f`; the Outlined interior is that same background (fully transparent).
- Semantic fills match the base ramps: red `#c16e6c` (red-460), amber `#e59306` (yellow-680), blue `#6086d2` (blue-460), green `#4fa66f` (green-560).
- Outlined labels are a step lighter than the corresponding fill (e.g. error label `#cc7f7d` vs fill `#c16e6c`) so they read on the dark background.

## Notable details
- No prose captions; the only text on the page is the section headings, "Filled"/"Outlined" labels, and the chips' own text.
- **Disabled discards the colour**, which means a disabled error chip and a disabled success chip look identical — worth flagging for re-implementation.
- Chip is the system's only standalone pill; Badge is strictly an overlay on another element.
- `Clickable` has no distinct resting appearance, so any hover/press affordance for it is undocumented by these captures.
