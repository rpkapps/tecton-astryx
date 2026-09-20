import {loader} from 'fumadocs-core/source';
import {defineDocs} from 'fumadocs-mdx/macro';
import {metaSchema, pageSchema} from 'fumadocs-core/source/schema';
import type * as PageTree from 'fumadocs-core/page-tree';
import {componentSidebar} from '@/generated/componentSidebar';

/**
 * Where the site's pages come from.
 *
 * `content/docs` is written by `scripts/generate-data.mjs` and is not committed:
 * every guide, foundations page, component page and template page in it is
 * printed from the package or from an authored source under `guides/`. Adding a
 * module to `@tecton/react` therefore adds a page here, and to the sidebar, and
 * to the search index, with nothing to edit on the site.
 *
 * The collection is **async**, which on a site with 217 pages is not a detail:
 * each page's compiled MDX is its own chunk, fetched when that page is opened.
 * Eagerly, one module would hold all of them — the bundler would compile every
 * page to serve any page, which is what made this site slow to start and
 * expensive to keep running. What stays eager is the frontmatter and the
 * `meta.json` files, which is what the sidebar and the page tree are built
 * from.
 */
const docs = defineDocs({
  dir: 'content/docs',
  docs: {schema: pageSchema, async: true},
  meta: {schema: metaSchema},
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});

/* -------------------------------------------------------------------------- */
/* The component sidebar                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A hundred and forty-four flat entries is not a sidebar, it is a list to
 * scroll past, so the component pages are grouped the way the library groups
 * them: `Button`, `ButtonGroup`, `IconButton` and `ToggleButton` under Button,
 * every hook that belongs to nobody under Utilities, and a group with one
 * member flattened back to a plain entry. `scripts/generate-data.mjs` works the
 * grouping out — it is upstream's own rule — and this turns it into folders.
 *
 * The folders are synthetic, which is the point: the files under
 * `content/docs/components` stay flat, so a page's URL is
 * `/docs/components/Button` rather than `/docs/components/Button/Button`. A
 * folder in fumadocs' page tree does not have to be a folder on disk. fumadocs
 * opens the folder holding the page being read and leaves the others collapsed.
 */
function groupComponentTree(root: PageTree.Root): PageTree.Root {
  const components = root.children.find(
    (node): node is PageTree.Folder =>
      node.type === 'folder' && node.$ref?.folder === 'components',
  );
  if (!components) return root;

  const byUrl = new Map<string, PageTree.Item>();
  for (const child of components.children) {
    if (child.type === 'page') byUrl.set(child.url, child);
  }
  const take = (href: string) => byUrl.get(href);

  const children: PageTree.Node[] = [];
  for (const item of componentSidebar.items) {
    if (item.type === 'entry') {
      const page = take(item.href);
      if (page) children.push(page);
      continue;
    }
    const entries = item.entries
      .map(entry => take(entry.href))
      .filter((page): page is PageTree.Item => page != null);
    if (entries.length === 0) continue;
    children.push({
      type: 'folder',
      name: item.displayName,
      description: item.description,
      defaultOpen: false,
      children: entries,
    });
  }

  const utilities = componentSidebar.utilities
    .map(entry => take(entry.href))
    .filter((page): page is PageTree.Item => page != null);
  if (utilities.length > 0) {
    children.push({
      type: 'folder',
      name: 'Utilities',
      description:
        'Providers, context, and the hooks the components are built from.',
      defaultOpen: false,
      children: utilities,
    });
  }

  // Anything the grouping did not claim is kept rather than dropped: a page
  // missing from the sidebar is a page nobody finds. The gallery leads the
  // section, the way upstream's own sidebar opens with its overview.
  const claimed = new Set<string>();
  const collect = (nodes: readonly PageTree.Node[]) => {
    for (const node of nodes) {
      if (node.type === 'page') claimed.add(node.url);
      else if (node.type === 'folder') collect(node.children);
    }
  };
  collect(children);
  const leftovers = components.children.filter(
    node => node.type === 'page' && !claimed.has(node.url),
  );
  const gallery = leftovers.filter(
    node => node.type === 'page' && node.url === '/docs/components',
  );
  const rest = leftovers.filter(node => !gallery.includes(node));

  return {
    ...root,
    children: root.children.map(node =>
      node === components
        ? {...components, children: [...gallery, ...children, ...rest]}
        : node,
    ),
  };
}

let cachedTree: PageTree.Root | undefined;

/**
 * The tree the docs layout draws, with the component groups folded in.
 *
 * It is worked out once: every page on the site draws the same sidebar, and
 * folding 144 pages into their groups on every render is work the reader pays
 * for on every navigation.
 */
export function getSidebarTree(): PageTree.Root {
  cachedTree ??= groupComponentTree(source.getPageTree());
  return cachedTree;
}
