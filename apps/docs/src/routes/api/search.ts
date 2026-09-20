import {createFileRoute} from '@tanstack/react-router';
import {createFromSource} from 'fumadocs-core/search/server';
import {source} from '@/lib/source';

/**
 * The search index, as a build artefact.
 *
 * `staticGET` serialises every page the loader knows about — guides,
 * foundations, every component and every template — into one JSON document.
 * `vite.config.ts` prerenders this route to `dist/client/api/search`, so the
 * export carries the index and there is no server: the dialog fetches it once
 * and searches it in the browser.
 */
const server = createFromSource(source, {language: 'english'});

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: () => server.staticGET(),
    },
  },
});
