# FAB (Floating Action Button)

## Sources
- `053_components-fab__extended-all-colors.png`
- `054_components-fab__extended-no-icon.png`
- `056_components-fab__round-all-colors.png`
- `057_components-fab__sizes-medium-and-small.png`
- `058_components-fab__variant-matrix.png` (tall page, 3200×2396)

## Anatomy
1. **Icon** — a `+` (plus) outline glyph in all the demos; optional on the extended shape, required on the round shape.
2. **Label** — "Fab" / "Primary" / "Secondary" / etc., only on the extended shape.
3. **Elevation** — a soft drop shadow under the control. **FAB is the only component in the set with a visible shadow**; the shadow is a diffuse dark halo extending ~8–10px below the pill/circle.

## Variants
Two independent axes, both named as small-caps section headings on 058: `EXTENDED` and `ROUND`.

**Shape:**
- **Extended** — a horizontal pill with optional icon + label.
- **Round** — a circle containing only the icon.

**Emphasis** (column headings on 058, also the captions on 053/054/056): **Primary, Secondary, Tertiary, Outlined** — the same first four rungs as Button.
| Emphasis | Fill | Border | Ink |
|---|---|---|---|
| Primary | violet `#5d4d68` | none | near-white `#e5e0eb` |
| Secondary | dark graphite `#3a343e` | none | light mauve |
| Tertiary | **none** (icon + label float on the page with no chrome at all) | none | light mauve |
| Outlined | none | 1px light mauve | light mauve |

There is no `textOnly` FAB.

## Sizes
Named `size=medium` and `size=small` (rendered in italic on 058; captioned "Medium"/"Small" on 057). Measured:
| Shape | medium | small |
|---|---|---|
| Extended | **40px** tall (80 device px) | **~34px** tall (68 device px) |
| Round | **48px** diameter (96 device px) | **~34px** diameter (68 device px) |

(Observation: the round medium is *larger* than the extended medium's height, while at `small` both shapes land on the same ~34px. Worth verifying against source.)

## States
Row labels on 058 differ by shape.
- **Extended rows:** `With icon`, `No icon`, `Activated`, `Disabled`.
- **Round rows:** `Enabled`, `Activated`, `Disabled`.

| State | Appearance |
|---|---|
| Enabled / With icon / No icon | the resting look described above |
| Activated | the fill **lightens one clear step** (primary goes from `#5d4d68` to roughly `#80708b`); tertiary *gains* a fill (it is no longer chrome-less); outlined gains both a fill and a **brighter, thicker-looking white border** |
| Disabled | fill collapses to a near-black recessed block (same `#111012`-ish treatment as Button) and the icon/label drop to a dim grey; outlined keeps a very dim border with no fill; the drop shadow disappears |

No hover, pressed or focus rows are shown for FAB.

## Shape and spacing
- Extended: **full pill** radius (half the height) — noticeably rounder than Button's 4px.
- Round: circle.
- Extended horizontal padding ~16px (medium); icon-to-label gap ~10px.
- `No icon` extended FABs are noticeably narrower, with symmetric padding.
- Drop shadow: soft, roughly 8–12px blur, offset downward a few px, no visible spread ring.

## Typography
Label ~15px at medium, ~14px at small; regular/medium weight, same face as Button.

## Colour notes
- Primary fill `#5d4d68`, activated ~`#80708b` — matching Button's primary/pressed pair.
- Page background on these stories `#1d1c1f`; the shadow renders as a gradient down to `#171619` and back.

## Notable details
- Page headings and captions, verbatim: `EXTENDED`, `ROUND`, `size=medium`, `size=small`, `With icon`, `No icon`, `Activated`, `Disabled`, `Enabled`, and lower-case emphasis captions `primary`, `secondary`, `tertiary`, `outlined`.
- **The drop shadow is unique to FAB** in this component set — everything else is flat.
- `Tertiary` FAB with no chrome is effectively an icon+label on the page; in the Activated state it suddenly gains a pill fill, which is a large visual jump.
- The `Outlined` Activated cell has a distinctly brighter white ring than its enabled state — the strongest "selected" treatment of the four.
