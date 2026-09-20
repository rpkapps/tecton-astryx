/**
 * The state audit.
 *
 * `audit.mjs` measures a **resting** render: it can see a control whose colour
 * is wrong and a control whose box is wrong, and it cannot see a control whose
 * colour is only wrong once you touch it. Everything a theme says about
 * hover, press and selection is invisible to it, which is how a `ToggleButton`
 * that painted nothing at all when pressed survived a clean run.
 *
 * So this one drives the controls. For every example it finds the stateful
 * controls — anything that carries `aria-pressed`, `role="switch"`, a
 * checkbox or radio, a tab, `aria-selected`, `aria-expanded`, a menu check
 * item, a tree item, a segmented radio, `aria-current`, a slider thumb, a
 * selectable card, a link — and captures the paint of the control **and its
 * visual descendants** in five conditions:
 *
 *   rest → hover → active (mouse down) → changed (after the click, pointer
 *   moved away) → focused (keyboard modality, no pointer)
 *
 * on both renders: Tecton dark and the same examples under upstream's
 * `@astryxdesign/theme-neutral`. `--light` adds a Tecton light capture, which
 * is recorded rather than charged.
 *
 * A finding is one of four things:
 *
 *   `flattened`      the neutral render's paint moves between rest and this
 *                    state and Tecton's does not — the theme has painted over
 *                    a state the component draws.
 *   `flat-hover`     the same, for hover specifically, which is the one state
 *                    a user meets without committing to anything.
 *   `indistinct`     Tecton's paint in this state is *identical* to Tecton's
 *                    hover paint, so the control cannot be told from one the
 *                    pointer happens to be over.
 *   `contrast`       ink inside the control, in this state, on the surface
 *                    that state paints behind it: under 4.5:1 for text, 3:1
 *                    for an icon (WCAG 1.4.3 / 1.4.11).
 *
 * Usage:
 *   node scripts/state-audit.mjs [--out <dir>] [--only <substring>]
 *                                [--limit N] [--light] [--port N]
 *                                [--shots <all|findings|none>]
 */
