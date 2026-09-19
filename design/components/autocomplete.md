# Autocomplete

## Sources
- `009_components-autocomplete__figma-variants.png`
- `010_components-autocomplete__keyboard-controls.png`
- `012_components-autocomplete__variant-matrix.png`

## Anatomy
1. **Field label** — "Fruit", above the control, small muted text. Turns red in the Error state.
2. **Input surface** — single-line text input; value shown as plain text ("Apple") or placeholder ("Type a fruit", dimmer).
3. **Token / chip row (multi-select mode)** — selected values render as small pill chips *inside* the input, before the caret: "Apple ⊗", "Blueberry ⊗", each with its own small circled-X remove affordance (story 009).
4. **Clear button** — an `X` icon at the right of the input, before the chevron.
5. **Dropdown toggle** — chevron-down (closed) / chevron-up (open), right-most.
6. **Helper text** — small muted line below the field ("Helper text"); in Error it reads "Validation failed" in red.
7. **Popup list** — a dark elevated panel below the field with a 1px border; each option row has a **leading outline "cube" icon** plus the option label (Apple, Apricot, Banana, Blueberry, Cherry, Grape …). The list clips at the panel edge and scrolls.

## Variants
Named section headings on the variant matrix (012), reading top to bottom:
- **Outlined** — transparent fill, 1px grey border (~#57515c) all round, ~4px radius.
- **Filled** — solid dark mauve fill (~#312839–#382d3e), **no border** in the resting state; the surface itself defines the field.
- **TextOnly** — no fill and no border at all; only the value text, the clear X and the chevron sit on the page background. Focus is the only state that draws a box.

Story 009 ("figma variants") shows the same control in **single-value** and **multi-value (tokenised)** forms, each in a closed and an open state — so tokenisation is an orthogonal option, not one of the three named variants.

## Sizes
One size only. Field height ≈ 40px in all three variants (the tokenised field is the same height, with the chips sized to fit inside it). Label sits ~6px above the field; helper text ~6px below.

## States
Columns across the matrix (012), in order: **Enabled, Hovered, Focused, Pressed, Active, Disabled, Error**. Not every variant shows every column (Outlined shows all seven; Filled and TextOnly show Enabled/Hovered/Focused/Pressed/Disabled/Error, with Active demonstrated once on the Outlined row).

| State | Outlined | Filled | TextOnly |
|---|---|---|---|
| Enabled | grey 1px border, transparent fill | dark mauve fill, no border | nothing but text + icons |
| Hovered | border brightens slightly; a faint fill appears | fill lightens a step (~#3a3142) | a faint fill/no visible change besides text brightening |
| Focused | **2px hot-pink ring (#ff52a8)** around the field, field label also turns pink, fill darkens to near-black inside the ring | same pink ring; fill inside the ring goes darker than the resting fill | pink ring appears around an otherwise chrome-less field, giving it a box it does not normally have |
| Pressed | border slightly brighter than hover, fill a touch lighter | fill lighter again (~#3f3547), still no border | text brightens; still no box |
| Active (open) | field keeps a light border and the chevron flips to up; the popup list is attached directly below with no gap | (shown on Outlined only) | (shown on Outlined only) |
| Disabled | border and text drop to a dim grey (~35–40% opacity); the clear X is removed, only the chevron remains | fill darkens to nearly the page colour **and a dotted/dashed 2px bottom rule appears under the field** (mid-grey dashes) — the disabled-filled signature; clear X removed | text dims to grey; chevron dims; no box |
| Error | border and label and helper text all red/salmon (~#c16e6c); value text stays light | **the whole field fills with the salmon red (~#c37b75) and the value text is drawn in white on it** — a very loud treatment unlike the other variants | label and helper text red, value text normal, no fill |

Focused in all three variants also **recolours the field label to hot pink**.

## Shape and spacing
- Field corner radius ~4px; the focus ring follows the same radius with ~1px offset.
- Horizontal padding ~12px; gap between the clear X and the chevron ~8px.
- Chips inside a tokenised field: fully rounded pill, ~24px tall, ~6px gap between chips, ~8px before the caret text.
- Dropdown panel: same width as the field, ~4px radius, 1px border, rows ~35px tall with ~16px left padding and a ~12px gap between the row icon and the label.

## Typography
Label and helper text: small (~12–13px) regular. Value text: ~14px regular. Option rows in the popup: ~14px regular. Chip labels: ~12px.

## Colour notes
- Outlined border: ~#57515c resting, brighter on hover.
- Filled surface: ~#312839 resting, lightening through ~#3a3142 (hover) to ~#3f3547 (pressed).
- Popup surface: very dark (~#1e1922) with a 1px ~#3a343e border — it is *darker* than the filled field, so the menu reads as a recessed panel rather than a raised one.
- Focus ring and focused label: #ff52a8.
- Error red: ~#c16e6c text/border, ~#c37b75 for the filled error surface.
- Chip fill inside the input: mauve ~#4a4152 with a lighter label.

## Notable details
- No prose captions on any autocomplete page; only the variant headings ("Outlined", "Filled", "TextOnly") and state labels.
- The **disabled Filled field's dotted bottom rule** is unique to disabled-filled (it also appears on the Textfield and Select stories) — it reads as a "this control exists but is inert" marker.
- The **Filled + Error field inverts to a solid red surface**, which is a much stronger error treatment than Outlined/TextOnly get.
- The popup list renders a leading icon per option by default in these stories; whether the icon is required or just demo data is unclear.
- `010` (keyboard controls) shows only the resting empty field with the placeholder "Type a fruit" — the keyboard interaction itself is not captured in the static screenshot.
