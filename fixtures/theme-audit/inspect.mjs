/* Ad-hoc inspector: dump the measured rows for one example, both sides. */
import {createServer} from 'vite';
import {chromium} from '@playwright/test';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ex = process.argv[2];
const filter = process.argv[3] ?? '';

const servers = {};
for (const [side, port] of [
  ['tecton', 5401],
  ['neutral', 5402],
]) {
  const server = await createServer({
    configFile: path.join(HERE, 'vite.config.ts'),
    mode: side,
    server: {port, strictPort: true},
    logLevel: 'error',
  });
  await server.listen();
  servers[side] = {server, origin: `http://localhost:${port}`};
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: {width: 1100, height: 900},
});
await context.addInitScript({path: path.join(HERE, 'scripts', 'probe.js')});

const out = {};
for (const side of ['tecton', 'neutral']) {
  const page = await context.newPage();
  const file = side === 'tecton' ? 'tecton.html' : 'neutral.html';
  await page.goto(
    `${servers[side].origin}/${file}?ex=${encodeURIComponent(ex)}&mode=dark`,
  );
  await page.waitForFunction(() => window.__auditReady != null, {
    timeout: 20000,
  });
  await page.waitForTimeout(200);
  out[side] = await page.evaluate(() => window.__measure());
}

const nb = new Map(out.neutral.rows.map(r => [r.path, r]));
for (const row of out.tecton.rows) {
  if (filter && !`${row.path} ${row.astryx} ${row.tag}`.includes(filter)) {
    continue;
  }
  const o = nb.get(row.path) ?? {};
  console.log(
    `${row.path}  [${row.astryx || row.tag}]\n` +
      `   T  ${row.w}x${row.h} fs=${row.fontSize} lh=${row.lineHeight} pad=${row.padding} r=${row.radius} corners=${row.corners} bg=${row.bg}\n` +
      `   N  ${o.w}x${o.h} fs=${o.fontSize} lh=${o.lineHeight} pad=${o.padding} r=${o.radius} corners=${o.corners} bg=${o.bg}`,
  );
}

await browser.close();
for (const side of Object.keys(servers)) await servers[side].server.close();
process.exit(0);
