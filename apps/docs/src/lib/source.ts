import {loader} from 'fumadocs-core/source';
import {defineDocs} from 'fumadocs-mdx/macro';
import {metaSchema, pageSchema} from 'fumadocs-core/source/schema';

/**
 * Where the site's pages come from.
 *
 * `content/docs` is written by `scripts/generate-data.mjs` and is not committed:
 * every guide, foundations page, component page and template page in it is
 * printed from the package or from an authored source under `guides/`. Adding a
 * component to `@tecton/react` therefore adds a page here, and to the sidebar,
 * and to the search index, with nothing to edit on the site.
 */
const docs = defineDocs({
  dir: 'content/docs',
  docs: {schema: pageSchema},
  meta: {schema: metaSchema},
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
