# Switch

## Sources
- `092_components-switch__state-matrix.png`

## Anatomy
1. **Track** — a pill. When off it is an **outline only** (1px light mauve border, transparent interior). When on it is a **solid violet fill**.
2. **Knob** — a filled circle inside the track, at the left when off and at the right when on. Off knob is a light mauve; on knob is near-white.

No label slot, no icons inside the knob.

## Variants
None beyond size and state.

## Sizes
Two, as section headings: **Medium** and **Small**.
- Medium: track **~34 × 16px**, knob ~10px.
- Small: track **~28 × 14px**, knob ~8px.

## States
Column labels, verbatim: **Off, On, Disabled off, Disabled on**.

| State | Track | Knob |
|---|---|---|
| Off | transparent with a 1px `#aaa1b2` border | light mauve `~#aaa1b2`, at the left |
| On | solid violet `#80708b` | near-white `#e5e0eb`, at the right |
| Disabled off | transparent with a dim `~#4b4a4d` border | dim grey knob |
| Disabled on | solid neutral grey `~#57515c` (**the violet is discarded**) | light grey knob at the right |

No hover, pressed or focus columns.

## Shape and spacing
- Track is a full pill (radius = half the height).
- Knob is inset ~2px from the track edge; the travel distance is track width minus knob diameter minus padding.
- Off state's outline-only track is unusual — most systems fill the off track with a grey.

## Typography
Not applicable. Column captions are the small muted style; "Medium"/"Small" are slightly larger muted text.

## Colour notes
- On fill `#80708b` (violet-370) — the same value as Button primary *pressed*, not Button primary enabled.
- Off border and knob `#aaa1b2` (mauve-680).
- On knob `#e5e0eb`.
- Disabled-on track `~#57515c`.

## Notable details
- No prose captions.
- **The off track is an outline, not a filled grey pill** — a distinctive, low-ink treatment.
- **Disabled-on drops the violet to neutral grey**, so you cannot tell a disabled-on switch from a generic grey toggle at a glance.
- No focus state is documented for Switch, unlike Checkbox.
