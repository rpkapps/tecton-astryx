import {createFromSource} from 'fumadocs-core/search/server';
import {source} from '@/lib/source';

/**
 * The search index, as a build artefact.
 *
 * `staticGET` serialises every page the loader knows about — guides,
 * foundations, every component and every template — into one JSON document that
 * the export writes to `out/api/search`. The dialog fetches it once and
 * searches it in the browser.
 */
export const revalidate = false;

export const {staticGET: GET} = createFromSource(source, {
  language: 'english',
});
