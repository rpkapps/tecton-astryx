#!/usr/bin/env node
/**
 * Capture the theme fidelity gallery.
 *
 * Builds the documentation site, serves it, and screenshots `/preview/theme` in
 * both colour modes at 1600 CSS px wide and 2× device pixels — the same width
 * and density the design captures in `screenshots/` were taken at, so the two
 * can be read side by side. Output lands in `docs/design/fidelity/`.
 *
 *   node scripts/capture-fidelity.mjs           # build, serve, capture
 *   node scripts/capture-fidelity.mjs --no-build # reuse apps/docs/dist
 *
 * Hover, pressed and focus are not reachable from a static render, so the
 * script forces them through the debugger on the elements the gallery marks
 * with `data-force-pseudo`. That is what makes the button matrix a real state
 * matrix rather than five enabled buttons.
 *
 * Chromium is expected to be installed already (PLAYWRIGHT_BROWSERS_PATH);
 * this script never downloads one.
 */
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'apps', 'docs');
const OUT = path.join(ROOT, 'docs', 'design', 'fidelity');
const PORT = 4319;
const WIDTH = 1600;

/** Sections cropped out of the page, by their `data-section` slug. */
const SECTIONS = [
  'buttons',
  'text-input',
  'table',
  'badges-and-chips',
  'banners',
  'selection-controls',
  'tabs',
  'progress',
  'avatar-divider-panel',
  'type-scale',
];

const PSEUDO_CLASSES = ['hover', 'active', 'focus-visible'];

function run(command, args, cwd) {
  const result = spawnSync(command, args, {cwd, stdio: 'inherit'});
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed (${result.status})`);
  }
}

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`The preview server never answered on ${url}`);
}

/**
 * Force `:hover`, `:active` and `:focus-visible` on the marked controls.
 *
 * `CSS.forcePseudoState` is the only way to see those states in a screenshot:
 * a real hover can only be on one element at a time, and `:active` cannot be
 * held at all.
 */
async function forcePseudoStates(page) {
  const client = await page.context().newCDPSession(page);
  await client.send('DOM.enable');
  await client.send('CSS.enable');
  const {root} = await client.send('DOM.getDocument', {
    depth: -1,
    pierce: true,
  });

  let forced = 0;
  for (const pseudo of PSEUDO_CLASSES) {
    const {nodeIds} = await client.send('DOM.querySelectorAll', {
      nodeId: root.nodeId,
      selector: `[data-force-pseudo="${pseudo}"] button`,
    });
    for (const nodeId of nodeIds) {
      await client.send('CSS.forcePseudoState', {
        nodeId,
        forcedPseudoClasses: [pseudo],
      });
      forced += 1;
    }
  }
  return forced;
}

async function capture(browser, mode) {
  const context = await browser.newContext({
    viewport: {width: WIDTH, height: 1200},
    deviceScaleFactor: 2,
    colorScheme: mode,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const url = `http://localhost:${PORT}/preview/theme${mode === 'light' ? '?mode=light' : ''}`;
  await page.goto(url, {waitUntil: 'networkidle'});
  await page.waitForSelector(`[data-fidelity-gallery="${mode}"]`);

  const forced = await forcePseudoStates(page);
  // Let the forced states settle before the paint is captured.
  await page.waitForTimeout(250);

  await page.screenshot({
    path: path.join(OUT, `theme-${mode}.png`),
    fullPage: true,
  });

  for (const section of SECTIONS) {
    const element = page.locator(`[data-section="${section}"]`);
    if ((await element.count()) === 0) {
      console.warn(`  ! no section "${section}" on the page`);
      continue;
    }
    await element.screenshot({
      path: path.join(OUT, `${mode}-${section}.png`),
    });
  }

  await context.close();
  console.log(
    `  ${mode}: full page + ${SECTIONS.length} sections (${forced} forced states)`,
  );
}

// ---------------------------------------------------------------------------

if (!process.argv.includes('--no-build')) {
  console.log('▸ Building @tecton/docs');
  run('pnpm', ['--filter', '@tecton/docs', 'build'], ROOT);
}

if (!fs.existsSync(path.join(DOCS, 'dist', 'index.html'))) {
  throw new Error('apps/docs/dist is missing — run without --no-build.');
}

await fsp.mkdir(OUT, {recursive: true});

console.log(`▸ Serving apps/docs/dist on :${PORT}`);
const server = spawn(
  'pnpm',
  ['exec', 'vite', 'preview', '--port', String(PORT), '--strictPort'],
  {cwd: DOCS, stdio: 'ignore'},
);

try {
  await waitForServer(`http://localhost:${PORT}/preview/theme`);

  console.log('▸ Capturing');
  const browser = await chromium.launch();
  try {
    await capture(browser, 'dark');
    await capture(browser, 'light');
  } finally {
    await browser.close();
  }
  console.log(`\nWrote ${path.relative(ROOT, OUT)}/*.png\n`);
} finally {
  server.kill('SIGTERM');
}
