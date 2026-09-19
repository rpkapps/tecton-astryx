# Progress

## Sources
- `078_components-progress__circular-matrix.png`
- `079_components-progress__linear-matrix.png`
- `080_components-progress__overview.png` (docs page, 3200×2526 — includes a Parameters table)

## Anatomy
**Linear:** a thin horizontal track with a filled portion from the left, plus an optional percentage label to the right of the bar ("50%").
**Circular:** a ring with a coloured arc from 12 o'clock clockwise, plus an optional percentage label centred inside the ring ("99%", "50%").

## Variants
### Linear — `type` (row labels on 079)
- **Determinate** — solid fill up to `value`; the remainder of the track is a mid grey.
- **Buffer** — solid fill to `value`, then a **dotted/stippled segment** in a dimmed version of the accent colour out to `valueBuffer`, then the plain track. The stipple is clearly a dot pattern, not a solid tint.
- **Indeterminate** — the whole track is filled with a flat, desaturated version of the accent (no animation captured); the "50%" label is still rendered beside it.

### Colour (column headers on 079, and row labels on 078)
- **Primary** — pale lilac-grey `~#b8b4bc` (essentially neutral).
- **Secondary** — **teal/azure** `~#2eb8b8–#32c9c9`.
- **Tertiary** — **lime/olive green** `~#9fc243–#b0d54e`.
- **Inherit** (circular only) — pure white, taking the surrounding text colour.

This is the **only place in the component set where teal and lime are used as functional accent colours.**

## Sizes
- **Linear**: one thickness, ~3px track (6 device px), full container width.
- **Circular**: two, labelled as the column headers on 078: **32px** and **16px**. The `circularSize` parameter defaults to 32. The 16px ring shows no label (too small for the text).

## States
No interaction states — Progress is a display component. The "states" are the three linear `type` values.

## Shape and spacing
- Linear track has **rounded caps** (fully rounded ends on both the track and the filled portion).
- The percentage label sits ~14px to the right of the bar, vertically centred.
- Circular ring stroke ~2.5–3px at 32px, ~2px at 16px; the arc has rounded caps; the label is centred.

## Typography
Percentage labels are ~13px **medium/semibold** and near-white, noticeably heavier than body text; the circular 32px label is ~10px and still bold.

## Colour notes
- Unfilled track: mid grey `~#6e6873`, i.e. quite visible, not a faint rail.
- Primary accent is barely distinguishable from the track — primary linear progress reads as "slightly lighter grey on grey".
- Secondary teal `#2eb8b8`, Tertiary lime `#b0d54e` are far more legible than Primary.

## Notable details
### Prose from the overview page, quoted verbatim
> "Use progress indicators when work is happening and users need feedback that the system has not stalled. For status messages or next steps, consider Alert instead."

> **Linear progress** — "Use linear progress when the indicator belongs to a region, task, or page-level process."

> **Circular progress** — "Use circular progress for compact loading states where space is limited."

A "Related Components" box lists **Alert** and **Button**. A "Related Stories" section lists **Linear Matrix** — "Linear progress types across color roles." and **Circular Matrix** — "Circular progress colors and sizes."

### Parameters table (from the overview page, verbatim)
| Name | Type | Description | Default |
|---|---|---|---|
| `type` | string | "Linear progress behavior." | `determinate` |
| `color` | string | "Linear accent color." | `primary` |
| `value` | number | "Progress value." | `50` |
| `valueBuffer` | number | "Buffer value used when type is buffer." | `80` |
| `label` | boolean | "Show progress text." | `true` |
| `circularColor` | string | "Circular accent color." | `primary` |
| `circularSize` | number | "Circular diameter." | `32` |

This is the only component page in the set that exposes a machine-readable prop table — it confirms that linear and circular colour/size are **separate props on one component**, not two components.

### Other
- The buffer segment's **dotted texture** is a distinctive detail most libraries render as a flat tint.
- Indeterminate renders as a static full-width desaturated bar in the capture; any animation is not visible in a screenshot.
