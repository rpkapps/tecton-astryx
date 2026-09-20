# Button

## Sources
- `037_components-button__variant-matrix.png`
(Also seen in composition on the panel stories 117–124 and inside `button-group` stories 032/035.)

## Anatomy
- **Label** — the only part shown in the matrix ("Label"), horizontally and vertically centred.
- (Leading/trailing icon slots are not exercised on this page; icon-bearing buttons appear on the panel pages, where an icon sits left of the label with ~8px gap.)

## Variants
Row labels on the matrix, in order: `primary (md)`, `primary (sm)`, `secondary (md)`, `secondary (sm)`, `tertiary (md)`, `tertiary (sm)`, `outlined (md)`, `outlined (sm)`, `textOnly (md)`, `textOnly (sm)`.

| Variant | Fill | Border | Label colour |
|---|---|---|---|
| **primary** | solid mid violet-mauve `#5d4d68` | none | near-white lilac `#e5e0eb` |
| **secondary** | solid dark graphite `#3a343e` | none | light mauve `#bab3c0` |
| **tertiary** | **none** when enabled (page background shows through); a fill appears only on hover/pressed/activated | none | light mauve `#bab3c0` |
| **outlined** | none when enabled | **1px `#aaa1b2`** (mauve-680) | mauve `#aaa1b2` |
| **textOnly** | none in every state except focus | none | dimmest mauve `#9a91a2` |

The ladder is consistent: each step down removes one piece of chrome (filled bright → filled dark → ghost-with-hover-fill → outline → nothing) and the label gets one step dimmer.

## Sizes
Two sizes only: **md** and **sm**.
- md: **32px** tall (64px in the 2× capture), horizontal padding ~14px.
- sm: **28px** tall (56px at 2×), horizontal padding ~12px, slightly smaller label.
Corner radius is the same for both.

## States
Column headers: **Enabled, Hover, Pressed, Focus, Disabled, Activated**. Measured fills (md row):

| Variant | Enabled | Hover | Pressed | Focus | Disabled | Activated |
|---|---|---|---|---|---|---|
| primary | `#5d4d68` | `#74647f` | `#80708b` | `#74647f` + pink ring | `#111012` (near-black), text `#545356` | `#80708b` |
| secondary | `#3a343e` | `#514659` | `#5a4f62` | `#514659` + pink ring | `#111012`, dim text | `#5a4f62` |
| tertiary | none (`#1d1c1f` page) | `#3a343e` | `#433d47` | `#3a343e` + pink ring | `#111012`, dim text | `#433d47` |
| outlined | none, 1px `#aaa1b2` border | `#433d47` fill, border brightens | `#4e4853` fill | `#433d47` fill + pink ring | **no fill**, border and text dim to ~`#4b4a4d` | `#4e4853` fill |
| textOnly | nothing | nothing (label brightens to ~`#bcb2c4`) | nothing (label brightens) | **`#0e0e0f` fill — darker than the page** + pink ring | label `#4b4a4d` | nothing, label `#beb1c8` |

Consistent rules observed:
- **Hover lightens the fill one step; Pressed lightens it a second step.**
- **Activated is visually identical to Pressed** (same fill, same label), so activated = "stuck in the pressed look".
- **Focus is Hover's fill plus a hot-pink `#ff52a8` ring** drawn ~1px outside the button edge with a ~1px gap; the ring follows the button's radius. Focus does not change the fill beyond the hover step.
- **Disabled for the filled/ghost variants is a near-black recessed fill `#111012`, darker than the page background**, with a ~#4b4a4d label — a distinctive "carved out" look rather than a simple opacity drop. Outlined and textOnly get no fill, just dimmed ink.

## Shape and spacing
- Corner radius **4px** (8 device px), the same at both sizes — clearly rounded, well short of a pill.
- Label has ~12–14px of horizontal padding; the button hugs its text (no min width visible).
- Focus ring offset ~1px.

## Typography
Label is a medium-weight sans (~500), ~14px at md and ~13px at sm; no uppercasing, no letter-spacing change.

## Colour notes
- Story page background measures **`#1d1c1f`** (a very dark warm graphite), which is what "no fill" variants show through.
- The primary fill sits in the violet ramp (`violet-220 #5d4d68` → `violet-310 #74647f` → `violet-370 #80708b`); secondary and tertiary use the graphite/mauve ramp.
- Label ink ladder: `#e5e0eb` (primary) > `#bab3c0` (secondary, tertiary) > `#aaa1b2` (outlined) > `#9a91a2` (textOnly).
- Focus ring: `#ff52a8`.

## Notable details
- Caption written at the foot of the page, quoted verbatim: **"Hover, Pressed, and Focus are forced visual QA states that match the Figma component set."**
- There is **no destructive/danger button variant** and no colour prop — the button is monochrome apart from the focus ring.
- textOnly's focus state painting a *darker-than-page* fill is unusual and easy to miss.
- Disabled is not an opacity filter: the fill is replaced with a specific near-black value.
