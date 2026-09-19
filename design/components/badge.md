# Badge

## Sources
- `022_components-badge__dot-all-colors.png`
- `024_components-badge__standard-all-colors.png`
- `025_components-badge__standard-large-counts.png`
- `026_components-badge__variant-matrix.png`

## Anatomy
Badge is an **overlay on a child element**, not a standalone pill. Every story renders it over a plain dark circular placeholder (~48px, ~#2b292d) standing in for the badged content.
1. **Anchor / child** — the element being badged (the grey circle in all stories).
2. **Badge bubble** — positioned at the child's **top-right corner**, overlapping the child's edge (roughly centred on the corner so about half the bubble sits outside the child).
3. **Badge content** — a number, a number with a "+" overflow suffix, or nothing at all (dot variant).

## Variants
Two structural variants, named as the row labels of the matrix (026):
- **Standard** — a filled pill/circle containing a count. Content grows the pill horizontally: "1" and "9" are circles ~18px; "10" and "99" become slightly wider rounded pills; "99+" is a wider pill.
- **Dot** — a small filled circle ~8px with no content, sitting at the same corner position.

Colour is the second axis; column headers on the matrix read **Default, Primary, Secondary, Error, Warning, Info, Success**. Stories 022/024 repeat them as lowercase captions (`default, primary, secondary, error, warning, info, success`; the dot story omits `default`).

| Colour | Standard bubble fill | Numeral colour | Approx hex |
|---|---|---|---|
| Default | **no bubble at all** — the count is drawn as bare white text at the corner | near-white | text ~#f7f6f8 |
| Primary | very pale lilac/lavender | dark | ~#d8d5de–#e3e0e8 |
| Secondary | terracotta / muted orange-brown | dark | ~#c07a5e–#cc8a6a |
| Error | soft salmon-pink | dark | ~#eab5b3–#f0c0bd |
| Warning | pale saffron yellow | dark | ~#f5d98a–#fbd97e |
| Info | light periwinkle | dark | ~#aec4ee–#b7c9eb |
| Success | pale mint green | dark | ~#a8ddb9–#ace4bd |

The Dot variant uses the same seven hues but at the dot's 8px scale (dot colours read slightly more saturated because they are so small).

## Sizes
One size per variant: standard bubble ~18px tall, dot ~8px. Large-count story (025) shows the bubble widening to fit content rather than a size prop.

## States
No interactive state matrix. The only content states demonstrated (025) are count thresholds:
`1 → "1"`, `9 → "9"`, `10 → "10"`, `99 → "99"`, `100 → "99+"`, `999 → "99+"` — i.e. **the cap is 99 and anything above renders "99+"**.

## Shape and spacing
- Standard badge is a full pill (border-radius = half the height); single digits therefore read as perfect circles.
- Horizontal padding on multi-character content ~5–6px.
- Badge overlaps the anchor at the top-right; its centre sits roughly on the anchor's corner arc.
- No border or outline ring between badge and anchor in these stories (the badge sits directly on the anchor).

## Typography
Numerals ~11–12px, regular/medium weight, dark on the light fill. The "Default" colour is the only one with light text.

## Colour notes
- All badge fills are **light tints** (the 1000–1300 band of each ramp) with dark text — the same inversion logic as Avatar accents.
- The anchor placeholder circle is ~#2b292d on a ~#1a171b page.

## Notable details
- There are **no page captions or prose** on the badge stories; only the colour names and the count values beneath each example.
- `Default` behaves differently from every other colour: it renders the count as **bare text with no bubble**, which is easy to miss and is a real behavioural difference, not just a colour change.
- Standard and Dot use the same anchoring logic; the dot is simply an empty badge.
- Badge is always anchored to a child; no "standalone badge/pill" story exists (that role is filled by Chip).
