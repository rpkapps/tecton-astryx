# Link

## Sources
- `069_components-link__variant-matrix.png`

## Anatomy
A text label ("Link") with an optional underline. No icon slot is shown.

## Variants
The two columns are the **underline policy**, labelled verbatim:
- `Underline=hover` — no underline at rest; the underline appears on hover, pressed and focus.
- `Underline=always` — underline present in every state including disabled.

There is no colour/emphasis variant — the link is the same near-white as body text.

## Sizes
One size, ~14px. No size axis.

## States
Row labels, verbatim: `State=enabled`, `State=hovered`, `State=pressed`, `State=focused`, `State=disabled`.

| State | Underline=hover column | Underline=always column |
|---|---|---|
| enabled | no underline; text near-white `#f7f6f8` | underlined, same text colour |
| hovered | **underline appears**; text unchanged | underlined, unchanged |
| pressed | underlined; text may dim a hair | underlined |
| focused | **a hot-pink `#ff52a8` rounded-rect ring** is drawn tightly around the word, with ~2px padding; the underline is present inside the ring | same, ring plus underline |
| disabled | no underline, text drops to a dim grey `~#57515c` | **still underlined**, in the same dim grey |

## Shape and spacing
- The focus ring is a rounded rectangle (~4px radius) hugging the text with ~2–3px padding — the text has no other box.
- Underline sits ~2px below the baseline, 1px thick, the same colour as the text.

## Typography
~14px regular weight, same face as body text; no colour differentiation from body copy at all — **the only affordance that marks a link is the underline**.

## Colour notes
- Enabled/hover/pressed text `#f7f6f8`.
- Disabled text `~#57515c`.
- Focus ring `#ff52a8`.
- No blue or accent link colour anywhere.

## Notable details
- No prose captions; only the axis labels.
- **Link carries no colour of its own.** In a dark product UI this means an inline link inside a paragraph is indistinguishable from its surroundings unless `Underline=always` is used — worth flagging.
- `Underline=always` + `disabled` keeps the underline, which is unusual (most systems drop it).
