# Radio

## Sources
- `082_components-radio__variant-matrix.png`
- `083_components-radio__with-labels.png`

## Anatomy
1. **Ring** — an unfilled circle with a ~1px light border.
2. **Dot** — a filled inner circle, roughly 45–50% of the ring diameter, appearing when checked. It is **light/near-white**, matching the checkbox's "bright chip" selection logic.
3. **Label** (story 083) — text to the right of the control, vertically centred, ~8px gap.
4. **Group label** (story 083) — "Choose one" above the stack, in the muted caption style.

## Variants
No style variants. The value states are the only axis: **Unchecked**, **Checked**, and the disabled forms of each.

## Sizes
Two, given as the page's section headings: **Medium** and **Small**.
- Medium ring ≈ 16px; Small ring ≈ 13–14px. The dot scales proportionally.

## States
Column labels on 082, verbatim: **Unchecked, Checked, Disabled, Disabled checked**.
| State | Appearance |
|---|---|
| Unchecked | 1px light `~#bab3c0` ring, transparent centre |
| Checked | brighter ring plus a filled near-white dot in the centre |
| Disabled | ring drops to a dim `~#4b4a4d` grey; no fill |
| Disabled checked | dim grey ring with a dim grey dot (`~#57515c`); much lower contrast than checked |

Story 083 adds one more observation: the **label dims with the control** — "Disabled option" is rendered in a grey ~#57515c while "Option one"/"Option two" are near-white.

**Hover, pressed and focus are not shown for Radio** — unlike Checkbox, which has all five columns. (Observation; whether Radio genuinely lacks a hover halo is unknown.)

## Shape and spacing
- Perfect circle, no radius question.
- In the labelled list (083) rows are ~24px apart (tight vertical rhythm), with the control's centre aligned to the label's text centre.
- Control-to-label gap ~8px.
- Group label "Choose one" sits ~10px above the first option.

## Typography
Labels ~14px regular, near-white (`#f7f6f8`). Group label ~13px, muted (`~#98939d`). The size section headings "Medium"/"Small" on 082 are ~16px medium-weight white.

## Colour notes
- Ring `~#bab3c0`; checked dot near-white `~#e3e0e8`.
- Disabled ring `~#4b4a4d`; disabled dot `~#57515c`.
- No accent colour is used for selection.

## Notable details
- No prose captions on either page.
- Radio's state coverage is thinner than Checkbox's (no hover/focus/pressed columns), so the hover halo and pink focus ring behaviour has to be inferred from Checkbox.
- The "Disabled checked" case keeps the dot visible rather than hiding it, so a disabled selection is still readable.
