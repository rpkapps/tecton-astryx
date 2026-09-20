/**
 * `@tecton/react` — the Tecton design system for React.
 *
 * Tecton is a **theme**, not a second component library. The components,
 * hooks, helpers and types below are the component system Tecton is built on,
 * published under Tecton's name with their own names and their own props:
 * nothing is renamed, nothing is narrowed, nothing is invented. What Tecton
 * adds is the theme — the palette, the type scale, the radii, the component
 * overrides and the icon set — and the provider that installs it.
 *
 * ```tsx
 * import {TectonProvider, Button, TextInput} from '@tecton/react';
 * import '@tecton/react/styles.css';
 *
 * <TectonProvider>
 *   <TextInput label="Well name" />
 *   <Button label="Save" variant="primary" />
 * </TectonProvider>
 * ```
 *
 * Every module is also published as its own subpath — `@tecton/react/Button`,
 * `@tecton/react/Table`, `@tecton/react/hooks`, `@tecton/react/Table/utils` —
 * generated from the component system's own exports map by
 * `scripts/generate-modules.mjs`. The Tecton icon set is at
 * `@tecton/react/icons` and the theme and tokens at `@tecton/react/theme`.
 */

/* The component system, whole and unrenamed ------------------------------- */

export * from '@astryxdesign/core';

/* The provider that installs the Tecton theme ----------------------------- */

export {TectonProvider, configureTectonRoot} from './provider/TectonProvider.js';
export type {
  TectonProviderProps,
  TectonColorMode,
  TectonScope,
  ConfigureTectonRootOptions,
} from './provider/TectonProvider.js';

/* The Tecton theme --------------------------------------------------------- */

/**
 * The tokens, the icon registry and a handle on the theme itself.
 *
 * Every name here is prefixed `tecton`/`Tecton`, so none of it collides with
 * the component system's own exports above — which keep their names, because
 * they are the component system's.
 */
export {tectonTheme, tectonIcons, tectonToken, tecton} from './theme/public.js';
export type {
  TectonTheme,
  TectonIconRegistry,
  TectonSemanticIconName,
  TectonTokenName,
  TectonTokens,
} from './theme/public.js';
