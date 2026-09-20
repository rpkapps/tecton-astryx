#!/usr/bin/env node
/**
 * Registry verification: can a real consumer install `@tecton/react` from a
 * real registry and build against it — including two versions on one page?
 *
 * Every other check in this repository reads the package through the
 * workspace: `pnpm check` builds `fixtures/consumers/vite-app` with
 * `@tecton/react` symlinked into place, and `pnpm check:mfe` derives its
 * second "version" by editing a copy of `dist/`. Both are useful and neither
 * touches the thing a consumer actually does: `npm install` a tarball a
 * registry served, and get a working package out of it. The publish surface —
 * `files`, `exports`, the vendored upstream library, the dependency tree npm
 * resolves — is only exercised by publishing.
 *
 * So this script does exactly that, end to end and entirely on this machine:
 *
 *   1. starts a throwaway Verdaccio on a free port, with empty storage and an
 *      npmjs uplink (so the consumers' own dependencies resolve normally);
 *   2. builds the package, publishes it as version A = whatever
 *      `packages/react/package.json` says, then derives version B — the patch
 *      version bumped, `--color-accent` retuned and the card's padding moved
 *      one step up the spacing scale — and publishes that too;
 *   3. installs and builds `fixtures/consumers/registry-vite-app` with plain
 *      `npm` (not pnpm), and asserts in Chromium that the built page is
 *      themed and that the vendored upstream patches travelled with it;
 *   4. installs and builds `fixtures/consumers/registry-mfe-page`, which puts
 *      version A and version B on one page as two independently bundled
 *      containers, and asserts the multi-version behaviour against two copies
 *      that were really published and really installed;
 *   5. tears the registry down and prints what it checked.
 *
 * It is NOT part of `pnpm check`: it publishes, installs from the network and
 * launches a browser. Run it before a release.
 *
 *   pnpm verify:registry
 *   pnpm verify:registry --no-build    reuse packages/react/dist as it is
 *   pnpm verify:registry --keep        leave the registry running afterwards
 *
 * Nothing under `packages/react/` is modified: version B is derived in a copy
 * under `node_modules/.cache/verdaccio/`. The two fixtures' `package.json`
 * pins are rewritten to the versions actually published and restored before
 * the script exits, including on failure.
 *
 * Chromium is expected to be installed already (`PLAYWRIGHT_BROWSERS_PATH`);
 * this script never downloads one.
 */
