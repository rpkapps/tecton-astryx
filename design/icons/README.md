# Tecton icon sources

`tecton/*.ts` are the 131 Tecton glyphs as delivered (Figma export, 16×16 view
box, `outline` and `filled` markup per icon, `colored: true` on `strata`). They
call a `defineTectonSvgIcon` helper that was not part of the delivery; the
package generates React components from these files with
`packages/react/scripts/generate-icons.mjs`. Treat this folder as a design
source of truth, like `tokens/` and `screenshots/`: edit the export, not the
generated output.
