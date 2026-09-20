#!/usr/bin/env node
/** Static server for the built host page. Nothing clever on purpose. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'dist',
  'host',
);
const PORT = Number(process.env.MFE_PORT ?? 4319);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

if (!fs.existsSync(path.join(ROOT, 'mfe-page.html'))) {
  console.error(
    'dist/host is not built — run `pnpm --filter @tecton-fixture/mfe-harness build`.',
  );
  process.exit(1);
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, urlPath === '/' ? 'mfe-page.html' : urlPath);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`mfe-harness serving dist/host on http://127.0.0.1:${PORT}`);
  });