import {execFileSync, spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE = path.join(ROOT, 'packages', 'react');
const CACHE = path.join(ROOT, 'node_modules', '.cache', 'verdaccio');
const APP = path.join(ROOT, 'fixtures', 'consumers', 'registry-vite-app');
const MFE = path.join(ROOT, 'fixtures', 'consumers', 'registry-mfe-page');

const NO_BUILD = process.argv.includes('--no-build');
const KEEP = process.argv.includes('--keep');

/** Version B's retuned accent. Visible, and nothing else in the theme is it. */
const B_ACCENT = 'light-dark(#b8336a, #ff5fa2)';

/** Every stylesheet a built version ships, relative to `dist/`. */
const STYLESHEETS = [
  'tecton.css',
  'tecton-no-reset.css',
  'tecton-tokens.css',
  'tecton-components.css',
  'tecton-components-no-reset.css',
  'theme/theme.css',
  'css/tecton-theme.css',
  'css/tecton-components.css',
];

/** The two upstream patches, as they are keyed inside the vendored library. */
const PATCH_MARKERS = [
  '@astryxdesign/core/scroll-lock/v1',
  '@astryxdesign/core/layer-stack/v1',
];

if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

/** @type {{area: string, check: string, ok: boolean, detail: string}[]} */
const rows = [];
let failures = 0;

const log = message => console.log(message);
const heading = message => console.log(`\n▸ ${message}`);

/** Record one assertion. Never throws: the run reports everything it can. */
function check(area, name, ok, detail = '') {
  rows.push({area, check: name, ok: Boolean(ok), detail: String(detail)});
  if (!ok) failures += 1;
  log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
  return Boolean(ok);
}

/** Record an assertion that must hold for the rest of the phase to mean anything. */
function require_(area, name, ok, detail = '') {
  if (!check(area, name, ok, detail)) {
    throw new Error(`${area}: ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function table() {
  const head = {area: 'AREA', check: 'CHECK', ok: null, detail: 'RESULT'};
  const all = [head, ...rows];
  const width = key => Math.max(...all.map(r => String(r[key]).length));
  const [wa, wc] = [width('area'), width('check')];
  const line = `  ${'-'.repeat(wa)}  --  ${'-'.repeat(wc)}  ${'-'.repeat(28)}`;
  log('');
  log(`  ${'AREA'.padEnd(wa)}      ${'CHECK'.padEnd(wc)}  RESULT`);
  log(line);
  for (const row of rows) {
    log(
      `  ${row.area.padEnd(wa)}  ${row.ok ? 'ok' : 'XX'}  ` +
        `${row.check.padEnd(wc)}  ${row.detail}`,
    );
  }
  log(line);
}

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

/**
 * Run a command, quietly. A failure re-throws with the captured output
 * attached, because a silent `npm install` that fails is a silent failure.
 */
function run(command, args, options = {}) {
  const {quiet = true, ...rest} = options;
  try {
    return execFileSync(command, args, {
      stdio: quiet ? 'pipe' : 'inherit',
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      ...rest,
    });
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join('\n');
    throw new Error(
      `${command} ${args.join(' ')} failed in ${rest.cwd ?? process.cwd()}\n${output}`,
      {cause: error},
    );
  }
}

/**
 * The environment for an `npm` child, with the parent package manager's own
 * registry configuration removed: `npm_config_registry` outranks the project
 * `.npmrc` this script writes, so running `pnpm verify:registry` would
 * otherwise send every install straight back to npmjs.
 */
function npmEnv() {
  const env = {...process.env};
  for (const key of Object.keys(env)) {
    if (/^npm_config_(registry|userconfig|globalconfig)$/i.test(key)) {
      delete env[key];
    }
  }
  return env;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const {port} = server.address();
      server.close(() => resolve(port));
    });
  });
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function reachable(url, timeoutMs = 1500) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Replace a file's contents, remembering the original for `restoreAll()`. */
const originals = new Map();
function patchFile(file, transform) {
  const before = fs.readFileSync(file, 'utf8');
  if (!originals.has(file)) originals.set(file, before);
  fs.writeFileSync(file, transform(before));
}
function restoreAll() {
  for (const [file, before] of originals) {
    try {
      fs.writeFileSync(file, before);
    } catch {
      /* the file is gone; nothing to restore */
    }
  }
  originals.clear();
}

/** Serve a directory over HTTP. Nothing clever on purpose. */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
async function serve(root) {
  const port = await freePort();
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
    if (!file.startsWith(root) || !fs.existsSync(file)) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  return {url: `http://127.0.0.1:${port}`, close: () => server.close()};
}

function walk(dir, visit, depth = 0) {
  let entries;
  try {
    entries = fs.readdirSync(dir, {withFileTypes: true});
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    visit(full, entry, depth);
    if (entry.isDirectory()) walk(full, visit, depth + 1);
  }
}

function filesIn(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  walk(dir, (full, entry) => {
    if (entry.isFile() && full.endsWith(extension)) out.push(full);
  });
  return out;
}

/** `light-dark(a, b)` → the half a document in `mode` resolves, as `rgb(...)`. */
function resolveColor(value, mode) {
  const raw = value.trim();
  if (raw.startsWith('rgb')) return raw;
  const lightDark = raw.match(/^light-dark\(\s*([^,]+?)\s*,\s*(.+?)\s*\)$/);
  const picked = lightDark ? lightDark[mode === 'dark' ? 2 : 1] : raw;
  const hex = picked.trim().match(/^#([0-9a-f]{6})$/i);
  if (!hex) return picked.trim();
  const n = parseInt(hex[1], 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

// ---------------------------------------------------------------------------
// 1. The registry
// ---------------------------------------------------------------------------

async function startRegistry() {
  heading('Starting a local registry');

  // A registry left running from an earlier session is not reused: its storage
  // may already hold a different build under the same version, and publishing
  // over it would fail. This one gets its own port and its own empty storage.
  if (await reachable('http://127.0.0.1:4873/-/ping')) {
    log('  note: something is already serving :4873 — leaving it alone');
  }

  fs.rmSync(CACHE, {recursive: true, force: true});
  const home = path.join(CACHE, 'registry');
  fs.mkdirSync(path.join(home, 'storage'), {recursive: true});

  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  const config = path.join(home, 'config.yaml');
  fs.writeFileSync(
    config,
    [
      'storage: ./storage',
      'uplinks:',
      '  npmjs:',
      '    url: https://registry.npmjs.org/',
      '    cache: true',
      'packages:',
      "  '@tecton/*':",
      '    access: $all',
      '    publish: $all',
      '    unpublish: $all',
      "  '@tecton-fixture/*':",
      '    access: $all',
      '    publish: $all',
      '    unpublish: $all',
      "  '**':",
      '    access: $all',
      '    publish: $all',
      '    proxy: npmjs',
      'server:',
      '  keepAliveTimeout: 60',
      'log: {type: stdout, format: pretty, level: warn}',
      '',
    ].join('\n'),
  );

  const logFile = fs.openSync(path.join(home, 'verdaccio.log'), 'a');
  // Its own process group: `npx` spawns the server as a child, and killing
  // only `npx` would leave a registry holding the port after this exits.
  const child = spawn(
    'npx',
    [
      '--yes',
      'verdaccio@6',
      '--config',
      config,
      '--listen',
      `127.0.0.1:${port}`,
    ],
    {cwd: home, stdio: ['ignore', logFile, logFile], detached: true},
  );
  child.on('error', error => {
    log(`  verdaccio failed to start: ${error.message}`);
  });

  const deadline = Date.now() + 90_000;
  let up = false;
  while (Date.now() < deadline) {
    if (await reachable(`${url}/-/ping`, 1000)) {
      up = true;
      break;
    }
    if (child.exitCode !== null) break;
    await sleep(500);
  }
  require_(
    'registry',
    'Verdaccio is serving',
    up,
    up ? url : `no /-/ping on ${url} (see ${home}/verdaccio.log)`,
  );

  return {
    url,
    home,
    stop() {
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        /* the group is already gone */
      }
      try {
        fs.closeSync(logFile);
      } catch {
        /* already closed */
      }
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Two versions, published
// ---------------------------------------------------------------------------

/** Write the `.npmrc` that points a directory at the local registry. */
function writeNpmrc(dir, registryUrl) {
  const host = registryUrl.replace(/^https?:/, '');
  patchFileOrCreate(
    path.join(dir, '.npmrc'),
    [
      `registry=${registryUrl}/`,
      `${host}/:_authToken=fake`,
      'audit=false',
      'fund=false',
      '',
    ].join('\n'),
  );
}

/** Like `patchFile`, but the file need not exist yet (it is removed on restore). */
const created = new Set();
function patchFileOrCreate(file, contents) {
  if (fs.existsSync(file)) {
    patchFile(file, () => contents);
  } else {
    created.add(file);
    fs.writeFileSync(file, contents);
  }
}
function removeCreated() {
  for (const file of created) fs.rmSync(file, {force: true});
  created.clear();
}

function bumpPatch(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(.*)$/);
  if (!match) throw new Error(`Cannot bump a non-semver version: ${version}`);
  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

/** Copy the built package into a staging directory and stamp it with `version`. */
function stage(dir, version) {
  fs.rmSync(dir, {recursive: true, force: true});
  fs.mkdirSync(dir, {recursive: true});
  fs.cpSync(path.join(PACKAGE, 'dist'), path.join(dir, 'dist'), {
    recursive: true,
  });
  const readme = path.join(PACKAGE, 'README.md');
  if (fs.existsSync(readme))
    fs.copyFileSync(readme, path.join(dir, 'README.md'));

  const manifest = JSON.parse(
    fs.readFileSync(path.join(PACKAGE, 'package.json'), 'utf8'),
  );
  manifest.version = version;
  // A published package carries neither: `devDependencies` are never installed
  // by a consumer, and a lifecycle script would run at publish time.
  delete manifest.devDependencies;
  delete manifest.scripts;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return manifest;
}

/**
 * Turn a staged copy into "the next release": one retuned theme token and one
 * per-component decision that moved with it.
 *
 * Both live in the built CSS as plain declarations inside the theme's own
 * `@scope`, because Tecton is a theme: it publishes the component system as it
 * is and every rule Tecton itself ships is a theme rule. Rewriting them here
 * therefore reproduces exactly what a rebuild from changed source would have
 * produced.
 */
function deriveVersionB(dir) {
  const sheet = file => path.join(dir, 'dist', file);
  const rewrite = (file, transform) => {
    if (!fs.existsSync(file)) return 0;
    const before = fs.readFileSync(file, 'utf8');
    const after = transform(before);
    if (after === before) return 0;
    fs.writeFileSync(file, after);
    return 1;
  };

  let tokenEdits = 0;
  for (const file of STYLESHEETS) {
    tokenEdits += rewrite(sheet(file), css =>
      // Only the plain `light-dark(...)` declaration: the media-variant blocks
      // that point the token at another token are left alone.
      css.replaceAll(
        /(--color-accent:\s*)light-dark\([^)]*\)/g,
        `$1${B_ACCENT}`,
      ),
    );
  }
  if (tokenEdits === 0) {
    throw new Error('No stylesheet carried a --color-accent declaration.');
  }

  // The card's padding: a per-component decision the theme makes, read out of
  // the built CSS rather than hard-coded, and moved one step up the scale.
  const CARD_PADDING = '--astryx-card-padding';
  const bundle = fs.readFileSync(sheet('tecton.css'), 'utf8');
  const declared = bundle.match(
    new RegExp(`${CARD_PADDING}:\\s*var\\(--spacing-(\\d+)\\)`),
  );
  if (!declared) {
    throw new Error(
      `No stylesheet set ${CARD_PADDING} from the spacing scale — has the theme's card override changed?`,
    );
  }
  const fromStep = Number(declared[1]);
  const toStep = fromStep * 2;
  let paddingEdits = 0;
  for (const file of STYLESHEETS) {
    paddingEdits += rewrite(sheet(file), css =>
      css.replaceAll(
        new RegExp(`(${CARD_PADDING}:\\s*)var\\(--spacing-${fromStep}\\)`, 'g'),
        `$1var(--spacing-${toStep})`,
      ),
    );
  }
  if (paddingEdits === 0) {
    throw new Error(`No stylesheet carried ${CARD_PADDING}`);
  }

  return {
    tokenEdits,
    paddingEdits,
    fromVar: `--spacing-${fromStep}`,
    toVar: `--spacing-${toStep}`,
  };
}

function publish(dir, registryUrl) {
  writeNpmrc(dir, registryUrl);
  run(
    'npm',
    ['publish', '--registry', `${registryUrl}/`, '--access', 'public'],
    {cwd: dir, env: npmEnv()},
  );
}

async function publishVersions(registry) {
  heading('Building and publishing two versions');

  if (NO_BUILD) {
    log('  --no-build: reusing packages/react/dist');
  } else {
    run('pnpm', ['--filter', '@tecton/react', 'build'], {
      cwd: ROOT,
      quiet: true,
    });
  }
  require_(
    'publish',
    '@tecton/react is built',
    fs.existsSync(path.join(PACKAGE, 'dist', 'tecton.css')),
    'dist/tecton.css',
  );

  const source = JSON.parse(
    fs.readFileSync(path.join(PACKAGE, 'package.json'), 'utf8'),
  );
  const a = source.version;
  const b = bumpPatch(a);

  const stageA = path.join(CACHE, 'pkg-a');
  const stageB = path.join(CACHE, 'pkg-b');
  stage(stageA, a);
  stage(stageB, b);
  const derived = deriveVersionB(stageB);
  const workspaceStill = JSON.parse(
    fs.readFileSync(path.join(PACKAGE, 'package.json'), 'utf8'),
  ).version;
  check(
    'publish',
    'version B was derived in a copy, not in the workspace',
    workspaceStill === a,
    `--color-accent in ${derived.tokenEdits} sheets, card padding ${derived.fromVar} → ${derived.toVar}`,
  );

  publish(stageA, registry.url);
  publish(stageB, registry.url);

  const meta = await (await fetch(`${registry.url}/@tecton%2freact`)).json();
  const published = Object.keys(meta.versions ?? {}).sort();
  require_(
    'publish',
    'both versions are in the registry',
    published.includes(a) && published.includes(b),
    `@tecton/react ${published.join(', ')}`,
  );
  // ...and the tarballs are really downloadable, not just named in metadata.
  const tarballs = await Promise.all(
    [a, b].map(async version => {
      const url = meta.versions[version]?.dist?.tarball;
      if (!url) return 0;
      const response = await fetch(url);
      return response.ok ? (await response.arrayBuffer()).byteLength : 0;
    }),
  );
  check(
    'publish',
    'the registry serves a tarball for each',
    tarballs.every(size => size > 0),
    tarballs.map(size => `${Math.round(size / 1024)} kB`).join(' + '),
  );

  return {a, b, ...derived};
}

// ---------------------------------------------------------------------------
// 3. Consumer 1 — a plain npm + Vite application
// ---------------------------------------------------------------------------

function cleanInstall(dir, registryUrl) {
  fs.rmSync(path.join(dir, 'node_modules'), {recursive: true, force: true});
  fs.rmSync(path.join(dir, 'package-lock.json'), {force: true});
  fs.rmSync(path.join(dir, 'dist'), {recursive: true, force: true});
  writeNpmrc(dir, registryUrl);
  // The `.npmrc` alone is not enough when this script is run through a package
  // manager: pnpm exports its own configuration as `npm_config_*` environment
  // variables, and npm ranks environment config above a project `.npmrc`. The
  // flag outranks both, and the offending variable is dropped as well.
  run(
    'npm',
    ['install', '--no-audit', '--no-fund', '--registry', `${registryUrl}/`],
    {cwd: dir, env: npmEnv()},
  );
}

/** Pin a dependency in a fixture's `package.json`; restored before exit. */
function pin(dir, pins) {
  patchFile(path.join(dir, 'package.json'), before => {
    const manifest = JSON.parse(before);
    for (const [name, spec] of Object.entries(pins)) {
      manifest.dependencies[name] = spec;
    }
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
}

async function verifyApp(registry, versions, browser) {
  heading(`Consumer 1: npm install @tecton/react@${versions.a} + vite build`);

  pin(APP, {'@tecton/react': versions.a});
  cleanInstall(APP, registry.url);

  const installed = JSON.parse(
    fs.readFileSync(
      path.join(APP, 'node_modules', '@tecton', 'react', 'package.json'),
      'utf8',
    ),
  );
  require_(
    'consumer-1',
    'npm install resolved the published tarball',
    installed.version === versions.a,
    `@tecton/react@${installed.version} from ${registry.url}`,
  );

  // Nothing upstream may appear as a package of its own: the library is
  // vendored inside `@tecton/react`, so a consumer installs one name.
  const leaked = [];
  let dirs = 0;
  walk(path.join(APP, 'node_modules'), (full, entry) => {
    if (!entry.isDirectory()) return;
    dirs += 1;
    if (/^@astryx/i.test(entry.name)) leaked.push(path.relative(APP, full));
  });
  check(
    'consumer-1',
    'no @astryxdesign package anywhere in node_modules',
    leaked.length === 0,
    leaked.length ? leaked.join(', ') : `${dirs} directories scanned`,
  );

  run('npm', ['run', 'build'], {cwd: APP, env: npmEnv()});
  const dist = path.join(APP, 'dist');
  const css = filesIn(dist, '.css');
  const js = filesIn(dist, '.js');
  require_(
    'consumer-1',
    'vite build produced a bundle',
    css.length > 0 && js.length > 0,
    `${js.length} js, ${css.length} css`,
  );

  const allCss = css.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  const allJs = js.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  // The consumer's own minifier drops the attribute selector's quotes, so the
  // assertion has to accept the form Vite produced, not only the one the
  // package shipped.
  const themeScope = allCss.match(/\[data-astryx-theme=("?)tecton\1\]/);
  check(
    'consumer-1',
    'the built CSS carries the tecton theme scope',
    Boolean(themeScope),
    themeScope
      ? `${themeScope[0]} in ${Math.round(allCss.length / 1024)} kB of CSS`
      : 'no theme scope in the built CSS',
  );
  for (const marker of PATCH_MARKERS) {
    check(
      'consumer-1',
      `the built JS carries ${marker.split('/').slice(-2).join('/')}`,
      allJs.includes(marker),
      marker,
    );
  }

  // ...and the page a browser gets out of it is actually themed.
  const site = await serve(dist);
  const page = await browser.newPage({viewport: {width: 1000, height: 700}});
  try {
    await page.goto(`${site.url}/index.html`);
    await page.waitForSelector('[data-testid="accent-button"]', {
      timeout: 15_000,
    });
    await page.waitForTimeout(250);
    const probe = await page.evaluate(() => {
      const button = document.querySelector('[data-testid="accent-button"]');
      const styles = getComputedStyle(button);
      return {
        background: styles.backgroundColor,
        accent: styles.getPropertyValue('--color-accent').trim(),
        mode: document.documentElement.getAttribute('data-theme'),
        theme: document.documentElement.getAttribute('data-astryx-theme'),
      };
    });
    check(
      'consumer-1',
      'the provider claimed the document root',
      probe.theme === 'tecton' && probe.mode === 'dark',
      `data-theme=${probe.mode}`,
    );
    const expected = resolveColor(probe.accent, probe.mode);
    check(
      'consumer-1',
      "the primary button is filled with the theme's accent",
      probe.background === expected,
      `${probe.background} = ${probe.accent}`,
    );
  } finally {
    await page.close();
    site.close();
  }
}

// ---------------------------------------------------------------------------
// 4. Consumer 2 — two published versions on one page
// ---------------------------------------------------------------------------

/** Drive one container's own React tree through its imperative handle. */
async function drive(page, id, action) {
  await page.evaluate(
    ([containerId, method]) => window.__mfe[containerId][method](),
    [id, action],
  );
  await page.waitForTimeout(150);
}

async function openPage(page, url) {
  await page.goto(`${url}/mfe-page.html`);
  await page.waitForFunction('window.__ready === true', null, {
    timeout: 20_000,
  });
  await page.waitForTimeout(250);
}

async function verifyMfe(registry, versions, browser) {
  heading(
    `Consumer 2: one page with @tecton/react@${versions.a} and @${versions.b}`,
  );

  pin(MFE, {
    'tecton-a': `npm:@tecton/react@${versions.a}`,
    'tecton-b': `npm:@tecton/react@${versions.b}`,
  });
  cleanInstall(MFE, registry.url);

  const resolved = id =>
    JSON.parse(
      fs.readFileSync(
        path.join(MFE, 'node_modules', `tecton-${id}`, 'package.json'),
        'utf8',
      ),
    ).version;
  require_(
    'consumer-2',
    'npm installed both published versions side by side',
    resolved('a') === versions.a && resolved('b') === versions.b,
    `tecton-a@${resolved('a')}, tecton-b@${resolved('b')}`,
  );

  run('npm', ['run', 'build'], {cwd: MFE, env: npmEnv()});
  const dist = path.join(MFE, 'dist', 'host');
  require_(
    'consumer-2',
    'both containers bundled',
    fs.existsSync(path.join(dist, 'container-a.js')) &&
      fs.existsSync(path.join(dist, 'container-b.js')),
    fs
      .readdirSync(dist)
      .filter(f => f.endsWith('.js'))
      .join(', '),
  );

  const site = await serve(dist);
  const page = await browser.newPage({viewport: {width: 1280, height: 800}});
  try {
    // --- both containers, one theme layer ---------------------------------
    await openPage(page, site.url);
    const reported = await page.evaluate(() => window.__versions);
    check(
      'consumer-2',
      'each bundle reports the version it installed',
      reported.a === versions.a && reported.b === versions.b,
      `A=${reported.a}, B=${reported.b}`,
    );

    const containers = await page.evaluate(
      ([fromVar, toVar]) => {
        const read = id => {
          const panel = document.querySelector(`[data-testid="${id}-panel"]`);
          if (!panel) return null;
          const styles = getComputedStyle(panel);
          return {
            rendered: panel.textContent.includes(
              `Container ${id.toUpperCase()}`,
            ),
            padding: styles.paddingTop,
            classes: panel.className,
            accent: styles.getPropertyValue('--color-accent').trim(),
            spacingFrom: styles.getPropertyValue(fromVar).trim(),
            spacingTo: styles.getPropertyValue(toVar).trim(),
            wrapperMode: document
              .querySelector(`[data-container="${id}"]`)
              ?.closest('[data-astryx-theme]')
              ?.getAttribute('data-theme'),
          };
        };
        return {a: read('a'), b: read('b')};
      },
      [versions.fromVar, versions.toVar],
    );
    require_(
      'consumer-2',
      'both containers rendered',
      containers.a?.rendered && containers.b?.rendered,
      'Container A and Container B are on the page',
    );

    const hostAccent = resolveColor(B_ACCENT, 'dark');
    check(
      'consumer-2',
      "both containers resolve the host's accent (version B's)",
      containers.a.accent === containers.b.accent &&
        resolveColor(containers.a.accent, 'dark') === hostAccent,
      `${containers.a.accent} in both`,
    );
    check(
      'consumer-2',
      "both containers take the host's card padding",
      containers.a.padding === containers.b.padding,
      // Tecton is a theme: its per-component decisions live in the theme layer
      // beside its tokens, under one theme name, so the host's single
      // tokens.css decides them for every container — exactly as it decides
      // the accent above. One theme layer on the page, nothing contested.
      `${containers.a.padding} in both (${versions.fromVar} → ${versions.toVar} between versions)`,
    );
    check(
      'consumer-2',
      'both containers render the same component classes',
      containers.a.classes === containers.b.classes,
      'the components are the component system’s own, so their class names match',
    );
    check(
      'consumer-2',
      'the shell owns the document root, both containers nested',
      containers.a.wrapperMode === 'dark' &&
        containers.b.wrapperMode === 'dark',
      await page.evaluate(() => {
        const record = document[Symbol.for('tecton.rootOwnership/v1')];
        const holders = record?.inspect?.().holders;
        return `${holders} holders on the root registry`;
      }),
    );

    // --- one scroll lock for the page (upstream patch 1) -------------------
    await openPage(page, site.url);
    const body = () =>
      page.evaluate(() => ({
        position: document.body.style.position,
        overflow: document.body.style.overflow,
        top: document.body.style.top,
        scrollY: Math.round(window.scrollY),
      }));
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(100);
    await drive(page, 'a', 'openDialog');
    const lockedA = await body();
    await drive(page, 'b', 'openDialog');
    await drive(page, 'a', 'closeDialog');
    const stillLocked = await body();
    await drive(page, 'b', 'closeDialog');
    const released = await body();
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(100);
    const after = await body();
    check(
      'consumer-2',
      'a modal in either container pins the body',
      lockedA.position === 'fixed' && lockedA.top === '-300px',
      `position:${lockedA.position} top:${lockedA.top}`,
    );
    check(
      'consumer-2',
      'closing A while B is open leaves the page pinned',
      stillLocked.position === 'fixed' && stillLocked.top === '-300px',
      'one scroll lock shared by both installed copies',
    );
    check(
      'consumer-2',
      'closing the last modal leaves the body scrollable',
      released.position === '' &&
        released.overflow === '' &&
        released.scrollY === 300 &&
        after.scrollY === 600,
      `restored to ${released.scrollY}, then scrolled to ${after.scrollY}`,
    );

    // --- one layer stack for the page (upstream patch 2) -------------------
    await openPage(page, site.url);
    const layers = () =>
      page.evaluate(() => {
        const dialog = id =>
          document.querySelector(`[data-testid="${id}-dialog"]`)?.open ?? false;
        const menus = Array.from(document.querySelectorAll('[role="menu"]'))
          .filter(menu => menu.checkVisibility())
          .map(menu => menu.textContent ?? '')
          .join(' ');
        return {
          dialogA: dialog('a'),
          dialogB: dialog('b'),
          menuB: menus.includes('Rename B'),
        };
      });
    await drive(page, 'a', 'openDialog');
    await drive(page, 'b', 'openMenu');
    const both = await layers();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    const afterFirst = await layers();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    const afterSecond = await layers();
    check(
      'consumer-2',
      "a container's menu opens over the other container's modal",
      both.dialogA && both.menuB,
      'dialog in A, menu in B',
    );
    check(
      'consumer-2',
      'one Escape dismisses only the layer on top',
      afterFirst.menuB === false && afterFirst.dialogA === true,
      "B's menu closed, A's dialog still open",
    );
    check(
      'consumer-2',
      'the next Escape dismisses the one underneath',
      afterSecond.dialogA === false,
      'one layer stack across two installed copies',
    );

    // --- each copy's toasts reach its own viewport -------------------------
    await openPage(page, site.url);
    await page.click('[data-testid="a-raise-toast"]');
    await page.click('[data-testid="b-raise-toast"]');
    await page.waitForTimeout(300);
    const shown = await page.evaluate(() => {
      const rows_ = Array.from(document.querySelectorAll('[data-toast-id]'));
      return {
        bodies: rows_.map(row => row.textContent?.trim() ?? ''),
        viewports: new Set(rows_.map(row => row.parentElement)).size,
      };
    });
    check(
      'consumer-2',
      'both versions show their toasts',
      // One viewport per installed copy: `useToast` is the component system's
      // own hook and its toast body is a ReactNode, which cannot cross from
      // one copy's React to another's. Each container shows what it raised.
      shown.viewports === 2 &&
        shown.bodies.join(' ').includes('toast from container a') &&
        shown.bodies.join(' ').includes('toast from container b'),
      `${shown.bodies.length} toasts in ${shown.viewports} viewports`,
    );
  } finally {
    await page.close();
    site.close();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const started = Date.now();
let registry = null;
let browser = null;

try {
  registry = await startRegistry();
  const versions = await publishVersions(registry);
  browser = await chromium.launch();
  await verifyApp(registry, versions, browser);
  await verifyMfe(registry, versions, browser);
} catch (error) {
  failures += 1;
  log(`\n${error.stack ?? error}`);
} finally {
  await browser?.close();
  if (KEEP) {
    log(
      `\n--keep: registry still on ${registry?.url}; fixtures left installed`,
    );
  } else {
    registry?.stop();
    restoreAll();
    removeCreated();
    fs.rmSync(CACHE, {recursive: true, force: true});
  }
}

const seconds = ((Date.now() - started) / 1000).toFixed(1);
table();
log(
  `\n  ${rows.length - failures}/${rows.length} checks passed in ${seconds}s\n`,
);
process.exit(failures === 0 ? 0 : 1);
