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
 * [name, example id, {hover, press, click, clickThenHover, width}] — a selector inside
 * `#stage` to put into the named state before the shot, or nothing for a
 * resting one, plus the capture width when the default 620 cuts something off.
 */
const SHOTS = [
  ['toggle-button-pressed', 'ToggleButton/ToggleButtonStates', {}],
  [
    'toggle-button-hover',
    'ToggleButton/ToggleButtonStates',
    {hover: '[aria-pressed="true"]'},
  ],
  ['switch-on', 'Switch/SwitchShowcase', {}],
  ['switch-off', 'Switch/SwitchShowcase', {click: '[role="switch"]'}],
  ['switch-hover', 'Switch/SwitchShowcase', {hover: '[role="switch"]'}],
  ['text-input-validation', 'TextInput/TextInputStates', {}],
  ['checkbox', 'CheckboxInput/CheckboxInputShowcase', {}],
  [
    'checkbox-hover',
    'CheckboxInput/CheckboxInputShowcase',
    {hover: 'input[type="checkbox"]:checked'},
  ],
  [
    'radio-hover',
    'RadioList/RadioListShowcase',
    {clickThenHover: 'input[type="radio"]'},
  ],
  ['link-hover', 'Link/LinkShowcase', {hover: 'a[href]'}],
  // §15 — a fill colour used as ink: the Stepper's accent glyphs and its
  // number badge, and an accent-coloured Icon on a toggle.
  ['accent-as-ink', 'Stepper/StepperShowcase', {width: 900}],
  // §16 — the press wash under a side-nav item's glyph.
  [
    'pressed-row',
    'SideNav/SideNavShowcase',
    {press: 'a[href="/projects"]', width: 520},
  ],
  // §17 — the ghost ink of a banner's collapse chevron on a severity fill.
  ['banner-ghost', 'Banner/BannerCollapsibleContent', {width: 960}],
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
  viewport: {width: 980, height: 620},
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const page = await context.newPage();

for (const [name, example, how] of SHOTS) {
  const width = how.width ?? 620;
  await page.goto(
    `${origin}/${file}?ex=${encodeURIComponent(example)}&mode=dark`,
  );
  await page
    .waitForFunction(() => window.__auditReady != null, {timeout: 20_000})
    .catch(() => null);
  await page.waitForTimeout(500);
  try {
    if (how.hover || how.press || how.click || how.clickThenHover) {
      const selector =
        how.hover ?? how.press ?? how.click ?? how.clickThenHover;
      const box = await page.evaluate(sel => {
        const el = document.querySelector(`#stage ${sel}`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {x: r.left + r.width / 2, y: r.top + r.height / 2};
      }, selector);
      if (box) {
        await page.mouse.move(box.x, box.y);
        if (how.press || how.click || how.clickThenHover) {
          await page.mouse.down();
        }
        await page.waitForTimeout(250);
        if (how.click || how.clickThenHover) {
          await page.mouse.up();
          // `clickThenHover` leaves the pointer where it clicked, so the shot
          // shows a control both in its new state and under the mouse.
          if (how.click) await page.mouse.move(2, 2);
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
            width: Math.min(width, Math.ceil(box.x + box.width) + 16),
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
