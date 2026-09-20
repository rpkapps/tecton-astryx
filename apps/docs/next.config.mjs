import {createMDX} from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * The site is a static export: `next build` writes plain HTML, JavaScript and
 * the search index into `out/`, which any file server can host. Nothing here
 * runs on a server at request time, so every example is rendered in the
 * reader's browser after hydration.
 *
 * @type {import('next').NextConfig}
 */
const config = {
  output: 'export',
  reactStrictMode: true,
  // A static host serves `/docs/components/Button/index.html` for
  // `/docs/components/Button`, so links have to carry the trailing slash.
  trailingSlash: true,
  images: {unoptimized: true},
  typedRoutes: false,
  // Next 16 otherwise writes AGENTS.md/CLAUDE.md into the app on `next dev`.
  agentRules: false,
};

export default withMDX(config);
