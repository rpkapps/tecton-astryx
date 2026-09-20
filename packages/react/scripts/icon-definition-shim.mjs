/**
 * Evaluation shim for the delivered Tecton icon sources.
 *
 * `design/icons/tecton/*.ts` each call `defineTectonSvgIcon(name, definition)`
 * against a helper module that was never part of the delivery. The generator
 * rewrites that import to point here and evaluates the module, so the icon
 * definitions are read from the source of truth rather than re-parsed out of
 * it. This file is build tooling: nothing in `src/` imports it.
 *
 * @param {string} name kebab-case glyph name, e.g. `drill-bit`.
 * @param {{viewBox: string, outline: string, filled: string, colored?: boolean}} definition
 */
export function defineTectonSvgIcon(name, definition) {
  return {name, ...definition};
}
