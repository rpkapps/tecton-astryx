import {createContext, useContext, type ReactNode} from 'react';
import type {ComponentEntry} from '@/types/docs';

/**
 * One component page's doc entry, fetched for that page and no other.
 *
 * The doc objects behind the 144 component pages are large — props, theming
 * targets, accessibility requirements, the parts each module is made of — and
 * they used to be one generated module that every page on the site imported.
 * The generator now writes one module per page instead, and the `/docs/$`
 * route's loader fetches the one the page being read needs. Nothing else on
 * the site pulls any of them.
 */
const entryModules = import.meta.glob<{componentEntry: ComponentEntry}>(
  '../generated/components/*.ts',
);

/** The entry for `/docs/components/<Name>`, or nothing for any other page. */
export async function loadComponentEntry(
  slugs: readonly string[],
): Promise<ComponentEntry | null> {
  if (slugs.length !== 2 || slugs[0] !== 'components') return null;
  const load = entryModules[`../generated/components/${slugs[1]}.ts`];
  if (!load) return null;
  return (await load()).componentEntry;
}

const Context = createContext<ComponentEntry | null>(null);

export function ComponentEntryProvider({
  entry,
  children,
}: {
  entry: ComponentEntry | null;
  children: ReactNode;
}) {
  return <Context.Provider value={entry}>{children}</Context.Provider>;
}

/**
 * The entry for the page being read, when it is the one asked for.
 *
 * A generated page only ever asks for its own component — the elements in its
 * MDX are written with its name — so a mismatch means the page and the loader
 * disagree, which is a bug rather than a page to render half of.
 */
export function useComponentEntry(name: string): ComponentEntry | undefined {
  const entry = useContext(Context);
  return entry?.name === name ? entry : undefined;
}
