import type {ReactNode} from 'react';
import {RootProvider} from 'fumadocs-ui/provider/tanstack';
import {useTheme} from 'fumadocs-ui/provider/base';
import {TectonProvider} from '@tecton/react';
import SearchDialog from '@/components/search';

/**
 * Tecton's own provider, following the site's theme switch.
 *
 * fumadocs drives dark and light with a class on `<html>`; Tecton drives it
 * with `data-theme` and `color-scheme`. Handing the resolved theme to
 * `TectonProvider` keeps the two in step without either writing the other's
 * attribute, which is what would make them fight.
 *
 * `resolvedTheme` is undefined until the theme provider has read the stored
 * choice, which happens after the first render. Falling back to dark rather
 * than to nothing means the tree renders in the mode the served HTML already
 * says it is in, so the server's markup and the client's first render agree.
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
