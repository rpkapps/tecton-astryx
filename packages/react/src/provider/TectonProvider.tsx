/**
 * TectonProvider — the single provider a Tecton application mounts.
 *
 * It applies the built Tecton theme and sets up the overlay layer that
 * popovers, tooltips and toasts render into. It holds no module-level mutable
 * state, so several copies of `@tecton/react` can coexist on one page.
 */
import type {ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {LayerProvider} from '@astryxdesign/core/Layer';
import {tectonTheme} from '../theme/index.js';

/** Colour mode: force one, or follow the operating system preference. */
export type TectonColorMode = 'dark' | 'light' | 'system';

export interface TectonProviderProps {
  /** The application tree that renders inside the Tecton theme. */
  children: ReactNode;
  /**
   * Colour mode applied to the tree.
   * @default 'dark'
   */
  mode?: TectonColorMode;
}

export function TectonProvider({children, mode = 'dark'}: TectonProviderProps) {
  return (
    <Theme theme={tectonTheme} mode={mode}>
      <LayerProvider>{children}</LayerProvider>
    </Theme>
  );
}

TectonProvider.displayName = 'TectonProvider';
