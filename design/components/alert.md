# Alert

## Sources
- `006_components-alert__content-options.png`
- `008_components-alert__variant-matrix.png`

## Anatomy
A full-width rounded banner. Observed parts, left to right:
1. **Status icon** — 20–22px outline glyph, one per severity: exclamation-in-circle (error), triangle-with-! (warning), i-in-circle (info), check-in-circle (success). Vertically aligned to the title line, not centred on the whole box.
2. **Title** — bold, e.g. `{Title}`.
3. **Description** — regular weight, on the line below the title, indented to the same left edge as the title (i.e. text block is a column beside the icon).
4. **Action label** — plain text link/button reading "Label", right-aligned, on the title baseline.
5. **Dismiss button** — an X icon, the right-most element.

All four of title / description / action / dismiss are independently optional (story 006 shows title-only, description-only, title+description+action, title+description+dismiss).

## Variants
Two axes are shown.

**Emphasis (columns of the variant matrix):**
- **Filled / solid** (left column) — saturated coloured background with *dark* text and icon drawn on it (text is near-black/very dark of the same hue). No border.
- **Outlined** (right column) — transparent (page-background) fill, 1px border in the severity colour, and title/description/icon in the severity colour itself.

**Severity (rows, four in fixed order):**
| Severity | Icon | Filled background | Outlined border + text |
|---|---|---|---|
| Error | (!) in circle | dusty brick red ~#c37b75 (desaturated red, close to red-560 #cc7f7d) | ~#c16e6c border, title and description in the same warm red |
| Warning | triangle ! | saffron/amber ~#e8960c–#f0a30a (close to yellow-830 #f9a308) | amber border and amber text |
| Info | (i) in circle | periwinkle blue ~#6d8fe0 (close to blue-680 #8ca7de / blue-460 #6086d2) | blue border and blue text |
| Success | (✓) in circle | medium green ~#4fa66f–#53ad74 (green-560 #4fa66f) | green border and green text |

Note: in the filled variant the "Label" action text is rendered in the same dark-on-colour treatment; in the outlined variant it takes the severity colour.

## Sizes
Only one size. Two-line alerts (title + description) are ~62px tall; single-line alerts (title only, description only) are ~52px tall. Width is driven by the container, not a size prop.

## States
No state matrix (no hover/focus/disabled columns). The only "state"-like axis is dismissed vs present, implied by the dismiss X. Actions are shown as static text.

## Shape and spacing
- Corner radius ~4px (slightly rounded rectangle, same family as the accordion/textfield radius).
- Horizontal padding ~16px each side; icon-to-text gap ~16px.
- Vertical padding ~12px top and bottom on the two-line version.
- The action "Label" and the X are grouped at the right with ~16px between them; the X has a small hit area but no visible button chrome.
- Title/description line gap is tight (~4px).

## Typography
- Title: bold (600–700), ~15px.
- Description: regular (400), ~14px, same size family as body.
- Action "Label": regular ~14px, same size as description, no underline.

## Colour notes
- Page background behind the alerts: ~#1a171b.
- Outlined variant fill is the page background (fully transparent), not a tinted surface — visible because the surrounding page is the same colour.
- Filled variant text is very dark (near-black with the hue of the fill), giving a light-on-dark inversion inside the banner.

## Notable details
- The story page has no prose captions; only the short labels on 006: "Title only", "Description only", "With action", "Dismissible" (these are the alert titles themselves, doubling as captions).
- The "Description only" alert vertically centres the single line with the icon; there is no empty title slot.
- There is no neutral/default severity — only error, warning, info, success.
- The dismiss X is not shown as an IconButton with hover chrome; it appears to be a bare icon.
