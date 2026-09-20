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
 */
import type {ReactNode} from 'react';
import {useEffect, useLayoutEffect, useState} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {LayerContext, LayerProvider} from '@astryxdesign/core/Layer';
import {tectonTheme} from '../theme/index.js';
import {claimRoot} from '../runtime/rootRegistry.js';
import {requestToastStandIn} from '../runtime/toastBus.js';
import {ToastBridge} from '../components/Toast/ToastBridge.js';

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
   *   container unmounting while others are still on the page. `useToast`
   *   inside it raises toasts into the page's single viewport, and normally
   *   this provider renders **no viewport of its own**.
   *
   *   The exception is a page with no `scope="root"` provider anywhere — the
   *   shape a non-React shell has when it calls `configureTectonRoot()` and
   *   every container mounts nested. There the **first** nested provider on
   *   the page publishes a **stand-in** viewport so the page's toasts are
   *   shown rather than queued for ever, and hands it straight back if a
   *   `scope="root"` provider mounts later. Standing in claims nothing: the
   *   page's mode, theme name and layer context are unchanged by it.
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

/**
 * What a nested provider puts in place of a layer provider.
 *
 * A layer provider's job is to mount the page's toast viewport; a nested
 * container must not mount a second one, because two viewports land at
 * identical coordinates and draw their toasts on top of each other (measured,
 * F8 in `docs/engineering/micro-frontends/analysis.md`). Providing the layer
 * context without the viewport keeps the tree's layer configuration intact —
 * including for an upstream layer provider a consumer nests inside it, which
 * sees a provider above it and passes through — while the page's single
 * viewport shows every copy's toasts.
 *
 * That pass-through is also why a nested provider standing in for a page with
 * no root provider renders its viewport OUTSIDE this context rather than
 * inside it: a layer provider under this value would pass through and mount
 * nothing.
 */
const NESTED_LAYER_CONTEXT = {toastConfig: {}, isProvider: true} as const;

/**
 * Whether this nested provider is the one the page wants a viewport from.
 *
 * The bus decides, and it asks exactly one nested provider at a time, so a
 * page with six containers still has one viewport. `false` for a root
 * provider, which publishes its own viewport unconditionally, and `false`
 * during server rendering — the offer is made from an effect, so the server
 * output of a nested provider is what it always was and there is nothing for
 * hydration to disagree about.
 */
function useToastStandIn(enabled: boolean): boolean {
  const [needed, setNeeded] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const withdraw = requestToastStandIn(setNeeded);
    return () => {
      withdraw();
      // The offer is gone, so any viewport mounted for it goes too; the bus
      // has already asked the next provider in line.
      setNeeded(false);
    };
  }, [enabled]);

  return enabled && needed;
}

export function TectonProvider({
  children,
  mode = 'dark',
  scope = 'root',
}: TectonProviderProps) {
  const owning = scope === 'root';
  const standingIn = useToastStandIn(!owning);

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
      {owning ? (
        <LayerProvider>
          <ToastBridge />
          {children}
        </LayerProvider>
      ) : (
        <>
          {/*
            The stand-in viewport sits OUTSIDE the nested layer context on
            purpose: an upstream layer provider that finds one above it passes
            through and mounts no viewport at all, so a stand-in nested inside
            `NESTED_LAYER_CONTEXT` would render nothing. Out here it is its own
            layer root, holding only the bridge — `children` never see it, and
            mounting or unmounting it as the page's ownership changes does not
            touch their subtree.
          */}
          {standingIn ? (
            <LayerProvider>
              <ToastBridge owning={false} />
            </LayerProvider>
          ) : null}
          <LayerContext value={NESTED_LAYER_CONTEXT}>{children}</LayerContext>
        </>
      )}
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
