/**
 * Tecton theme source.
 *
 * This file is build-time input: `pnpm --filter @tecton/react build` compiles it
 * into `dist/theme/theme.css` plus a pre-resolved theme module that is loaded at
 * runtime, so applications never pay for style injection on hydration.
 *
 * Placeholder values — a later phase replaces the token set with the real
 * Tecton palette, typography scale and component overrides.
 */
import {defineTheme} from '@astryxdesign/core/theme';
import {tectonIcons} from './icons.js';

export const tectonTheme = defineTheme({
  name: 'tecton',
  icons: tectonIcons,
  typography: {
    body: {
      family: 'Figtree',
      fallbacks: 'Helvetica, Arial, sans-serif',
    },
    code: {
      family: 'IBM Plex Mono',
      fallbacks: 'Consolas, Monaco, monospace',
    },
  },
  tokens: {
    '--color-accent': ['#1f9fa0', '#32c9c9'],
  },
});
