/**
 * The audit.
 *
 * Starts two Vite dev servers — one serving the examples on `@tecton/react`
 * (the Tecton theme), one serving the identical files rewritten onto
 * `@astryxdesign/core` under `@astryxdesign/theme-neutral`, which is the theme
 * upstream's own docs site renders its examples with — then, for every example:
 *
 *   a. screenshots both renders (Tecton dark, Tecton light, neutral dark);
 *   b. diffs the two element trees box by box;
 *   c. tabs through the Tecton render and checks every stop draws a visible,
 *      unclipped, ≥3:1 focus ring, comparing against the neutral render.
 *
 * Usage:
 *   node scripts/audit.mjs [--out <dir>] [--only <substring>] [--limit N]
 *                          [--shots <all|findings|none>] [--light]
 */
import {build, preview} from 'vite';
import {chromium} from '@playwright/test';
import {mkdir, writeFile, rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = fileURLToPath(new URL('..', import.meta.url));
const PROBE = path.join(HERE, 'scripts', 'probe.js');

// --------------------------------------------------------------------- args

function parseArgs(argv) {
  const args = {
    out: path.join(HERE, '.audit'),
    only: null,
    limit: Infinity,
    shots: 'findings',
    light: false,
    port: 5198,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out') args.out = path.resolve(argv[(i += 1)]);
    else if (arg === '--only') args.only = argv[(i += 1)];
    else if (arg === '--limit') args.limit = Number(argv[(i += 1)]);
    else if (arg === '--shots') args.shots = argv[(i += 1)];
    else if (arg === '--light') args.light = true;
    else if (arg === '--port') args.port = Number(argv[(i += 1)]);
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

// ------------------------------------------------------------------ servers

/**
 * Build one side and serve it static.
 *
 * Not a dev server: the package and core together are about 1700 ES modules,
 * and a dev server hands every one of them to the browser as its own request
 * with its own transform. That is fine for one page and hours for 646. Bundled
 * once up front, a page load is two requests, and the whole catalogue fits in
 * the time a couple of hundred examples used to take.
 */
async function startServer(side, port) {
  process.stdout.write(`  building ${side}\n`);
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
  return {server, origin: `http://localhost:${port}`};
}

// --------------------------------------------------------------------- diff

/** How much a box may differ before it counts as a geometry difference. */
const BOX_TOLERANCE = 0.15;
/** Below this, a percentage difference on a tiny box is just rounding. */
const MIN_ABS_DELTA = 1.5;
/** An icon is held to its exact size, give or take subpixel rounding. */
const SVG_TOLERANCE = 0.5;
/** How long to let a render settle before measuring it. */
const SETTLE_MS = 500;

/**
 * Controls the *reference* theme resizes.
 *
 * The neutral theme is the reference for "not broken", not for "unstyled": it
 * makes geometric decisions of its own, and where it does, Tecton differing
 * from it says nothing. `segmented-control-item` is the one control it
 * resizes — `neutralTheme.ts` sets every size to
 * `calc(var(--size-element-*) - 8px)` where the component's own is `- 4px`, to
 * give the strip a roomier inset. Tecton is the side agreeing with the
 * component there.
 */
const REFERENCE_THEME_RESIZES = ['astryx-segmented-control-item'];

function relDiff(a, b) {
  const scale = Math.max(Math.abs(a), Math.abs(b));
  if (scale === 0) return 0;
  return Math.abs(a - b) / scale;
}

const CONTROL_CLASSES = [
  'astryx-button',
  'astryx-icon-button',
  'astryx-text-input',
  'astryx-text-area',
  'astryx-selector',
  'astryx-segmented-control-item',
  'astryx-toggle-button',
  'astryx-switch',
  'astryx-tab',
  'astryx-token',
  'astryx-badge',
];

function isControl(row) {
  return CONTROL_CLASSES.some(cls => row.astryx.split(' ').includes(cls));
}

/**
 * A theme is allowed to repaint anything. It is not allowed to make a prop stop
 * mattering: if two elements of the same kind carry different `data-variant`
 * (or `data-elevation`) values and upstream paints them differently, a theme
 * that paints them identically has overridden the component's own prop with a
 * `base` rule.
 */
function findVariantCollapse(tecton, neutral) {
  const findings = [];
  const groups = new Map();
  const byPath = new Map(neutral.rows.map(row => [row.path, row]));
  for (const row of tecton.rows) {
    if (!row.astryx || !row.variant) continue;
    const other = byPath.get(row.path);
    if (!other || other.astryx !== row.astryx) continue;
    const list = groups.get(row.astryx) ?? [];
    list.push([row, other]);
    groups.set(row.astryx, list);
  }
  for (const [astryx, pairs] of groups) {
    const variants = new Set(pairs.map(([row]) => row.variant));
    if (variants.size < 2) continue;
    const tectonPaints = new Set(pairs.map(([row]) => row.bg));
    const neutralPaints = new Set(pairs.map(([, other]) => other.bg));
    if (neutralPaints.size > 1 && tectonPaints.size === 1) {
      findings.push({
        kind: 'variant-collapse',
        path: pairs[0][0].path,
        label: astryx,
        variants: [...variants].join(','),
        tecton: [...tectonPaints][0],
        neutral: `${neutralPaints.size} distinct`,
      });
    }
  }

  // The same argument for `elevation`, which a theme collapses by setting
  // `boxShadow` on a component's base rather than on its elevation states.
  const lifts = new Map();
  for (const row of tecton.rows) {
    if (!row.astryx || !row.elevation) continue;
    const other = byPath.get(row.path);
    if (!other || other.astryx !== row.astryx) continue;
    const list = lifts.get(row.astryx) ?? [];
    list.push([row, other]);
    lifts.set(row.astryx, list);
  }
  for (const [astryx, pairs] of lifts) {
    if (new Set(pairs.map(([row]) => row.elevation)).size < 2) continue;
    const tectonShadows = new Set(pairs.map(([row]) => row.shadow));
    const neutralShadows = new Set(pairs.map(([, other]) => other.shadow));
    if (neutralShadows.size > 1 && tectonShadows.size === 1) {
      findings.push({
        kind: 'elevation-collapse',
        path: pairs[0][0].path,
        label: astryx,
        tecton: [...tectonShadows][0] || '(none)',
        neutral: `${neutralShadows.size} distinct`,
      });
    }
  }
  return findings;
}

function diffTrees(tecton, neutral) {
  const byPath = new Map(neutral.rows.map(row => [row.path, row]));
  const findings = [];
  // Differences that are the type scale doing its job, kept apart from breaks.
  const typography = [];

  /**
   * Every element whose box a type difference can explain.
   *
   * An element with a different `font-size` is the obvious case, but a block
   * that only *contains* differently-typed text measures differently too, and
   * all the way up: Tecton's `large` is 16/1.25 where upstream computes
   * 17/1.41, so the card around the paragraph around the heading is 4px
   * shorter, and none of that is a break. The set is built by walking each
   * differing element's ancestors, which the structural paths make trivial.
   *
   * Controls are exempt from the exemption: `control-height` is checked
   * unconditionally below, because a control's height comes from
   * `--size-element-*`, which Tecton and upstream both set to 28/32/36.
   */
  const tainted = new Set();
  for (const row of tecton.rows) {
    const other = byPath.get(row.path);
    if (!other) continue;
    const typeDiffers =
      row.fontSize !== other.fontSize || row.lineHeight !== other.lineHeight;
    if (!typeDiffers && row.padding === other.padding) continue;
    let prefix = row.path;
    for (;;) {
      tainted.add(prefix);
      const cut = prefix.lastIndexOf('/');
      if (cut < 0) break;
      prefix = prefix.slice(0, cut);
    }
  }

  for (const row of tecton.rows) {
    const other = byPath.get(row.path);
    if (!other) {
      findings.push({kind: 'missing-in-neutral', path: row.path, tag: row.tag});
      continue;
    }
    if (row.tag !== other.tag) continue;
    const label = row.astryx || row.tag;

    if (row.tag === 'svg') {
      // An `svg` sized in `em` follows whatever type it sits in, so an icon in
      // differently-typed surroundings comes out a different size on purpose.
      if (
        Math.abs(row.w - other.w) > SVG_TOLERANCE ||
        Math.abs(row.h - other.h) > SVG_TOLERANCE
      ) {
        const typed = tainted.has(row.path);
        (typed ? typography : findings).push({
          kind: typed ? 'type-svg-size' : 'svg-size',
          path: row.path,
          label,
          tecton: `${row.w}x${row.h}`,
          neutral: `${other.w}x${other.h}`,
        });
      }
      continue;
    }

    // Tecton's type scale is deliberately not upstream's — 14px body at 1.286
    // where upstream computes 14px at 1.4286, `large` at 16/1.25 where upstream
    // has 17/1.41. An element whose own font differs is therefore expected to
    // measure differently; that is the *look*, not a break. It is recorded
    // separately so the report can show it without it counting as a finding.
    const sameType = !tainted.has(row.path);
    const bucket = sameType ? findings : typography;

    const dw = relDiff(row.w, other.w);
    const dh = relDiff(row.h, other.h);
    if (dw > BOX_TOLERANCE && Math.abs(row.w - other.w) > MIN_ABS_DELTA) {
      bucket.push({
        kind: sameType ? 'width' : 'type-width',
        path: row.path,
        label,
        tecton: row.w,
        neutral: other.w,
        pct: Math.round(dw * 100),
      });
    }
    if (dh > BOX_TOLERANCE && Math.abs(row.h - other.h) > MIN_ABS_DELTA) {
      bucket.push({
        kind: sameType ? 'height' : 'type-height',
        path: row.path,
        label,
        tecton: row.h,
        neutral: other.h,
        pct: Math.round(dh * 100),
        font: sameType
          ? undefined
          : `${row.fontSize}/${row.lineHeight} vs ${other.fontSize}/${other.lineHeight}`,
      });
    }
    // A control whose own height is its content's — a `TextArea` is `rows`
    // line boxes tall, a `Selector` grows with its option descriptions — is
    // exempt for the same reason everything else is. A control with a height
    // from `--size-element-*` is not: its label's leading cannot move it, so a
    // difference there is the theme having resized the control.
    if (
      isControl(row) &&
      sameType &&
      Math.abs(row.h - other.h) > MIN_ABS_DELTA &&
      row.padding === other.padding &&
      !REFERENCE_THEME_RESIZES.some(cls => row.astryx.split(' ').includes(cls))
    ) {
      findings.push({
        kind: 'control-height',
        path: row.path,
        label,
        tecton: row.h,
        neutral: other.h,
      });
    }
    if (row.overflows && !other.overflows) {
      // Text that clips because it is set at a different leading is the type
      // scale reaching a fixed-height container, not a geometry break.
      bucket.push({
        kind: sameType ? 'overflow' : 'type-overflow',
        path: row.path,
        label,
      });
    }
    if (
      row.lines != null &&
      other.lines != null &&
      row.lines !== other.lines &&
      Math.abs(row.h - other.h) > MIN_ABS_DELTA
    ) {
      (sameType ? findings : typography).push({
        kind: sameType ? 'wrap' : 'type-wrap',
        path: row.path,
        label,
        tecton: row.lines,
        neutral: other.lines,
      });
    }
    // Radius *values* are Tecton's to change. The pattern of square vs rounded
    // corners is not: it is how the components draw connected controls, so a
    // theme that turns `r00r` into `rrrr` has taken a button group apart.
    if (
      row.corners !== other.corners &&
      other.corners.includes('0') &&
      !row.corners.includes('0')
    ) {
      findings.push({
        kind: 'corner-shape',
        path: row.path,
        label,
        tecton: row.corners,
        neutral: other.corners,
      });
    }
  }
  findings.push(...findVariantCollapse(tecton, neutral));

  return {findings, typography};
}

// --------------------------------------------------------------------- shot

/**
 * A capture of the stage, bounded by the viewport.
 *
 * Not an element screenshot and not a clip: a handful of the 646 examples lay
 * out to tens of thousands of pixels, and asking Chromium for a region outside
 * the viewport makes it composite the whole page — a capture of one of those
 * filled the disk with a multi-gigabyte temporary and took the renderer with
 * it. A plain viewport capture shows the top 1100x900 of the example, which is
 * what the audit needs to look at, and costs the same for every example.
 */
async function shoot(page, file) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path: file});
}

