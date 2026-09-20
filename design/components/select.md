# Select

## Sources
- `084_components-select__figma-variant-matrix.png`
- `086_components-select__variant-matrix.png`

## Anatomy
Identical to TextField plus a dropdown affordance:
1. **Field label** — "Field label" / "Label" above the control; pink when focused, red on error.
2. **Leading icon** — a magnifier glyph (present in every Select cell on both pages, unlike TextField where it is optional).
3. **Value** — "Option 1".
4. **Trailing chevron** — chevron-down, at the right edge inside the field.
5. **Helper text** — "Helper text", or "Validation failed" in red on error.

No open-menu state is captured for Select (the popup list only appears on the Autocomplete story).

## Variants
Section headings: **Outlined**, **Filled**, **TextOnly** — the same three as TextField and Autocomplete, with the same treatments (border / fill-no-border / bottom-rule-only).

## Sizes
From the Figma matrix headings **Medium** and **Small**, with frame sizes printed on every cell:
- Medium `220×52` → measured **field height 32px**.
- Small `220×48` → measured **field height 28px**.

## States
Column labels (086): **Enabled, Hovered, Focused, Pressed, Active, Disabled, Error**. The Figma matrix (084) calls the fifth one **Enabled + Active**.

| State | Notes |
|---|---|
| Enabled | resting look per variant |
| Hovered | border/fill brightens one step |
| Focused | 2px hot-pink `#ff52a8` ring, **field label turns pink**, interior darkens; TextOnly grows a full box |
| Pressed | one step brighter than hover |
| Active / Enabled + Active | interior becomes a **violet-tinted near-black** (`~#241b2b`) while the border stays normal — this is the "menu is open / control engaged" look |
| Disabled | everything dims to `~#4b4a4d`; **Filled additionally gets a dotted 2px bottom rule** |
| Error | Outlined: red border + red label + red "Validation failed". **Filled: the entire field fills solid salmon `#c37b75`** with white value text and a dimmed chevron. TextOnly: red label, red bottom rule, red helper |

## Shape and spacing
- Radius 4px on Outlined and Filled; TextOnly is a bare bottom rule.
- Leading icon ~12px from the left with ~8px before the value; chevron ~12px from the right.
- Label ~6px above, helper ~6px below.

## Typography
Label/helper ~12–13px; value ~14px regular.

## Colour notes
Identical palette to TextField: border `~#57515c`, fill `~#312839`, active interior `~#241b2b`, focus `#ff52a8`, error `~#c16e6c` / `#c37b75`.

## Notable details
- Page heading, verbatim: "Figma Matrix (Node 13886:2473)"; cell captions like "Enabled (220x52)", "Enabled + Active (152x52)", "Disabled (220x48)".
- One cell on 084 is captioned **"Enabled + Active (152x52)"** — a narrower frame than its neighbours; that looks like an inconsistency in the Figma source rather than a design intent.
- Select and TextField are visually the same component with a chevron added; the leading magnifier icon in the demos is demo content, not necessarily part of Select.
- **No multi-select, no option-group, no open-menu state** is documented for Select anywhere in this set.
