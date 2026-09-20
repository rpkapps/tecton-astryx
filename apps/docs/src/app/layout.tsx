import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {Provider} from '@/components/provider';
import {siteDescription, siteName} from '@/lib/layout.shared';
import './global.css';

export const metadata: Metadata = {
  title: {default: siteName, template: `%s — ${siteName}`},
  description: siteDescription,
};

/**
 * The page shell.
 *
 * `data-astryx-theme` and `data-theme` are written into the served HTML rather
 * than left to the provider to set on mount: the theme's custom properties are
 * scoped to that attribute, so a page that waits for hydration to add it paints
 * once without the design system's colours. The provider takes ownership of
 * both the moment it mounts and keeps them in step with the theme switch.
 */
export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html
      lang="en"
      className="dark"
      data-astryx-theme="tecton"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