// -------------------------------------------------------------------- focus

const MIN_RING_CONTRAST = 3;

async function tabThrough(page, maxStops) {
  const stops = [];
  await page.evaluate(() => {
    window.__snapshotResting();
    const first = document.getElementById('stage');
    if (first) first.scrollIntoView();
    if (
      document.activeElement &&
      document.activeElement !== document.body &&
      document.activeElement.blur
    ) {
      document.activeElement.blur();
    }
  });
  const seen = new Set();
  for (let i = 0; i < maxStops; i += 1) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => window.__describeActive());
    if (stop == null) break;
    const key = `${stop.astryx}|${stop.tag}|${stop.label}|${i}`;
    if (seen.has(key)) break;
    seen.add(key);
    stops.push(stop);
  }
  return stops;
}

function auditFocus(tectonStops, neutralStops) {
  const findings = [];
  /** Focus behaviour that is the same in both themes: recorded, not charged. */
  const notes = [];
  for (let i = 0; i < tectonStops.length; i += 1) {
    const stop = tectonStops[i];
    const reference = neutralStops[i];
    if (!stop.focusVisible) continue;
    const label = stop.astryx || stop.tag;
    if (!stop.hasRing) {
      // Only Tecton's problem if upstream draws one here. A component that
      // ships a focusable element with no ring of its own (a scroll region, a
      // composer surface) is an upstream matter, and a theme cannot conjure a
      // ring onto an element whose CSS suppresses it.
      if (reference && reference.hasRing) {
        findings.push({
          kind: 'no-ring',
          index: i,
          label,
          text: stop.label,
        });
      } else {
        notes.push({
          kind: 'no-ring-either-theme',
          index: i,
          label,
          text: stop.label,
        });
      }
      continue;
    }
    // `outline-style: auto` is the browser's own ring. Chromium paints it as a
    // two-tone halo that stays visible on any backdrop and reports a
    // placeholder `outline-color`, so measuring that colour says nothing. It is
    // also the same ring upstream gets, since neither theme put it there.
    const uaRing = stop.outlineStyle === 'auto';
    if (!uaRing && stop.contrast > 0 && stop.contrast < MIN_RING_CONTRAST) {
      findings.push({
        kind: 'low-contrast-ring',
        index: i,
        label,
        text: stop.label,
        contrast: stop.contrast,
        colour: stop.outlineColor,
      });
    }
    if (stop.clipped && !(reference && reference.clipped)) {
      findings.push({
        kind: 'clipped-ring',
        index: i,
        label,
        text: stop.label,
        clipBy: stop.clipBy,
        offset: stop.outlineOffset,
        width: stop.outlineWidth,
      });
    }
  }
  return {findings, notes};
}

