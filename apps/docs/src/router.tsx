import {createRouter} from '@tanstack/react-router';
import {routeTree} from './routeTree.gen';

/**
 * The router the site is served through, in the browser and in the
 * prerenderer alike.
 *
 * `trailingSlash: 'always'` is not cosmetic: the build writes
 * `docs/components/Button/index.html`, and a static host only serves that for
 * `/docs/components/Button/`. Every link the site draws therefore has to carry
 * the slash, which is what this makes the router do.
 */
export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    trailingSlash: 'always',
    defaultPreload: 'intent',
  });
}