import {build, preview} from 'vite';
import {chromium} from '@playwright/test';
import {mkdir, writeFile, rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = fileURLToPath(new URL('..', import.meta.url));
const PROBE = path.join(HERE, 'scripts', 'probe.js');
const STATE_PROBE = path.join(HERE, 'scripts', 'state-probe.js');

// --------------------------------------------------------------------- args

function parseArgs(argv) {
  const args = {
    out: path.join(HERE, '.state-audit'),
    only: null,
    limit: Infinity,
    light: false,
    shots: 'none',
    port: 5298,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out') args.out = path.resolve(argv[(i += 1)]);
    else if (arg === '--only') args.only = argv[(i += 1)];
    else if (arg === '--limit') args.limit = Number(argv[(i += 1)]);
    else if (arg === '--light') args.light = true;
    else if (arg === '--shots') args.shots = argv[(i += 1)];
    else if (arg === '--port') args.port = Number(argv[(i += 1)]);
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

// ------------------------------------------------------------------ servers

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

// ---------------------------------------------------------------- capturing

/** How long a state transition is given to land before it is measured. */
const STATE_SETTLE = 160;
/** How long a fresh page is given to settle before its controls are found. */
const READY_SETTLE = 350;
/** The states captured for every control, in the order the driver walks them. */
const STATES = ['hover', 'active', 'changed', 'focused'];

/** The paint fields compared, in the order a row records them. */
const PAINT_FIELDS = [
  'bg',
  'bgImage',
  'color',
  'border',
  'shadow',
  'outline',
  'opacity',
  'transform',
  'weight',
  'decoration',
];

const COLOUR_IN_VALUE =
  /(?:rgba?|color|hsla?|oklch|oklab|lab|lch)\([^()]*\)|#[0-9a-fA-F]{3,8}\b/g;

/**
 * How far two colours may sit apart and still count as the same paint.
 *
 * Not zero, and that matters. Several of the reference theme's state styles
 * are a `color-mix()` with 5–15 % of a tint, and where the resting value is
 * already at one end of the ramp the mix moves a channel by two or three
 * units: upstream's link goes `#f1f1f1` → `#f3f3f3` on hover. Compared
 * exactly, that reads as "the reference paints a hover state", and any theme
 * that does not match it to the last digit is charged with flattening a state
 * nobody can see.
 *
 * Two yardsticks, because one is not enough. Four units out of 255 is below a
 * just-noticeable difference and above the rounding — but a flat channel count
 * is the wrong measure at the *dark* end, where the same mix takes `#1b1b1b`
 * to `#171717`: four units and change, and invisible. So a pair also counts as
 * the same paint when the two colours are within 1.06:1 of each other, which
 * is the instrument's own vocabulary and leaves a comfortable margin: the
 * smallest state change in either theme — a row lifting to its hover fill — is
 * 1.15:1.
 */
const COLOUR_TOLERANCE = 4;
const COLOUR_RATIO_TOLERANCE = 1.06;

const channelLuminance = value => {
  const s = Math.min(Math.max(value, 0), 255) / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const luminance = colour =>
  0.2126 * channelLuminance(colour.r) +
  0.7152 * channelLuminance(colour.g) +
  0.0722 * channelLuminance(colour.b);

const contrastBetween = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/** Parse the colour notations `getComputedStyle` actually returns. */
function parseColour(token) {
  const hex = /^#([0-9a-fA-F]{3,8})$/.exec(token);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3 || digits.length === 4) {
      digits = [...digits].map(char => char + char).join('');
    }
    if (digits.length !== 6 && digits.length !== 8) return null;
    const value = Number.parseInt(digits.slice(0, 6), 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
      a: digits.length === 8 ? Number.parseInt(digits.slice(6), 16) / 255 : 1,
    };
  }
  const fn = /^(rgba?|color)\(([^()]*)\)$/.exec(token);
  if (!fn) return null;
  let parts = fn[2]
    .trim()
    .split(/[\s,/]+/)
    .filter(Boolean);
  // `color(srgb r g b / a)` — drop the colour space and scale 0–1 to 0–255.
  let scale = 1;
  if (fn[1] === 'color') {
    if (parts[0] !== 'srgb') return null;
    parts = parts.slice(1);
    scale = 255;
  }
  const numbers = parts.map(Number);
  if (numbers.length < 3 || numbers.slice(0, 3).some(Number.isNaN)) return null;
  return {
    r: numbers[0] * scale,
    g: numbers[1] * scale,
    b: numbers[2] * scale,
    a: numbers.length > 3 && !Number.isNaN(numbers[3]) ? numbers[3] : 1,
  };
}

function colourDiffers(a, b) {
  const left = parseColour(a);
  const right = parseColour(b);
  if (!left || !right) return a !== b;
  // A fully transparent colour is the same paint whatever its channels say.
  if (left.a < 0.004 && right.a < 0.004) return false;
  if (Math.abs(left.a - right.a) > 0.02) return true;
  const withinChannels =
    Math.abs(left.r - right.r) <= COLOUR_TOLERANCE &&
    Math.abs(left.g - right.g) <= COLOUR_TOLERANCE &&
    Math.abs(left.b - right.b) <= COLOUR_TOLERANCE;
  if (withinChannels) return false;
  return contrastBetween(left, right) > COLOUR_RATIO_TOLERANCE;
}

/**
 * Two computed values, compared as "a skeleton plus a list of colours".
 *
 * The skeleton — everything that is not a colour — has to match exactly: a
 * shadow that gains an offset, an outline that changes style, a weight that
 * steps up are all real. The colours in it are compared with the tolerance
 * above, in order.
 */
function valueDiffers(a, b) {
  const left = String(a ?? '');
  const right = String(b ?? '');
  if (left === right) return false;
  const leftColours = left.match(COLOUR_IN_VALUE) ?? [];
  const rightColours = right.match(COLOUR_IN_VALUE) ?? [];
  if (leftColours.length !== rightColours.length) return true;
  if (
    left.replace(COLOUR_IN_VALUE, '<c>') !==
    right.replace(COLOUR_IN_VALUE, '<c>')
  ) {
    return true;
  }
  return leftColours.some((colour, index) =>
    colourDiffers(colour, rightColours[index]),
  );
}

/** Does this control paint differently in these two captures? */
function paintDiffers(a, b) {
  if (a == null || b == null) return a !== b;
  if (a.rows.length !== b.rows.length) return true;
  for (let i = 0; i < a.rows.length; i += 1) {
    const left = a.rows[i];
    const right = b.rows[i];
    if (left.path !== right.path || left.tag !== right.tag) return true;
    for (const field of PAINT_FIELDS) {
      if (valueDiffers(left[field], right[field])) return true;
    }
  }
  return false;
}

/**
 * Walk one control through every state and record what it paints in each.
 *
 * The click is the mouse-up of the `active` capture rather than a separate
 * one: pressing, looking, releasing and looking again is what a person does,
 * and it means the control is only actuated once.
 */
async function captureControl(page, control) {
  const shot = {};
  shot.rest = await page.evaluate(i => window.__paint(i), control.index);
  shot.stateRest = await page.evaluate(i => window.__stateOf(i), control.index);

  await page.mouse.move(control.x, control.y);
  await page.waitForTimeout(STATE_SETTLE);
  shot.hover = await page.evaluate(i => window.__paint(i), control.index);

  await page.mouse.down();
  await page.waitForTimeout(STATE_SETTLE);
  shot.active = await page.evaluate(i => window.__paint(i), control.index);

  await page.mouse.up();
  await page.waitForTimeout(STATE_SETTLE);
  // Out of the way, so what is left is the state and not the pointer.
  await page.mouse.move(2, 2);
  await page.waitForTimeout(STATE_SETTLE);
  shot.changed = await page.evaluate(i => window.__paint(i), control.index);
  shot.stateChanged = await page.evaluate(
    i => window.__stateOf(i),
    control.index,
  );

  // `:focus-visible` follows the modality of the last interaction, so the
  // keypress comes first and the focus is then moved programmatically — a
  // real Tab would land wherever the tab order says, not on this control.
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(
    i => window.__focusControl(i),
    control.index,
  );
  await page.waitForTimeout(STATE_SETTLE);
  shot.focused = focused
    ? await page.evaluate(i => window.__paint(i), control.index)
    : null;

  return shot;
}

async function loadExample(page, origin, file, id, mode = 'dark') {
  await page.goto(
    `${origin}/${file}?ex=${encodeURIComponent(id)}&mode=${mode}`,
  );
  await page
    .waitForFunction(
      () =>
        window.__auditReady != null ||
        document.querySelector('[data-audit-error]') != null,
      {timeout: 20_000},
    )
    .catch(() => null);
  await page.waitForTimeout(READY_SETTLE);
  await page.mouse.move(2, 2);
  return page.evaluate(() => window.__controls());
}

// ----------------------------------------------------------------- findings

/**
 * Controls whose state upstream does not paint either.
 *
 * A link is the honest case: `Link` underlines at rest and has no selected
 * state at all, so "the paint did not move" is the component's answer and not
 * the theme's. The rule below only ever fires when the *reference* moved, so
 * this list is belt and braces for the kinds where a spurious click (a link
 * that navigates, a slider the driver drags) makes the comparison meaningless.
 */
const NO_STATE_KINDS = new Set(['slider']);

function compare(tectonControls, neutralControls, id) {
  const findings = [];
  const byPath = new Map(
    neutralControls.map(entry => [`${entry.path}|${entry.kind}`, entry]),
  );

  for (const tecton of tectonControls) {
    const key = `${tecton.path}|${tecton.kind}`;
    const neutral = byPath.get(key);
    if (!neutral || !tecton.shot || !neutral.shot) continue;
    const label = tecton.astryx || tecton.tag;

    for (const state of STATES) {
      const tState = tecton.shot[state];
      const nState = neutral.shot[state];
      if (tState == null || nState == null) continue;
      if (NO_STATE_KINDS.has(tecton.kind)) continue;

      // A state neither render reached — a click that did not toggle, a
      // control the pointer could not settle on — compares nothing.
      if (state === 'changed') {
        const tMoved = tecton.shot.stateRest !== tecton.shot.stateChanged;
        const nMoved = neutral.shot.stateRest !== neutral.shot.stateChanged;
        if (!tMoved || !nMoved) continue;
      }

      const neutralMoved = paintDiffers(nState, neutral.shot.rest);
      const tectonMoved = paintDiffers(tState, tecton.shot.rest);
      if (neutralMoved && !tectonMoved) {
        findings.push({
          kind: state === 'hover' ? 'flat-hover' : 'flattened',
          id,
          state,
          control: tecton.kind,
          label,
          path: tecton.path,
          text: tecton.label,
        });
        continue;
      }
      // Two states that paint the same thing are one state. Hover is the one
      // worth checking against, because it is the state a pointer produces
      // without the user having chosen anything.
      if (
        state !== 'hover' &&
        tectonMoved &&
        tecton.shot.hover != null &&
        !paintDiffers(tState, tecton.shot.hover) &&
        paintDiffers(nState, neutral.shot.hover)
      ) {
        findings.push({
          kind: 'indistinct',
          id,
          state,
          control: tecton.kind,
          label,
          path: tecton.path,
          text: tecton.label,
        });
      }
    }

    // Contrast, in every state including rest: the ink a state paints has to
    // be readable on the surface that state paints behind it.
    for (const state of ['rest', ...STATES]) {
      const paint = tecton.shot[state];
      if (!paint) continue;
      for (const ink of paint.inks) {
        if (ink.ratio >= ink.need) continue;
        // Only Tecton's problem when the reference clears the same bar; a
        // component that ships unreadable ink is an upstream matter.
        const reference = neutral.shot[state]?.inks.find(
          other => other.path === ink.path,
        );
        if (reference && reference.ratio < reference.need) continue;
        findings.push({
          kind: 'contrast',
          id,
          state,
          control: tecton.kind,
          label,
          path: tecton.path,
          text: ink.sample,
          ink: ink.kind,
          colour: ink.colour,
          on: ink.on,
          ratio: ink.ratio,
          need: ink.need,
        });
      }
    }
  }
  return findings;
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

  let rig = null;
  async function openBrowser() {
    if (rig?.browser.isConnected()) await rig.browser.close().catch(() => {});
    const browser = await chromium.launch({args: ['--disable-dev-shm-usage']});
    const context = await browser.newContext({
      viewport: {width: 1100, height: 900},
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    await context.addInitScript({path: PROBE});
    await context.addInitScript({path: STATE_PROBE});
    const pages = {
      tecton: await context.newPage(),
      neutral: await context.newPage(),
      light: args.light ? await context.newPage() : null,
    };
    const crashed = new Set();
    for (const [name, page] of Object.entries(pages)) {
      if (!page) continue;
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
    !rig.tecton.isClosed() &&
    !rig.neutral.isClosed();

  await rig.tecton.goto(`${tectonSide.origin}/tecton.html`);
  await rig.tecton.waitForFunction(() => window.__auditExampleIds != null, {
    timeout: 60_000,
  });
  let ids = await rig.tecton.evaluate(() => window.__auditExampleIds);
  if (args.only) ids = ids.filter(id => id.includes(args.only));
  ids = ids.slice(0, args.limit);

  const results = [];
  let index = 0;
  let controlsSeen = 0;
  for (const id of ids) {
    index += 1;
    const record = {id, ok: true, errors: [], controls: 0, findings: []};
    if (!alive()) await openBrowser();
    try {
      const [tectonList, neutralList] = await Promise.all([
        loadExample(rig.tecton, tectonSide.origin, 'tecton.html', id),
        loadExample(rig.neutral, neutralSide.origin, 'neutral.html', id),
      ]);
      const count = Math.min(tectonList.length, neutralList.length);
      record.controls = tectonList.length;
      controlsSeen += tectonList.length;
      if (count === 0) {
        results.push(record);
        if (index % 25 === 0 || index === ids.length) {
          process.stdout.write(`  ${index}/${ids.length}\n`);
        }
        continue;
      }

      const tectonShots = [];
      const neutralShots = [];
      for (let i = 0; i < count; i += 1) {
        // Every control starts from a clean page: a click on one control can
        // move another (a radio group, an accordion, a menu that opens over
        // the next one), and a "rest" measured after that is not rest.
        const lists =
          i === 0
            ? [tectonList, neutralList]
            : await Promise.all([
                loadExample(rig.tecton, tectonSide.origin, 'tecton.html', id),
                loadExample(
                  rig.neutral,
                  neutralSide.origin,
                  'neutral.html',
                  id,
                ),
              ]);
        if (lists[0][i] == null || lists[1][i] == null) break;
        const [tectonShot, neutralShot] = await Promise.all([
          captureControl(rig.tecton, lists[0][i]),
          captureControl(rig.neutral, lists[1][i]),
        ]);
        tectonShots.push({...lists[0][i], shot: tectonShot});
        neutralShots.push({...lists[1][i], shot: neutralShot});
      }

      record.findings = compare(tectonShots, neutralShots, id);
      record.detail = tectonShots.map(entry => ({
        kind: entry.kind,
        path: entry.path,
        astryx: entry.astryx,
        label: entry.label,
        moved: entry.shot.stateRest !== entry.shot.stateChanged,
      }));

      if (args.light && rig.light) {
        // Recorded, not charged: the design was transcribed from the dark
        // rendering, and light is derived from it.
        const lightList = await loadExample(
          rig.light,
          tectonSide.origin,
          'tecton.html',
          id,
          'light',
        );
        record.lightControls = lightList.length;
        if (lightList.length > 0) {
          const shot = await captureControl(rig.light, lightList[0]);
          record.light = {
            control: lightList[0].kind,
            inks: Object.fromEntries(
              ['rest', ...STATES].map(state => [
                state,
                (shot[state]?.inks ?? []).filter(ink => ink.ratio < ink.need),
              ]),
            ),
          };
        }
      }

      if (
        args.shots === 'all' ||
        (args.shots === 'findings' && record.findings.length > 0)
      ) {
        const slug = id.replace(/\//g, '__');
        await rig.tecton.screenshot({
          path: path.join(args.out, 'shots', `${slug}.tecton.png`),
        });
        await rig.neutral.screenshot({
          path: path.join(args.out, 'shots', `${slug}.neutral.png`),
        });
      }
    } catch (error) {
      record.ok = false;
      record.errors.push(String(error.message).slice(0, 300));
      if (!alive()) {
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
      {generated: new Date().toISOString(), examples: results.length, results},
      null,
      2,
    ),
  );

  const all = results.flatMap(r => r.findings);
  const by = kind => all.filter(f => f.kind === kind).length;
  process.stdout.write(
    `\naudited ${results.length} examples, ${controlsSeen} stateful controls\n` +
      `  ${results.filter(r => r.findings.length > 0).length} examples with findings\n` +
      `  ${by('flattened')} flattened states\n` +
      `  ${by('flat-hover')} flat hovers\n` +
      `  ${by('indistinct')} states indistinguishable from hover\n` +
      `  ${by('contrast')} contrast failures\n` +
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
