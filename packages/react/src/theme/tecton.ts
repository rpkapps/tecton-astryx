/**
 * The built Tecton theme.
 *
 * In `dist/` this module is REPLACED by the pre-resolved theme module the theme
 * compiler generates (the one flagged as built, whose tokens are already
 * resolved and whose CSS ships in `@tecton/react/styles.css`). The source
 * version below exists so tests, type-checking and editor tooling can resolve
 * `./tecton.js` before a build has run; it falls back to the source theme,
 * which resolves its tokens at runtime.
 */
export {tectonTheme} from './tectonTheme.js';
