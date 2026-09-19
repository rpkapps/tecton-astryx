# Accordion

## Sources
- `001_components-accordion__disabled-with-actions.png`
- `002_components-accordion__group.png`
- `004_components-accordion__state-matrix.png`
- `005_components-accordion__with-secondary-and-actions.png`

## Anatomy
Observed, left to right inside the header row:
1. **Leading icon** (optional) — outline "cube / package" glyph, ~20px, same colour as the label (stories 001/005).
2. **Label** — "Accordion Label", left aligned, primary text colour.
3. **Secondary text** (optional) — "Secondary Text", set in a dimmer colour, positioned in a second column roughly one third across the header (not immediately after the label; it looks like a fixed second slot, left-aligned within its own column).
4. **Action slot** (optional) — a row of small icon buttons pushed to the right: edit/pencil-in-square, gear/settings, trash, then a vertical "kebab" (three dots) overflow.
5. **Expand chevron** — always the right-most element; chevron-down when collapsed, chevron-up when expanded.
6. **Content panel** — appears below the header when expanded: a separate, lighter rounded rectangle spanning the accordion's full width. In the state matrix it is an empty placeholder block ~30px tall; in the Activated row it is taller and visually merged with the header into one continuous lighter block.

## Variants
The stories do not label "variants" by name; the axes shown are structural options:
- **Header content options**: label only; label + leading icon; label + leading icon + secondary text + actions (001/005).
- **Group: "No dividers"** — items stacked with no rules between them; the expanded item is a self-contained rounded lighter card with a visible 1px lighter border.
- **Group: "Dividers"** — the same stack with a thin horizontal hairline rule above the first item and between items; the expanded item's lighter card sits on top of the rule pattern. Rules are very low-contrast (barely above the page background, ~#2c2730).

## Sizes
Only one size is shown. Header row height measures roughly 40px at 1x (header rows in the state matrix are ~40px tall with ~10–12px vertical padding); the group story's rows are the same height. No sm/md/lg axis appears anywhere.

## States
The state matrix (004) is a 2-column grid: **Collapsed** and **Expanded**; rows are the states.
| State | Header appearance | Notes |
|---|---|---|
| Enabled | No fill at all — transparent on the page background; label in near-white (~#f7f6f8), chevron in mid-grey | The expanded row still shows the lighter content block below |
| Hovered | Header gains a filled rounded rectangle in a lighter mauve-grey (~#403a46 / mauve 140–160) | Content block below stays darker than the header |
| Focused | Same transparent/very dark fill as enabled, plus a **1–2px hot-pink outline** (~#ff52a8) around the header only, with the accordion's corner radius | The focus ring wraps the header row, not the content |
| Pressed | Filled like hover but slightly darker/denser (~#3b353f) | Very close to hover; the difference is small |
| Disabled | Header transparent; label, icon, chevron and actions all drop to a low-opacity grey (~#4e4853, reads as ~35–40% opacity) | Story 001 is the same composition as 005 but with everything dimmed; the expanded **content block keeps its normal lighter fill** and is not dimmed |
| Activated | Header filled in the same lighter mauve as hover; in the Expanded column the header + content merge into one continuous taller lighter block (no seam between header and content) | "Activated" appears to mean "this accordion is the selected/open one" |

## Shape and spacing
- Corner radius on header fill and content block: small, ~4px (clearly rounded but not pill; consistent with the 4px radius used by textfields and menus elsewhere).
- Header horizontal padding ~12px; icon-to-label gap ~12px; action icons spaced ~8px apart with the kebab slightly separated before the chevron.
- Vertical gap between header and the content block when expanded: ~6–8px in the non-activated states; zero in the Activated state (merged).
- In the group story items are flush (no gap) in the dividers variant and ~0–4px apart in the no-dividers variant.

## Typography
Label: regular weight sans (looks like the body/label style, ~14px, weight 400–500), same size as menu-item and list labels. Secondary text is the same size but lower-contrast grey. Section captions on the story page ("Collapsed", "Expanded", "Enabled", "No dividers", "Dividers") are the smaller muted caption style.

## Colour notes
- Page background: near-black graphite ~#1a171b–#1e1922.
- Hover/pressed/activated header fill: mauve-grey ~#3e3844–#443d49 (mauve 140–160 range).
- Expanded content placeholder block: ~#3a343e–#443d49, i.e. slightly lighter than the page, roughly the same family as the hover fill.
- Focus ring: hot pink #ff52a8.
- Label text: #f7f6f8; secondary text and chevron: ~#98939d; disabled text: ~#4e4853.
- Divider rules: ~#2c2730, only just visible.

## Notable details
- Captions written on the pages are single words only: "Collapsed", "Expanded", "Enabled", "Hovered", "Focused", "Pressed", "Disabled", "Activated", "No dividers", "Dividers". No prose captions on any accordion story.
- The **disabled accordion keeps its action icons rendered** (edit, settings, delete, kebab) rather than removing them; they are simply dimmed with the rest of the header.
- In the Disabled + Expanded cell the content panel is *not* dimmed — only the header chrome is. (Observation; may be a story artefact rather than intent.)
- The secondary text sits in its own column at a fixed offset, which suggests a two-column header layout rather than inline text.
