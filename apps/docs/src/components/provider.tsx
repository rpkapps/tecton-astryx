'use client';
import type {ReactNode} from 'react';
import {RootProvider} from 'fumadocs-ui/provider/next';
import {useTheme} from 'next-themes';
import {TectonProvider} from '@tecton/react';
import SearchDialog from '@/components/search';

/**
 * Tecton's own provider, following the site's theme switch.
 *
 * fumadocs drives dark and light with a class on `<html>`; Tecton drives it
 * with `data-theme` and `color-scheme`. Handing the resolved theme to
 * `TectonProvider` keeps the two in step without either writing the other's
 * attribute, which is what would make them fight.
 */
function TectonRoot({children}: {children: ReactNode}) {
  const {resolvedTheme} = useTheme();
  return (
    <TectonProvider mode={resolvedTheme === 'light' ? 'light' : 'dark'}>
      {children}
    </TectonProvider>
  );
}

export function Provider({children}: {children: ReactNode}) {
  return (
    <RootProvider
      search={{SearchDialog}}
      theme={{defaultTheme: 'dark', enableSystem: false}}
    >
      <TectonRoot>{children}</TectonRoot>
    </RootProvider>
  );
}