// ---------------------------------------------------------------------- run

async function main() {
  if (!existsSync(path.join(HERE, '..', '..', 'packages', 'react', 'dist'))) {
    throw new Error(
      'Build @tecton/react first: pnpm --filter @tecton/react build',
    );
  }
  await rm(args.out, {recursive: true, force: true});
  await mkdir(path.join(args.out, 'shots'), {recursive: true});

  const tectonSide = await startServer('tecton', args.port + 1);
  const neutralSide = await startServer('neutral', args.port);

  const consoleErrors = new Map();

  /**
   * One browser with three pages, rebuildable.
   *
   * A handful of the 646 examples lay out to tens of thousands of pixels, and
   * one of them is enough to take the renderer down. A crash used to end the
   * run and score every example after it as a failure, so the browser is
   * treated as disposable: `openBrowser()` can be called again, and the loop
   * retries the example that lost it.
   */
  let rig = null;
  async function openBrowser() {
    if (rig?.browser.isConnected()) {
      await rig.browser.close().catch(() => {});
    }
    const browser = await chromium.launch({
      args: ['--disable-dev-shm-usage'],
    });
    const context = await browser.newContext({
      viewport: {width: 1100, height: 900},
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    await context.addInitScript({path: PROBE});
    const pages = {
      'tecton-dark': await context.newPage(),
      'tecton-light': await context.newPage(),
      neutral: await context.newPage(),
    };
    const crashed = new Set();
    for (const [name, page] of Object.entries(pages)) {
      page.on('pageerror', error => {
        const list = consoleErrors.get(name) ?? [];
        if (list.length < 50) list.push(String(error.message).slice(0, 200));
        consoleErrors.set(name, list);
      });
      // A crashed page is not a closed page: Playwright keeps handing it out,
      // and every later call on it fails with "Page crashed". Without this the
      // first heavy example poisoned the whole rest of the run.
      page.on('crash', () => crashed.add(name));
    }
    rig = {browser, crashed, ...pages};
    return rig;
  }

  await openBrowser();
  const alive = () =>
    rig != null &&
    rig.browser.isConnected() &&
    rig.crashed.size === 0 &&
    !rig['tecton-dark'].isClosed() &&
    !rig.neutral.isClosed();

  // Discover the example list from the Tecton page.
  await rig['tecton-dark'].goto(`${tectonSide.origin}/tecton.html`);
  await rig['tecton-dark'].waitForFunction(
    () => window.__auditExampleIds != null,
    {timeout: 60_000},
  );
  let ids = await rig['tecton-dark'].evaluate(() => window.__auditExampleIds);
  if (args.only) ids = ids.filter(id => id.includes(args.only));
  ids = ids.slice(0, args.limit);

  const results = [];
  let index = 0;
  for (const id of ids) {
    index += 1;
    const slug = id.replace(/\//g, '__');
    const record = {
      id,
      ok: true,
      errors: [],
      structural: [],
      typography: [],
      focus: [],
    };
    if (!alive()) await openBrowser();
    const tectonDark = rig['tecton-dark'];
    const tectonLight = rig['tecton-light'];
    const neutral = rig.neutral;
    try {
      const darkUrl = `${tectonSide.origin}/tecton.html?ex=${encodeURIComponent(id)}&mode=dark`;
      const neutralUrl = `${neutralSide.origin}/neutral.html?ex=${encodeURIComponent(id)}&mode=dark`;
      await Promise.all([tectonDark.goto(darkUrl), neutral.goto(neutralUrl)]);
      const ready = page =>
        page
          .waitForFunction(
            () =>
              window.__auditReady != null ||
              document.querySelector('[data-audit-error]') != null,
            {timeout: 20_000},
          )
          .catch(() => null);
      await Promise.all([ready(tectonDark), ready(neutral)]);
      // Long enough for a layer to mount and a transition to finish. Several
      // examples open a BottomSheet or a tooltip on mount, and measuring one
      // render before it lands and the other after reads as a DOM difference
      // that has nothing to do with either theme.
      await Promise.all([
        tectonDark.waitForTimeout(SETTLE_MS),
        neutral.waitForTimeout(SETTLE_MS),
      ]);

      let [tectonTree, neutralTree] = await Promise.all([
        tectonDark.evaluate(() => window.__measure()),
        neutral.evaluate(() => window.__measure()),
      ]);
      if (tectonTree.error || neutralTree.error) {
        // Two retries: under load an example can still be settling when the
        // ready flag lands, and a dev server can drop a module request. A stage
        // that is genuinely missing stays missing through both.
        await tectonDark.waitForTimeout(500);
        [tectonTree, neutralTree] = await Promise.all([
          tectonDark.evaluate(() => window.__measure()),
          neutral.evaluate(() => window.__measure()),
        ]);
      }
      if (tectonTree.error || neutralTree.error) {
        await Promise.all([
          tectonTree.error ? tectonDark.reload() : null,
          neutralTree.error ? neutral.reload() : null,
        ]);
        await Promise.all([ready(tectonDark), ready(neutral)]);
        await tectonDark.waitForTimeout(300);
        [tectonTree, neutralTree] = await Promise.all([
          tectonDark.evaluate(() => window.__measure()),
          neutral.evaluate(() => window.__measure()),
        ]);
      }
      const renderError = await tectonDark.evaluate(() => {
        const el = document.querySelector('[data-audit-error]');
        return el ? el.getAttribute('data-audit-error') : null;
      });
      if (renderError) {
        record.ok = false;
        record.errors.push(`example threw: ${renderError.slice(0, 160)}`);
      } else if (tectonTree.error || neutralTree.error) {
        record.ok = false;
        record.errors.push(
          `measure failed (tecton: ${tectonTree.error ?? 'ok'}, neutral: ${neutralTree.error ?? 'ok'})`,
        );
      } else {
        const diff = diffTrees(tectonTree, neutralTree);
        record.structural = diff.findings;
        record.typography = diff.typography;
        record.counts = {
          tecton: tectonTree.rows.length,
          neutral: neutralTree.rows.length,
        };
      }

      const stops = await tectonDark.evaluate(() => window.__focusables());
      if (stops > 0) {
        const tectonStops = await tabThrough(
          tectonDark,
          Math.min(stops + 2, 30),
        );
        // The neutral render is only tabbed when there is something to compare
        // against: a stop with no ring, a low-contrast one, or a clipped one.
        // Most examples have none, and tabbing them twice was half the run.
        const suspect = tectonStops.some(
          stop =>
            stop.focusVisible &&
            (!stop.hasRing ||
              (stop.outlineStyle !== 'auto' &&
                stop.contrast > 0 &&
                stop.contrast < MIN_RING_CONTRAST) ||
              stop.clipped),
        );
        const neutralStops = suspect
          ? await tabThrough(neutral, Math.min(stops + 2, 30))
          : [];
        const focus = auditFocus(tectonStops, neutralStops);
        record.focus = focus.findings;
        record.focusNotes = focus.notes;
        record.stops = tectonStops.length;
        record.focusDetail = tectonStops;
      } else {
        record.stops = 0;
      }

      const hasFindings =
        record.structural.length > 0 || record.focus.length > 0;
      const wantShot =
        args.shots === 'all' || (args.shots === 'findings' && hasFindings);
      if (wantShot) {
        await shoot(
          tectonDark,
          path.join(args.out, 'shots', `${slug}.tecton-dark.png`),
        );
        await shoot(
          neutral,
          path.join(args.out, 'shots', `${slug}.neutral.png`),
        );
        if (args.light) {
          await tectonLight.goto(
            `${tectonSide.origin}/tecton.html?ex=${encodeURIComponent(id)}&mode=light`,
          );
          await ready(tectonLight);
          await tectonLight.waitForTimeout(120);
          await shoot(
            tectonLight,
            path.join(args.out, 'shots', `${slug}.tecton-light.png`),
          );
        }
      }
    } catch (error) {
      record.ok = false;
      record.errors.push(String(error.message).slice(0, 300));
      if (!alive()) {
        // The renderer went down on this example. Note it, rebuild the rig, and
        // carry on — the rest of the catalogue is still worth measuring.
        record.errors.push('renderer crashed; browser relaunched');
        await openBrowser();
      }
    }
    results.push(record);
    if (index % 25 === 0 || index === ids.length) {
      process.stdout.write(`  ${index}/${ids.length}\n`);
    }
  }

  await writeFile(
    path.join(args.out, 'results.json'),
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        examples: results.length,
        results,
        pageErrors: Object.fromEntries(consoleErrors),
      },
      null,
      2,
    ),
  );

  const structural = results.reduce((n, r) => n + r.structural.length, 0);
  const typeDiffs = results.reduce((n, r) => n + r.typography.length, 0);
  const focus = results.reduce((n, r) => n + r.focus.length, 0);
  const dirty = results.filter(
    r => r.structural.length > 0 || r.focus.length > 0,
  ).length;
  process.stdout.write(
    `\naudited ${results.length} examples\n` +
      `  ${dirty} with findings\n` +
      `  ${structural} structural findings\n` +
      `  ${focus} focus findings\n` +
      `  ${typeDiffs} type-scale differences (expected, not findings)\n` +
      `  → ${path.relative(process.cwd(), args.out)}/results.json\n`,
  );

  if (rig?.browser.isConnected()) await rig.browser.close();
  await tectonSide.server.close();
  await neutralSide.server.close();
}

main().then(
  () => process.exit(0),
  error => {
    process.stderr.write(`${error.stack ?? error}\n`);
    process.exit(1);
  },
);
