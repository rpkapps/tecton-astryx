#!/usr/bin/env node
/**
 * Serve the static export the way a static host would.
 *
 * `next build` writes `out/`, in which every route is a directory holding an
 * `index.html`. This is what the end-to-end tests run against, so it has to
 * resolve a path the same way a host does — directory index, then `.html`, then
 * the 404 page — or a test would pass against a server no one deploys.
 */
import {createServer} from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../out',
);
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = new Map(
  Object.entries({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
  }),
);

/** The first of the candidate files that exists, or nothing. */
function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname).replace(/\/+$/, '');
  const base = path.join(ROOT, decoded);
  if (path.relative(ROOT, base).startsWith('..')) return undefined;
  for (const candidate of [
    base,
    `${base}.html`,
    path.join(base, 'index.html'),
    // A Route Handler exported statically lands beside its directory.
    `${base}.txt`,
    `${base}.json`,
  ]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return undefined;
}

if (!fs.existsSync(ROOT)) {
  console.error(`${ROOT} does not exist. Run \`pnpm build\` first.`);
  process.exit(1);
}

createServer(async (request, response) => {
  const {pathname} = new URL(request.url ?? '/', 'http://localhost');
  const file = resolveFile(pathname === '/' ? '/index' : pathname);
  if (!file) {
    const notFound = path.join(ROOT, '404.html');
    const body = fs.existsSync(notFound)
      ? await fsp.readFile(notFound)
      : 'Not found';
    response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(body);
    return;
  }
  response.writeHead(200, {
    'Content-Type':
      TYPES.get(path.extname(file)) ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  response.end(await fsp.readFile(file));
}).listen(PORT, () => {
  console.log(`Serving ${path.relative(process.cwd(), ROOT)} on :${PORT}`);
});
