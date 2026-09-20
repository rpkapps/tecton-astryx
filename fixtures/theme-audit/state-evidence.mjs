/*
 * Ad-hoc: capture the before/after/reference triples the "States and paints"
 * part of `docs/design/theme-audit.md` cites.
 *
 *   node state-evidence.mjs <outDir> before      # on the old dist/
 *   node state-evidence.mjs <outDir> after       # on the new one
 *   node state-evidence.mjs <outDir> neutral     # the reference render
 *
 * Unlike `evidence.mjs`, which captures resting renders, every entry here may
 * name a control to put into a state first — a toggle to press, a row to hover
 * — because the whole point of these pictures is the state.
 */
import {build, preview} from 'vite';
import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const out = path.resolve(process.argv[2] ?? '.audit/state-evidence');
const suffix = process.argv[3] ?? 'before';
const side = suffix === 'neutral' ? 'neutral' : 'tecton';

/**
 * [name, example id, {hover, press, click}] — a CSS selector inside `#stage`
 * to put into the named state before the shot, or nothing for a resting one.
 */
const SHOTS = [
  ['toggle-button-pressed', 'ToggleButton/ToggleButtonStates', {}],
  [
    'toggle-button-hover',
    'ToggleButton/ToggleButtonStates',
    {hover: '[aria-pressed="true"]'},
  ],
  ['switch', 'Switch/SwitchShowcase', {}],
  ['switch-hover', 'Switch/SwitchShowcase', {hover: '[role="switch"]'}],
  ['text-input-validation', 'TextInput/TextInputStates', {}],
  ['checkbox', 'CheckboxInput/CheckboxInputShowcase', {}],
  [
    'checkbox-hover',
    'CheckboxInput/CheckboxInputShowcase',
    {hover: 'input[type="checkbox"]:checked'},
  ],
  ['radio', 'RadioList/RadioListShowcase', {}],
  ['link-hover', 'Link/LinkShowcase', {hover: 'a[href]'}],
];

const port = side === 'neutral' ? 5701 : 5702;
await build({
  configFile: path.join(HERE, 'vite.config.ts'),
  mode: side,
  logLevel: 'warn',
});
const server = await preview({
  configFile: path.join(HERE, 'vite.config.ts'),
  mode: side,
  preview: {port, strictPort: true},
  logLevel: 'warn',
});
const origin = `http://localhost:${port}`;
const file = side === 'neutral' ? 'neutral.html' : 'tecton.html';

mkdirSync(out, {recursive: true});
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: {width: 760, height: 620},
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const page = await context.newPage();

for (const [name, example, how] of SHOTS) {
  await page.goto(
    `${origin}/${file}?ex=${encodeURIComponent(example)}&mode=dark`,
  );
  await page
    .waitForFunction(() => window.__auditReady != null, {timeout: 20_000})
    .catch(() => null);
  await page.waitForTimeout(500);
  try {
    if (how.hover || how.press || how.click) {
      const selector = how.hover ?? how.press ?? how.click;
      const box = await page.evaluate(sel => {
        const el = document.querySelector(`#stage ${sel}`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {x: r.left + r.width / 2, y: r.top + r.height / 2};
      }, selector);
      if (box) {
        await page.mouse.move(box.x, box.y);
        if (how.press || how.click) await page.mouse.down();
        await page.waitForTimeout(250);
        if (how.click) {
          await page.mouse.up();
          await page.mouse.move(2, 2);
          await page.waitForTimeout(250);
        }
      }
    }
    const stage = await page.$('#stage');
    const box = await stage?.boundingBox();
    await page.screenshot({
      path: path.join(out, `${name}-${suffix}.png`),
      clip: box
        ? {
            x: 0,
            y: 0,
            width: Math.min(760, Math.ceil(box.x + box.width) + 16),
            height: Math.min(620, Math.ceil(box.y + box.height) + 16),
          }
        : undefined,
    });
    if (how.press) await page.mouse.up();
    process.stdout.write(`  ${name}-${suffix}\n`);
  } catch (error) {
    process.stderr.write(`  ${name}: ${String(error.message).slice(0, 160)}\n`);
  }
}

await browser.close();
await server.close();
process.stdout.write(`→ ${out}\n`);
process.exit(0);
