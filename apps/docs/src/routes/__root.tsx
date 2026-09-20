/// <reference types="vite/client" />
import type {ReactNode} from 'react';
import {HeadContent, Scripts, createRootRoute} from '@tanstack/react-router';
import {Provider} from '@/components/provider';
import {siteDescription, siteName} from '@/lib/layout.shared';
import globalCss from '../styles/global.css?url';
import stylexCss from '../styles/stylex.css?url';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';

/**
 * Where the dev server serves the StyleX classes compiled so far, and the
 * module that keeps that sheet in step as more example modules are requested.
 * Both are the StyleX Vite plugin's own; neither exists in a build.
 */
const STYLEX_DEV_CSS = '/virtual:stylex.css';
const STYLEX_DEV_RUNTIME = '/@id/virtual:stylex:runtime';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {charSet: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {title: siteName},
      {name: 'description', content: siteDescription},
    ],
    links: [
      {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
      {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: ''},
      {rel: 'stylesheet', href: FONTS},
      {rel: 'stylesheet', href: globalCss},
      // The StyleX classes, on their own sheet — see src/styles/stylex.css.
      {rel: 'stylesheet', href: stylexCss},
      ...(import.meta.env.DEV
        ? [{rel: 'stylesheet', href: STYLEX_DEV_CSS}]
        : []),
    ],
    scripts: import.meta.env.DEV
      ? [{type: 'module', src: STYLEX_DEV_RUNTIME}]
      : [],
  }),
  shellComponent: RootDocument,
});

/**
 * The page shell.
 *
 * `data-astryx-theme`, `data-theme` and the `dark` class are written into the
 * served HTML rather than left to a provider to set on mount: the theme's
 * custom properties are scoped to that attribute, so a page that waits for
 * hydration to add it paints once without the design system's colours.
 *
 * `suppressHydrationWarning` is what fumadocs prescribes for exactly this: the
 * theme script it injects runs before React hydrates and may have already
 * rewritten the class and the `style` attribute from what the server sent —
 * for a reader who last chose light, it will have. React is told to accept the
 * difference on this one element rather than warn about it.
 */
function RootDocument({children}: {children: ReactNode}) {
  return (
    <html
      lang="en"
      className="dark"
      data-astryx-theme="tecton"
      data-theme="dark"
      style={{colorScheme: 'dark'}}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
        <Scripts />
      </body>
    </html>
  );
}
