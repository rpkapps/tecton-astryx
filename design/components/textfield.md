# TextField

## Sources
- `103_components-textfield__figma-variant-matrix.png`
- `105_components-textfield__variant-matrix.png`

## Anatomy
1. **Field label** — "Field label" / "Label", above the control, small and muted. Turns **hot pink** when focused and **red** when in error.
2. **Leading icon** (optional) — a magnifier glyph in the Figma matrix (103); absent in 105.
3. **Value / placeholder** — "Value" (filled) or "Type here" (placeholder, dimmer).
4. **Field surface** — outline, fill, or underline depending on the variant.
5. **Helper text** — "Helper text" below the field; replaced by "Validation failed" in red in the Error state.

## Variants
Section headings on both pages: **Outlined**, **Filled**, **TextOnly**.
| Variant | Resting appearance |
|---|---|
| **Outlined** | transparent fill, 1px grey border on all four sides, ~4px radius |
| **Filled** | solid dark mauve fill `~#312839`, **no border**, ~4px radius |
| **TextOnly** | **no box at all — only a 1px bottom rule** under the value (an underline-style field). Focus is the only state that draws a full box |

## Sizes
Two, from the Figma matrix headings **Medium** and **Small**, with the Figma frame sizes printed on every cell:
- Medium: frame `220×52` → **field height 32px** (label ~14px + ~6px gap + 32px field).
- Small: frame `220×48` → **field height 28px**.
(A few TextOnly cells are labelled `220×58` / `220×52` because the focused/error variants add a box or a second line.)

## States
Column labels (105): **Enabled, Hovered, Focused, Pressed, Disabled, Error**. The Figma matrix (103) adds **Enabled + Active**.

| State | Outlined | Filled | TextOnly |
|---|---|---|---|
| Enabled | grey 1px border | dark mauve fill | 1px bottom rule only |
| Hovered | border brightens; slight fill appears | fill lightens a step | bottom rule brightens |
| Focused | **2px hot-pink `#ff52a8` ring** around the field; the **field label also turns hot pink**; interior goes darker than resting | pink ring; interior darkens | **a full pink box appears** where there was only an underline — the field visually grows a border |
| Pressed | border brighter still, fill a touch lighter | fill lighter again | rule brightens; value brightens |
| Enabled + Active | a very dark, slightly violet interior (`~#241b2b`) with a normal border — the "has focus but not focus-ringed / actively editing" look | same darker interior, retains fill | dark violet band appears behind the value |
| Disabled | border and text dim to `~#4b4a4d`; helper text dims | fill darkens to near page colour **and a dotted 2px bottom rule appears** — the disabled-filled signature | value and rule both dim |
| Error | border, label and helper ("Validation failed") all red `~#c16e6c`; value stays light | **the whole field fills solid salmon `#c37b75` with white value text** | label and helper red; the bottom rule turns red; value stays light |

## Shape and spacing
- Outlined/Filled radius **4px**; the focus ring follows it with ~1px offset.
- Horizontal padding ~12px; leading icon at ~12px with ~8px before the value.
- Label sits ~6px above the field; helper text ~6px below.
- TextOnly's rule spans the full field width.

## Typography
Label and helper ~12–13px regular; value ~14px regular. Error helper text is the same size in red.

## Colour notes
- Outlined border `~#57515c`; Filled surface `~#312839`.
- `Enabled + Active` interior is a distinctly **violet-tinted near-black** (`~#241b2b`), different from any other state.
- Focus ring and focused label `#ff52a8`.
- Error red `~#c16e6c` for ink/border, `#c37b75` for the filled error surface.

## Notable details
- Page headings, verbatim: "Figma Matrix (Node 14095:8131)", "Medium", "Small", "Outlined", "Filled", "TextOnly"; each cell is captioned with its state and Figma frame size, e.g. "Enabled (220x52)", "Enabled + Active (220x52)", "Error (220x58)".
- **The dotted bottom rule on disabled+filled** is a signature detail shared with Select and Autocomplete.
- **Filled + Error inverts to a solid red surface** — a far louder error treatment than Outlined or TextOnly get.
- **Focus turns the field label pink**, which means the pink is not just a ring colour but a focus *ink* colour.
- TextOnly gaining a full box on focus is a size-changing state (the Figma labels record 220×52 → 220×58), so layouts must reserve the extra height.
