/*
 * Ad-hoc: does a Tecton glyph fill the box the component asked for?
 *
 * For every `svg` in an example, reports the rendered box, the viewBox, and the
 * ink's bounding box inside that viewBox — which is what "the icon looks too
 * small" is really a claim about.
 */
import {createServer} from 'vite';
import {chromium} from '@playwright/test';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ex = process.argv[2] ?? 'EmptyState/EmptyStateActions';
const port = Number(process.argv[3] ?? 5501);

const server = await createServer({
  configFile: path.join(HERE, 'vite.config.ts'),
  mode: 'tecton',
  server: {port, strictPort: true},
  logLevel: 'error',
});
await server.listen();

const browser = await chromium.launch({args: ['--disable-dev-shm-usage']});
const page = await browser.newPage({viewport: {width: 1100, height: 900}});
await page.goto(
  `http://localhost:${port}/tecton.html?ex=${encodeURIComponent(ex)}&mode=dark`,
);
await page.waitForFunction(() => window.__auditReady != null, {timeout: 20000});
await page.waitForTimeout(200);

const rows = await page.evaluate(() => {
  const out = [];
  for (const svg of document.querySelectorAll('#stage svg')) {
    const rect = svg.getBoundingClientRect();
    const vb = svg.getAttribute('viewBox') || '';
    let ink;
    try {
      const b = svg.getBBox();
      ink = {x: b.x, y: b.y, w: b.width, h: b.height};
    } catch {
      ink = null;
    }
    const parent = svg.parentElement;
    out.push({
      box: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
      viewBox: vb,
      ink,
      attrW: svg.getAttribute('width'),
      cssW: getComputedStyle(svg).width,
      parentClass: parent ? parent.getAttribute('class') : '',
      parentSize: parent ? parent.getAttribute('data-size') : '',
      parentFont: parent ? getComputedStyle(parent).fontSize : '',
    });
  }
  return out;
});

for (const row of rows) {
  const span = row.viewBox.split(/\s+/).map(Number)[2] || 0;
  const fill =
    row.ink && span
      ? `${Math.round((Math.max(row.ink.w, row.ink.h) / span) * 100)}%`
      : '?';
  console.log(
    `box=${row.box} attrW=${row.attrW} cssW=${row.cssW} viewBox="${row.viewBox}" ` +
      `ink=${row.ink ? `${row.ink.w.toFixed(1)}x${row.ink.h.toFixed(1)} @${row.ink.x.toFixed(1)},${row.ink.y.toFixed(1)}` : '-'} ` +
      `fill=${fill} parent=[${row.parentClass}] size=${row.parentSize} fs=${row.parentFont}`,
  );
}

await browser.close();
await server.close();
process.exit(0);
