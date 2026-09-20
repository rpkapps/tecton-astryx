/*
 * Ad-hoc: capture one example with a control focused, on both sides.
 *
 *   node focusshot.mjs <Dir/Name> <outDir> [tabs] [port]
 *
 * The audit's focus pass reports numbers; this is for looking at the ring.
 */
import {createServer} from 'vite';
import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ex = process.argv[2] ?? 'Button/ButtonVariants';
const outDir = path.resolve(process.argv[3] ?? '.audit/focus');
const tabs = Number(process.argv[4] ?? 1);
const port = Number(process.argv[5] ?? 5601);
const slug = ex.replace(/\//g, '__');

await mkdir(outDir, {recursive: true});

const servers = {};
for (const [side, offset] of [
  ['tecton', 0],
  ['neutral', 1],
]) {
  const server = await createServer({
    configFile: path.join(HERE, 'vite.config.ts'),
    mode: side,
    server: {port: port + offset, strictPort: true},
    logLevel: 'error',
  });
  await server.listen();
  servers[side] = {server, origin: `http://localhost:${port + offset}`};
}

const browser = await chromium.launch({args: ['--disable-dev-shm-usage']});
const context = await browser.newContext({viewport: {width: 1100, height: 900}});
await context.addInitScript({path: path.join(HERE, 'scripts', 'probe.js')});

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
  for (let i = 0; i < tabs; i += 1) await page.keyboard.press('Tab');
  await page.waitForTimeout(120);
  const stop = await page.evaluate(() => window.__describeActive());
  console.log(side, JSON.stringify(stop));
  await page.screenshot({path: path.join(outDir, `${slug}.${side}-focus.png`)});
  await page.close();
}

await browser.close();
for (const side of Object.keys(servers)) await servers[side].server.close();
process.exit(0);
