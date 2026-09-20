/**
 * TectonProvider — the single provider a Tecton application mounts.
 *
 * It applies the built Tecton theme and sets up the overlay layer that
 * popovers, tooltips and toasts render into. It holds no module-level mutable
 * state, so several copies of `@tecton/react` can coexist on one page; the
 * page-level state they would otherwise fight over — the `<html>` attributes
 * that drive the page canvas, the browser chrome and any overlay that has to
 * live outside the provider's own wrapper — is arbitrated through a
 * document-keyed registry shared by every copy (`../runtime/rootRegistry.ts`).
 *
 * It is not a component in Tecton's own right and it renders no markup of its
 * own: it is the theme, installed.
 */
import type {ReactNode} from 'react';
import {useEffect, useLayoutEffect} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {LayerProvider} from '@astryxdesign/core/Layer';
import {tectonTheme} from '../theme/index.js';
import {claimRoot} from '../runtime/rootRegistry.js';

/** Colour mode: force one, or follow the operating system preference. */
export type TectonColorMode = 'dark' | 'light' | 'system';

/**
 * Which provider owns the page.
 *
 * - `'root'` — this provider is the page's Tecton root.
 * - `'nested'` — a host shell or another container already owns the page.
 */
export type TectonScope = 'root' | 'nested';

export interface TectonProviderProps {
  /** The application tree that renders inside the Tecton theme. */
  children: ReactNode;
  /**
   * Colour mode applied to the tree.
   *
   * The tree inside this provider always renders in this mode. Whether the
   * page canvas and the browser chrome follow it depends on `scope`: only the
   * first `scope="root"` provider on the page decides that.
   *
   * @default 'dark'
   */
  mode?: TectonColorMode;
  /**
   * Who owns the page-level state — the `<html data-theme>` and
   * `<html>` theme attributes that drive the page canvas, the
   * scrollbars and the native form controls, and that any overlay rendered
   * outside this provider's wrapper resolves its theme through.
   *
   * - `'root'` (default) — this provider is the page's Tecton root. It takes an
   *   owning claim on the document root. The **first** owning claim on the page
   *   wins: a later one that disagrees logs a development warning and is
   *   ignored, so a container that mounts second cannot restyle the page
   *   chrome out from under one that was already there.
   * - `'nested'` — a host shell or another container already owns the page.
   *   The tree is still fully themed and still renders in its own `mode`; this
   *   provider simply does not try to decide the page's mode or theme name. It
   *   still holds a non-owning claim, so the attributes survive **this**
   *   container unmounting while others are still on the page.
   *
   * A container deployed into a host shell that calls `configureTectonRoot()`
   * should pass `'nested'`.
   *
   * @default 'root'
   */
  scope?: TectonScope;
}

/**
 * Layout effects run before paint, which is where the root attributes have to
 * be settled; on the server there is no DOM, and React warns about layout
 * effects there.
 */
const useIsomorphicLayoutEffect =
  typeof document === 'undefined' ? useEffect : useLayoutEffect;

export function TectonProvider({
  children,
  mode = 'dark',
  scope = 'root',
}: TectonProviderProps) {
  const owning = scope === 'root';

  // The upstream Theme's own root sync is a child of this effect, so it runs
  // first on mount (layout effects run child-first) and its cleanup runs after
  // this one on unmount (deletions are walked parent-first). Either way the
  // registry has the last word: what it cannot prevent, it reverts.
  useIsomorphicLayoutEffect(
    () => claimRoot({themeName: tectonTheme.name, mode, owning}),
    [mode, owning],
  );

  return (
    <Theme theme={tectonTheme} mode={mode}>
      {/*
        The layer provider is what gives the tree its overlay layer and its
        toast viewport. It passes through when one is already above it, so
        nesting Tecton providers inside one application still yields exactly
        one viewport; a second copy of the package on the page brings its own,
        which is what a separately bundled container is.
      */}
      <LayerProvider>{children}</LayerProvider>
    </Theme>
  );
}

TectonProvider.displayName = 'TectonProvider';

/** Options for {@link configureTectonRoot}. */
export interface ConfigureTectonRootOptions {
  /**
   * Colour mode for the page canvas and the browser chrome.
   * @default 'dark'
   */
  mode?: TectonColorMode;
  /**
   * Theme name to hold on the `<html>` theme attribute. Defaults to Tecton's own
   * theme name; pass one only for a deliberately versioned theme name.
   */
  themeName?: string;
}

/**
 * Claim the document root for Tecton from a host shell, before any container
 * loads, and keep it claimed for as long as the page lives.
 *
 * This is the host-shell half of `scope`: the shell decides the page's colour
 * mode once, each container mounts with `scope="nested"`, and no container can
 * change the page chrome or take it away by unmounting. It is a plain
 * function, so a shell that is not itself a React application can call it.
 *
 * Returns a release function. Calling it hands the root back; when it is the
 * last claim on the page, both attributes are removed.
 *
 * ```ts
 * import {configureTectonRoot} from '@tecton/react';
 *
 * configureTectonRoot({mode: 'dark'});
 * ```
 */
export function configureTectonRoot(
  options: ConfigureTectonRootOptions = {},
): () => void {
  return claimRoot({
    themeName: options.themeName ?? tectonTheme.name,
    mode: options.mode ?? 'dark',
    owning: true,
  });
}
