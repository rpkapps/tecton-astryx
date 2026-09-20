/**
 * Every page the build has to write, read from the generator's own page list.
 *
 * `crawlLinks` finds a page only when something already prerendered links to
 * it, and two things on this site are reached no other way: `/api/search`,
 * which nothing links to because the search dialog fetches it, and any page
 * whose only link sits inside a collapsed sidebar group. The generator knows
 * all of them — `src/generated/sitePages.ts` is written in the same pass that
 * writes the MDX — so the list is taken from there rather than guessed at.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const APP_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

/** The single exported literal of a generated module, as data. */
function readGenerated(name) {
  const file = path.join(APP_ROOT, 'src/generated', `${name}.ts`);
  if (!fs.existsSync(file)) {
    throw new Error(
      `apps/docs/src/generated/${name}.ts is missing. Run: pnpm --filter @tecton/docs generate`,
    );
  }
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf('= ', source.indexOf('export const'));
  return JSON.parse(source.slice(start + 2).replace(/;\s*$/, ''));
}

/** Every path the site has, with and without its trailing slash. */
function sitePaths() {
  const paths = new Set(['/', '/api/search']);
  for (const page of readGenerated('sitePages')) {
    paths.add(page.url);
    paths.add(`${page.url}/`);
  }
  return paths;
}

const PATHS = sitePaths();

/**
 * Whether a path the crawler found is a page of this site.
 *
 * It is not a formality. Every page here renders running examples, and a page
 * template is a whole screen with links of its own — to `/team/alex`, to
 * `/invoices/3`, to wherever the design it was ported from went. Those belong
 * to the example, not to this site, and a crawler that followed them would
 * fail the build on a page nobody meant to write.
 */
export function isSitePath(pathname) {
  return PATHS.has(pathname);
}

export function prerenderPages() {
  const pages = [
    // The landing page, which is not in the docs page list.
    {path: '/'},
    // The search index: one JSON document, written where the dialog fetches it
    // rather than as a directory with an index.html in it.
    {
      path: '/api/search',
      prerender: {enabled: true, outputPath: '/api/search'},
    },
  ];
  // With the trailing slash, because that is the form every link on the site
  // carries and therefore the form the crawler finds. Listed without it, each
  // page would be rendered twice — once from this list and once from a link —
  // into the same `index.html`.
  for (const page of readGenerated('sitePages')) {
    pages.push({path: `${page.url}/`});
  }
  return pages;
}
