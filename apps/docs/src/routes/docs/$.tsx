import {Suspense, use} from 'react';
import {createFileRoute, notFound} from '@tanstack/react-router';
import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import {getSidebarTree, source} from '@/lib/source';
import {baseOptions, siteName} from '@/lib/layout.shared';
import {getMDXComponents} from '@/components/mdx';
import type {ComponentEntry} from '@/types/docs';
import {
  ComponentEntryProvider,
  loadComponentEntry,
} from '@/lib/component-entry';

/** A page of this site, as the loader hands it over. */
type SourcePage = NonNullable<ReturnType<typeof source.getPage>>;

/** `components/Button` → `['components', 'Button']`; `''` → `[]`. */
function slugsOf(splat: string | undefined): string[] {
  return (splat ?? '').split('/').filter(Boolean);
}

export const Route = createFileRoute('/docs/$')({
  /**
   * Two things are fetched before the page renders, and both are why the site
   * is light: the page's own compiled MDX, which is its own chunk rather than
   * one module holding all 217, and — for a component page — that one
   * component's doc entry, which is its own module rather than a registry every
   * page imports.
   */
  loader: async ({params}) => {
    const slugs = slugsOf(params._splat);
    const page = source.getPage(slugs);
    if (!page) throw notFound();
    const [, entry] = await Promise.all([
      page.data.preload(),
      loadComponentEntry(slugs),
    ]);
    return {
      title: page.data.title,
      description: page.data.description,
      entry,
    };
  },
  head: ({loaderData}) => ({
    meta: [
      {title: loaderData ? `${loaderData.title} — ${siteName}` : siteName},
      ...(loaderData?.description
        ? [{name: 'description', content: loaderData.description}]
        : []),
    ],
  }),
  component: DocsRoute,
});

/**
 * The docs shell.
 *
 * The tree is the grouped one: the component pages are folded into the groups
 * the library declares, so the sidebar is 75 rows with the current page's group
 * open rather than 144 rows in a column.
 */
function DocsRoute() {
  const {_splat} = Route.useParams();
  const {entry} = Route.useLoaderData();
  const page = source.getPage(slugsOf(_splat));
  if (!page) throw notFound();

  return (
    <DocsLayout
      tree={getSidebarTree()}
      sidebar={{defaultOpenLevel: 0}}
      {...baseOptions()}
    >
      {/*
        The page's compiled MDX is a chunk of its own, which is what keeps this
        site's memory flat — and a chunk that has to arrive. Prerendering waits
        for it, so the served HTML is complete; in the browser this boundary is
        what lets React hold that served HTML on screen while the chunk is
        fetched, instead of clearing the page and drawing it again.
      */}
      <Suspense fallback={null}>
        <Content page={page} entry={entry} />
      </Suspense>
    </DocsLayout>
  );
}

function Content({
  page,
  entry,
}: {
  page: SourcePage;
  entry: ComponentEntry | null;
}) {
  // Settled already wherever the loader ran, so this returns without
  // suspending; on a first paint in the browser it is what suspends.
  const {toc} = use(page.data.load());
  const MDX = page.data.body;

  return (
    <DocsPage toc={toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <ComponentEntryProvider entry={entry}>
          {/*
            Every link the generator writes is absolute — `/docs/theming`,
            never `../theming` — so there is nothing here for fumadocs'
            relative-link resolver to do, and it only runs on a server anyway.
          */}
          <MDX components={getMDXComponents()} />
        </ComponentEntryProvider>
      </DocsBody>
    </DocsPage>
  );
}
