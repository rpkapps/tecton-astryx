#!/usr/bin/env node
/**
 * Build the micro-frontend page: two "released versions" of @tecton/react,
 * three IIFE bundles and the host shell.
 *
 *   version A = @tecton/react exactly as it is built in packages/react (0.1.0)
 *   version B = the same build with three retuned theme tokens and the card
 *               padding moved one step up the scale                    (0.2.0)
 *
 * B is what a second release train plausibly ships: a few design decisions
 * that moved. Both keep the theme NAME `tecton`, which is the strategy under
 * test.
 *
 * Both of B's edits are made in the THEME layer, and that is not an accident
 * of the fixture: since Tecton became a theme rather than a second component
 * library, every Tecton declaration — tokens and per-component overrides alike
 * — lives in `@layer astryx-theme`, scoped by the theme name. So a component
 * override is a cross-version contract in exactly the way a token is, and the
 * page resolves both the same way. That is what the cascade tests measure.
 *
 * ## Why B is patched in `dist/` rather than rebuilt from patched source
 *
 * The investigation harness patched `packages/react/src` in place, built it a
 * second time and restored the tree. That is a lot of trust to place in a
 * fixture's `finally` block, and it costs a full second build. Patching the
 * built artefacts produces the same page: everything the theme decides lives
 * in the built CSS as plain declarations, so retuning them there is the same
 * page a rebuild would produce.
 *
 * Nothing outside this fixture's own `dist/` is written.
 *
 *   node scripts/build.mjs            build everything
 *   node scripts/build.mjs --no-pkg   skip rebuilding @tecton/react first
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(HERE, '..');
const REPO = path.join(FIXTURE, '..', '..', '..');
const PACKAGE_DIST = path.join(REPO, 'packages/react/dist');
const OUT = path.join(FIXTURE, 'dist');
const VERSIONS = path.join(OUT, 'versions');
const HOST_OUT = path.join(OUT, 'host');

/** Version B's retuned tokens: a contested one, and two A never overrides. */
const B_TOKENS = {
  '--color-accent': 'light-dark(#b8336a, #ff5fa2)',
  '--color-background-surface': 'light-dark(#ffe9f2, #3d1329)',
  '--color-background-body': 'light-dark(#fdf3f8, #2a0d1c)',
};

/** Every stylesheet a version ships, relative to its own directory. */
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

const log = message => console.log(message);

function rewrite(file, transform) {
  if (!fs.existsSync(file)) return 0;
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after !== before) fs.writeFileSync(file, after);
  return after === before ? 0 : 1;
}

// --- 0. the package build ----------------------------------------------------
if (!process.argv.includes('--no-pkg') || !fs.existsSync(PACKAGE_DIST)) {
  log('▸ Building @tecton/react');
  execFileSync('pnpm', ['--filter', '@tecton/react', 'build'], {
    cwd: REPO,
    stdio: 'inherit',
  });
}
if (!fs.existsSync(path.join(PACKAGE_DIST, 'tecton.css'))) {
  throw new Error(
    `${PACKAGE_DIST} has no built stylesheet — run \`pnpm --filter @tecton/react build\`.`,
  );
}

// --- 1. version A = the build as it is ---------------------------------------
log('\n▸ Copying version A (0.1.0)');
fs.rmSync(OUT, {recursive: true, force: true});
fs.mkdirSync(VERSIONS, {recursive: true});
fs.cpSync(PACKAGE_DIST, path.join(VERSIONS, 'tecton-a'), {recursive: true});

// --- 2. version B = the same build, retuned ----------------------------------
log('▸ Deriving version B (0.2.0): retuned tokens + card padding');
const B = path.join(VERSIONS, 'tecton-b');
fs.cpSync(PACKAGE_DIST, B, {recursive: true});

let tokenEdits = 0;
for (const sheet of STYLESHEETS) {
  tokenEdits += rewrite(path.join(B, sheet), css => {
    let out = css;
    for (const [token, value] of Object.entries(B_TOKENS)) {
      // Only the plain `light-dark(...)` declarations: the media-variant
      // blocks that point a token at another token are left alone.
      out = out.replaceAll(
        new RegExp(`(${token}:\\s*)light-dark\\([^)]*\\)`, 'g'),
        `$1${value}`,
      );
    }
    return out;
  });
}
if (tokenEdits === 0) {
  throw new Error('No theme token was retuned — did the token names change?');
}

// The card's padding: a per-component decision the theme makes, retuned one
// step up the spacing scale. It is a custom property the theme sets inside its
// own @scope, so it travels with the tokens — which is the point.
const CARD_PADDING = '--astryx-card-padding';
let paddingEdits = 0;
for (const sheet of STYLESHEETS) {
  paddingEdits += rewrite(path.join(B, sheet), css =>
    css.replaceAll(
      `${CARD_PADDING}: var(--spacing-4)`,
      `${CARD_PADDING}: var(--spacing-8)`,
    ),
  );
}
if (paddingEdits === 0) {
  throw new Error(
    `No stylesheet set ${CARD_PADDING} to var(--spacing-4) — has the theme's card override changed?`,
  );
}
log(`  ${CARD_PADDING} 16px → 32px in ${paddingEdits} stylesheets`);

for (const [dir, version] of [
  [path.join(VERSIONS, 'tecton-a'), '0.1.0'],
  [B, '0.2.0'],
]) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(REPO, 'packages/react/package.json'), 'utf8'),
  );
  manifest.version = version;
  delete manifest.devDependencies;
  delete manifest.scripts;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  // A released version resolves its own dependency tree, so each copy gets
  // one. They are the same files on disk; what matters is that each bundle
  // compiles its own instance into itself, which `external: []` guarantees.
  fs.symlinkSync(
    path.join(REPO, 'packages/react/node_modules'),
    path.join(dir, 'node_modules'),
    'dir',
  );
}

// --- 3. the bundles ----------------------------------------------------------
log('\n▸ Bundling the containers and the host shell');
fs.mkdirSync(path.join(HOST_OUT, 'css'), {recursive: true});
const vite = path.join(FIXTURE, 'node_modules/vite/bin/vite.js');
for (const target of ['a', 'b', 'host-shell']) {
  execFileSync(
    process.execPath,
    [
      vite,
      'build',
      '--config',
      path.join(FIXTURE, 'containers/vite.config.mjs'),
    ],
    {cwd: FIXTURE, stdio: 'inherit', env: {...process.env, MFE_TARGET: target}},
  );
}

// --- 4. the stylesheets and the page -----------------------------------------
log('\n▸ Copying the stylesheets and the host page');
for (const id of ['a', 'b']) {
  for (const sheet of [
    ['tecton.css', `tecton-${id}.css`],
    ['tecton-no-reset.css', `tecton-${id}-no-reset.css`],
    ['tecton-tokens.css', `tecton-${id}-tokens.css`],
    ['tecton-components.css', `tecton-${id}-components.css`],
  ]) {
    fs.copyFileSync(
      path.join(VERSIONS, `tecton-${id}`, sheet[0]),
      path.join(HOST_OUT, 'css', sheet[1]),
    );
  }
}
fs.copyFileSync(
  path.join(FIXTURE, 'host/mfe-page.html'),
  path.join(HOST_OUT, 'mfe-page.html'),
);

log('\nmfe-harness built into dist/host. Run `pnpm test:e2e`.\n');
