# Avatar

## Sources
- `013_components-avatar__icon-avatars.png`
- `014_components-avatar__image-avatars.png`
- `016_components-avatar__text-avatars.png`
- `017_components-avatar__variant-matrix.png`

## Anatomy
A single coloured tile containing exactly one of three contents:
- **Text** — two uppercase initials (OP, AB, CD, EF, GH, IJ), centred, drawn in a *dark* colour on the light accent fill.
- **Icon** — a solid person/bust glyph, also drawn dark on the accent fill; used as the fallback.
- **Image** — a photo cropped to fill the tile, clipped to the shape.

No badge, status dot or ring is shown on the Avatar itself.

## Variants
Two independent axes, both named on the page.

**Shape** (rows of the variant matrix, and the section headings of 014):
- `circular` — full circle.
- `rounded` — squircle with a small radius (~4–6px at 40px, scaling down with size).
- `square` — sharp corners, radius 0.

**Content**: `Text`, `Icon`, `Image` — matrix rows are the cross product: Text/circular, Text/rounded, Text/square, Icon/circular, Icon/rounded, Icon/square, Image/circular, Image/rounded, Image/square.

**Accent colour** — the section on 017 is headed "All Accent Colors" and shows six swatches labelled underneath with their token names:
| Label | Swatch appearance | Approx hex |
|---|---|---|
| lemon | olive/chartreuse yellow | ~#9e9813–#b0a915 |
| graphite | neutral warm grey | ~#a7a2ac |
| pink | dusty rose | ~#cc998f |
| saffron | orange-tan | ~#d3986e |
| lime | yellow-green | ~#84a138–#91b03d |
| blue | periwinkle | ~#8ca7de |
| (7th, unlabelled in the accent row but present in 016) azure | teal | ~#2eb8b8 |
Story 016 shows seven fills in order: lemon, graphite, pink, saffron, lime, blue, azure (the azure one carries the person icon).

## Sizes
Named explicitly in column headers / section labels: **40px, 32px, 24px, 18px**. These are literal pixel diameters/edge lengths; the initials and the person glyph scale proportionally (initials go from ~16px down to ~8px). There is no sm/md/lg vocabulary — sizes are named by their pixel value.

## States
The matrix has eight columns: `40px, 32px, 24px, 18px` then `40px off, 32px off, 24px off, 18px off`. "off" is the only state modifier shown.
- **on (default)** — full accent colour.
- **off** — the accent colour is replaced by a **neutral grey** (~#6e6873 for text/icon avatars); image avatars in the "off" columns are **desaturated to greyscale and dimmed**. Text/icon glyphs stay dark on the grey.

No hover, focus, pressed or disabled columns appear — Avatar is treated as a display element.

## Shape and spacing
- circular: radius 50%. rounded: ~4px at 40px (looks like radius scales with size, roughly 10–12% of the edge). square: 0.
- No border, ring or outline on any avatar.
- In the size rows of 013/016 avatars are spaced ~16px apart; in the matrix the columns are on a fixed ~95px pitch so the different sizes are top-aligned… actually they are **centred on a common baseline row**, each size vertically centred in its row.

## Typography
Initials are set in a regular-weight sans, roughly 40% of the avatar size (≈16px at the 40px avatar, ≈13px at 32px, ≈10px at 24px, ≈8px at 18px). Letter case is uppercase; letter-spacing looks normal.

## Colour notes
- Fills are all **mid/light tints** from the palette (the 560–830 band), never the dark end — this is what lets the dark glyph/initials read.
- Foreground (initials and person icon) is a near-black tinted with the fill's hue, not pure black.
- The "off" grey is a graphite mid-tone ~#6e6873–#7a747f.
- Page background ~#1a171b.

## Notable details
- Page headings, quoted verbatim: "Variant Matrix - Content by shape, size, and state", "All Accent Colors", "Icon Avatars - Person fallback across sizes", "Text Avatars - Initials across sizes and colors", "Image Avatars - Sizes by shapes".
- The icon fallback is a **filled** person glyph (not the outline style used elsewhere in the system).
- Accent colour and content type are independent: the same initials appear in seven different accents on 016.
- The "off" state applies a greyscale filter to image avatars, not just an opacity change — the photo loses all colour.
