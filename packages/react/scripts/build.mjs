#!/usr/bin/env node
/**
 * @tecton/react production build.
 *
 * Steps, in order:
 *   0. check the generated palette is in sync with tokens/tecton.tokens.json
 *      and the generated icons with design/icons/tecton/
 *   1. clean dist/
 *   2. compile src/**\/*.{ts,tsx} with Babel (TypeScript + automatic JSX +
 *      StyleX), collecting the StyleX rules every file produces
 *   3. write the extracted component CSS to dist/css/tecton-components.css
 *   4. emit declarations with tsc
 *   5. compile the Tecton theme (CSS + a pre-resolved theme module) with the
 *      theme compiler, replacing the source placeholder in dist/theme/
 *   6. check the theme's token coverage against theme-token-manifest.json
 *   7. assemble the consumer stylesheets (dist/tecton*.css)
 *   8. verify the output actually loads and contains what it must
 *
 * Everything a consumer needs ends up in dist/: compiled ESM, declarations and
 * the stylesheets. No StyleX or Babel setup is required downstream.
 *
 * `--update-manifest` rewrites theme-token-manifest.json from the theme that
 * was just built, for when the token set changes on purpose.
 */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import * as babel from '@babel/core';
import styleXBabelPlugin from '@stylexjs/babel-plugin';
import {babelOptionsFor, PACKAGE_ROOT} from './stylex-babel.mjs';

const SRC = path.join(PACKAGE_ROOT, 'src');
const DIST = path.join(PACKAGE_ROOT, 'dist');
const DIST_CSS = path.join(DIST, 'css');
const THEME_SOURCE = path.join(SRC, 'theme', 'tectonTheme.ts');
const THEME_NAME = 'tecton';
const TOKEN_MANIFEST = path.join(PACKAGE_ROOT, 'theme-token-manifest.json');
const UPDATE_MANIFEST = process.argv.includes('--update-manifest');
/** The @scope the theme compiler wraps every themed rule in. */
const THEME_SCOPE = `@scope ([data-astryx-theme="${THEME_NAME}"])`;

const pkg = JSON.parse(
  await fsp.readFile(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'),
);

const IGNORED = [
  /\.test\.[cm]?tsx?$/,
  /\.d\.ts$/,
  /[\\/]__tests__[\\/]/,
  /[\\/]src[\\/]test[\\/]/,
];

function step(message) {
  console.log(`\n▸ ${message}`);
}

function listSourceFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listSourceFiles(full, out);
    } else if (/\.tsx?$/.test(entry.name) && !IGNORED.some(r => r.test(full))) {
      out.push(full);
    }
  }
  return out;
}

function run(command, args, label) {
  const result = spawnSync(command, args, {
    cwd: PACKAGE_ROOT,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function resolveFromPackage(specifier) {
  return fileURLToPath(import.meta.resolve(specifier));
}

// --- CSS surgery -------------------------------------------------------------
// The entry points below are the one bundle with whole at-rule blocks taken
// out, so the pieces that remain are byte-identical across them. That needs a
// brace matcher rather than a regexp: CSS comments and quoted strings can
// contain braces, and the theme's blocks nest three deep.

/** Index just past the `}` that closes the block opening at `openBrace`. */
function endOfBlock(css, openBrace) {
  let depth = 0;
  for (let i = openBrace; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? css.length : end + 1;
    } else if (ch === '"' || ch === "'") {
      for (i += 1; i < css.length; i += 1) {
        if (css[i] === '\\') i += 1;
        else if (css[i] === ch) break;
      }
    } else if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  throw new Error('Unbalanced braces in generated CSS');
}

/** Remove every top-level block whose prelude matches `pattern`. */
function stripBlocks(css, pattern) {
  let out = css;
  let removed = 0;
  for (;;) {
    const match = pattern.exec(out);
    pattern.lastIndex = 0;
    if (!match) break;
    const openBrace = out.indexOf('{', match.index);
    if (openBrace === -1) break;
    out = out.slice(0, match.index) + out.slice(endOfBlock(out, openBrace));
    removed += 1;
  }
  return {css: out.replace(/\n{3,}/g, '\n\n'), removed};
}

const RESET_LAYER = /@layer\s+reset\s*\{/g;
const THEME_SCOPE_BLOCK = /@scope\s*\(\[data-astryx-theme="tecton"\]\)[^{]*\{/g;

/** Drop the contents of `@layer reset`, keeping every other layer intact. */
function withoutResetLayer(css) {
  return stripBlocks(css, RESET_LAYER);
}

/**
 * Every custom property the built theme CSS sets.
 *
 * This is the token-coverage contract: under one shared theme name, a token
 * one version overrides and another does not is answered, for *both* versions,
 * by whichever sheet has a rule for it — so the set of names must not drift
 * between releases. Values may change (in a coordinated release); the set may
 * not, except on purpose via `--update-manifest`.
 */
function themeTokenNames(css) {
  const names = new Set();
  for (const match of css.matchAll(/(?:^|[{;\s])(--[A-Za-z0-9_-]+)\s*:/g)) {
    names.add(match[1]);
  }
  return [...names].sort();
}

// 0 — palette drift -----------------------------------------------------------
step('Checking the generated palette against the design tokens');
run(
  process.execPath,
  [path.join(PACKAGE_ROOT, 'scripts', 'generate-palette.mjs'), '--check'],
  'generate-palette --check',
);

// 0b — icon drift -------------------------------------------------------------
step('Checking the generated icons against the design delivery');
run(
  process.execPath,
  [path.join(PACKAGE_ROOT, 'scripts', 'generate-icons.mjs'), '--check'],
  'generate-icons --check',
);

// 1 — clean -------------------------------------------------------------------
step('Cleaning dist/');
await fsp.rm(DIST, {recursive: true, force: true});
await fsp.mkdir(DIST_CSS, {recursive: true});

// 2 — compile -----------------------------------------------------------------
step('Compiling TypeScript, JSX and StyleX with Babel');
const sourceFiles = listSourceFiles(SRC).sort();
const styleXRules = [];

for (const file of sourceFiles) {
  const code = await fsp.readFile(file, 'utf8');
  const result = await babel.transformAsync(code, babelOptionsFor(file));
  if (!result?.code) throw new Error(`Babel produced no output for ${file}`);

  const rules = result.metadata?.stylex;
  if (Array.isArray(rules) && rules.length > 0) styleXRules.push(...rules);

  const outFile = path
    .join(DIST, path.relative(SRC, file))
    .replace(/\.tsx?$/, '.js');
  await fsp.mkdir(path.dirname(outFile), {recursive: true});
  await fsp.writeFile(outFile, `${result.code}\n`, 'utf8');
}
console.log(`  ${sourceFiles.length} files compiled to dist/`);

// 3 — component CSS -----------------------------------------------------------
step('Extracting component CSS from StyleX');
const componentCss = styleXBabelPlugin.processStylexRules(styleXRules, false);
if (!componentCss.trim()) {
  throw new Error('StyleX produced no CSS — is the Babel plugin wired up?');
}
const componentCssPath = path.join(DIST_CSS, 'tecton-components.css');
await fsp.writeFile(
  componentCssPath,
  `/* Tecton component styles, extracted from StyleX at build time. */\n${componentCss}`,
  'utf8',
);
console.log(`  ${styleXRules.length} rules → dist/css/tecton-components.css`);

// 4 — declarations ------------------------------------------------------------
step('Emitting type declarations');
run(
  process.execPath,
  [
    resolveFromPackage('typescript/bin/tsc'),
    '-p',
    'tsconfig.build.json',
    '--emitDeclarationOnly',
  ],
  'tsc',
);

// 5 — theme -------------------------------------------------------------------
step('Compiling the Tecton theme');
const themeCssPath = path.join(DIST, 'theme', 'theme.css');
run(
  process.execPath,
  [
    resolveFromPackage('@astryxdesign/cli'),
    'theme',
    'build',
    path.relative(PACKAGE_ROOT, THEME_SOURCE),
    '-o',
    path.relative(PACKAGE_ROOT, themeCssPath),
    '--icons-specifier',
    './icons.js',
  ],
  'theme build',
);

const builtThemeModule = path.join(DIST, 'theme', `${THEME_NAME}.js`);
for (const required of [themeCssPath, builtThemeModule]) {
  if (!fs.existsSync(required)) {
    throw new Error(
      `Theme build did not produce ${path.relative(PACKAGE_ROOT, required)}`,
    );
  }
}
if (!(await fsp.readFile(builtThemeModule, 'utf8')).includes('__built: true')) {
  throw new Error('The generated theme module is not flagged as built.');
}

// 6 — token coverage ----------------------------------------------------------
// Several versions of Tecton can end up on one page, all of them naming their
// theme `tecton`, so every version's theme.css targets the identical @scope in
// the identical layer. A token that one version overrides and another does not
// is therefore answered for BOTH of them by whichever sheet has a rule for it
// (measured: docs/engineering/micro-frontends/analysis.md, F2/F3). Coverage
// drift between releases is the failure; this turns it into a build error.
step('Checking theme token coverage');
const builtThemeCss = await fsp.readFile(themeCssPath, 'utf8');
const builtTokens = themeTokenNames(builtThemeCss);

if (UPDATE_MANIFEST) {
  const manifest = {
    comment:
      'Every custom property the built theme CSS must set. Generated by ' +
      'scripts/build.mjs --update-manifest; see docs/engineering/build-pipeline.md.',
    themeName: THEME_NAME,
    source: 'dist/theme/theme.css',
    tokenCount: builtTokens.length,
    tokens: builtTokens,
  };
  await fsp.writeFile(
    TOKEN_MANIFEST,
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  console.log(
    `  theme-token-manifest.json rewritten with ${builtTokens.length} tokens`,
  );
} else {
  if (!fs.existsSync(TOKEN_MANIFEST)) {
    throw new Error(
      'theme-token-manifest.json is missing. Generate it once with ' +
        '`pnpm --filter @tecton/react build -- --update-manifest`.',
    );
  }
  const manifest = JSON.parse(await fsp.readFile(TOKEN_MANIFEST, 'utf8'));
  const expected = new Set(manifest.tokens ?? []);
  const actual = new Set(builtTokens);
  const missing = [...expected].filter(name => !actual.has(name)).sort();
  const unexpected = [...actual].filter(name => !expected.has(name)).sort();

  if (manifest.themeName !== THEME_NAME) {
    throw new Error(
      `theme-token-manifest.json is for theme "${manifest.themeName}", but the ` +
        `build produced "${THEME_NAME}".`,
    );
  }
  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      [
        'The built theme no longer sets the tokens in theme-token-manifest.json.',
        missing.length > 0
          ? `  missing (${missing.length}): ${missing.join(', ')}`
          : null,
        unexpected.length > 0
          ? `  unexpected (${unexpected.length}): ${unexpected.join(', ')}`
          : null,
        '',
        'Under one shared theme name every Tecton version on a page must cover',
        'the same token set, or a version that overrides a token silently wins',
        'it for every other version. If the change is intended, regenerate with',
        '`pnpm --filter @tecton/react build -- --update-manifest` and say so in',
        'the changelog: token coverage is a cross-container contract.',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }
  console.log(
    `  ✓ all ${builtTokens.length} manifest tokens are set by dist/theme/theme.css`,
  );
}

// 7 — assemble the consumer stylesheets ---------------------------------------
step('Assembling the consumer stylesheets');
const resetCssPath = resolveFromPackage('@astryxdesign/core/reset.css');
const baseCssPath = resolveFromPackage('@astryxdesign/core/astryx.css');
const corePkg = JSON.parse(
  await fsp.readFile(
    path.join(path.dirname(baseCssPath), '..', 'package.json'),
    'utf8',
  ),
);

const [resetCss, baseCss, themeCss] = await Promise.all([
  fsp.readFile(resetCssPath, 'utf8'),
  fsp.readFile(baseCssPath, 'utf8'),
  fsp.readFile(themeCssPath, 'utf8'),
]);

const indent = css =>
  css
    .split('\n')
    .map(line => (line.trim() ? `  ${line}` : line))
    .join('\n');

/**
 * Every entry point opens with the same layer statement. That line, not the
 * order the sheets arrive in, is what fixes the cascade: the first statement a
 * page sees registers the names, and every later one is a no-op. A page that
 * mixes entry points — or Tecton versions — therefore still gets one correct
 * layer order (measured, analysis.md §2).
 */
const headerFor = what => `/*!
 * Tecton ${pkg.version} — ${what}
 *
 * Generated by packages/react/scripts/build.mjs. Do not edit.
 * Built on ${corePkg.name}@${corePkg.version}.
 *
 * Layer order: reset → astryx-base (foundation + Tecton components) →
 * astryx-theme (Tecton tokens). Load Tecton stylesheets once, deterministically
 * and as early as your other global CSS.
 */
@layer reset, astryx-base, astryx-theme;
`;

const header = headerFor(`the complete Tecton stylesheet.
 *
 * Import this file once and nothing else.`);

const componentsLayer = `/* ----- Tecton components (StyleX, extracted at build time) ----- */
@layer astryx-base {
${indent(componentCss)}
}
`;

const bundle = [
  header,
  '/* ----- Reset ----- */',
  resetCss,
  '/* ----- Foundation component styles ----- */',
  baseCss,
  componentsLayer,
  '/* ----- Tecton theme ----- */',
  themeCss,
].join('\n');

// The three split entry points, for host shells that cannot take the whole
// bundle from a container. They are the same bytes with whole blocks removed,
// never re-generated content, so nothing can drift between them.
const resetless = withoutResetLayer(resetCss);
const themeCssNoReset = withoutResetLayer(themeCss);
if (resetless.removed === 0) {
  throw new Error('The upstream reset stylesheet has no @layer reset block.');
}

const noResetBundle = [
  headerFor(`the complete Tecton stylesheet, without the global reset.
 *
 * For host shells that own their own reset, or that cannot accept one arriving
 * from a container. Tecton's own components do not depend on it; the theme's
 * prose styles live in the same layer and go with it, so raw <h1>/<p> markup
 * is left to the host.`),
  '/* ----- Reset omitted ----- */',
  baseCss,
  componentsLayer,
  '/* ----- Tecton theme (reset layer removed) ----- */',
  themeCssNoReset.css,
].join('\n');

const tokensBundle = [
  headerFor(`the Tecton theme layer only — tokens, prose and theme overrides.
 *
 * For the micro-frontend page shape: the host shell loads exactly ONE of these
 * (the newest Tecton it knows about), calls configureTectonRoot(), and every
 * container loads its own components.css and mounts with scope="nested".
 * Everything here is scoped to [data-astryx-theme="${THEME_NAME}"].`),
  '/* ----- Tecton theme ----- */',
  themeCss,
].join('\n');

const componentsBundle = [
  headerFor(`reset, foundation and Tecton component styles — no tokens.
 *
 * The container half of the split: component CSS that carries no theme layer,
 * so it cannot contest another version's tokens. It needs a tokens.css on the
 * page (usually the host shell's) to be themed.`),
  '/* ----- Reset ----- */',
  resetCss,
  '/* ----- Foundation component styles ----- */',
  baseCss,
  componentsLayer,
].join('\n');

const componentsNoResetBundle = [
  headerFor(`foundation and Tecton component styles — no tokens, no reset.
 *
 * components.css for a host shell that owns its own reset.`),
  '/* ----- Reset omitted ----- */',
  baseCss,
  componentsLayer,
].join('\n');

const entryPoints = [
  ['tecton.css', bundle],
  ['tecton-no-reset.css', noResetBundle],
  ['tecton-tokens.css', tokensBundle],
  ['tecton-components.css', componentsBundle],
  ['tecton-components-no-reset.css', componentsNoResetBundle],
];
for (const [file, css] of entryPoints) {
  await fsp.writeFile(path.join(DIST, file), css, 'utf8');
}

// The same pieces, separately, for debugging a cascade problem.
await fsp.writeFile(path.join(DIST_CSS, 'reset.css'), resetCss, 'utf8');
await fsp.writeFile(path.join(DIST_CSS, 'foundation.css'), baseCss, 'utf8');
await fsp.writeFile(path.join(DIST_CSS, 'tecton-theme.css'), themeCss, 'utf8');
for (const [file, css] of entryPoints) {
  console.log(
    `  dist/${file} (${(Buffer.byteLength(css) / 1024).toFixed(1)} kB)`,
  );
}
console.log('  dist/css/ parts (debugging only, not public)');

// 8 — verify ------------------------------------------------------------------
step('Verifying the build');
const entry = path.join(DIST, 'index.js');
const importCheck = spawnSync(
  process.execPath,
  [
    '--input-type=module',
    '-e',
    `await import(${JSON.stringify(pathToFileURL(entry).href)})`,
  ],
  {cwd: PACKAGE_ROOT, stdio: 'inherit'},
);
if (importCheck.status !== 0) {
  throw new Error('dist/index.js could not be imported by Node.');
}

const LAYER_STATEMENT = '@layer reset, astryx-base, astryx-theme;';
const THEME_SELECTOR = `[data-astryx-theme="${THEME_NAME}"]`;

const assertions = [
  ['dist/tecton.css', bundle, '@layer reset'],
  ['dist/tecton.css', bundle, '@layer astryx-base'],
  ['dist/tecton.css', bundle, THEME_SELECTOR],
  ['dist/css/tecton-components.css', componentCss, '.tecton'],
];
for (const [label, haystack, needle] of assertions) {
  if (!haystack.includes(needle)) {
    throw new Error(`${label} is missing ${needle}`);
  }
  console.log(`  ✓ ${label} contains ${needle}`);
}

/** Every entry point must open with the layer statement. */
for (const [file, css] of entryPoints) {
  if (!css.includes(LAYER_STATEMENT)) {
    throw new Error(`dist/${file} is missing "${LAYER_STATEMENT}"`);
  }
}
console.log(
  `  ✓ all ${entryPoints.length} entry points declare the layer order`,
);

/** The reset-free entry points must carry no reset rules at all. */
for (const [file, css] of [
  ['tecton-no-reset.css', noResetBundle],
  ['tecton-components-no-reset.css', componentsNoResetBundle],
]) {
  if (/@layer\s+reset\s*\{/.test(css)) {
    throw new Error(`dist/${file} still contains an @layer reset block`);
  }
  console.log(`  ✓ dist/${file} contains no @layer reset block`);
}
if (
  !noResetBundle.includes(THEME_SELECTOR) ||
  !noResetBundle.includes('.tecton')
) {
  throw new Error(
    'dist/tecton-no-reset.css lost the theme or the Tecton component styles',
  );
}
console.log(
  '  ✓ dist/tecton-no-reset.css is still themed and still has components',
);

/**
 * The split has to be a real split: tokens.css carries no component styling of
 * its own, components.css carries no theme.
 *
 * "Of its own" is the honest form of the first half. The theme's own component
 * overrides — `.astryx-button` rules inside `@layer astryx-theme` — are part of
 * what a theme *is*, and they ship with the tokens; what must not appear is a
 * component rule outside the theme's @scope, i.e. anything from the foundation
 * stylesheet or from Tecton's StyleX output.
 */
const tokensOutsideThemeScope = stripBlocks(
  tokensBundle,
  THEME_SCOPE_BLOCK,
).css;
const strayClassRule = tokensOutsideThemeScope.match(
  /^\s*\.(astryx|tecton)[A-Za-z0-9_-]*[^{]*\{/m,
);
if (strayClassRule) {
  throw new Error(
    `dist/tecton-tokens.css has a component rule outside the theme scope: ${strayClassRule[0].trim()}`,
  );
}
if (!tokensBundle.includes(THEME_SCOPE)) {
  throw new Error('dist/tecton-tokens.css is missing the theme @scope');
}
console.log(
  '  ✓ dist/tecton-tokens.css has no .astryx/.tecton rule outside the theme scope',
);

for (const [file, css] of [
  ['tecton-components.css', componentsBundle],
  ['tecton-components-no-reset.css', componentsNoResetBundle],
]) {
  if (css.includes('[data-astryx-theme=')) {
    throw new Error(
      `dist/${file} contains a theme scope; it must carry no tokens`,
    );
  }
  if (!css.includes('.tecton')) {
    throw new Error(`dist/${file} is missing Tecton's own component styles`);
  }
  console.log(`  ✓ dist/${file} carries components but no theme scope`);
}

/** The export map has to actually point at what was just written. */
for (const [subpath, target] of Object.entries(pkg.exports)) {
  if (!subpath.endsWith('.css')) continue;
  const file = path.join(PACKAGE_ROOT, target);
  if (!fs.existsSync(file)) {
    throw new Error(
      `exports["${subpath}"] points at a missing file: ${target}`,
    );
  }
}
const cssExports = Object.keys(pkg.exports).filter(s => s.endsWith('.css'));
if (cssExports.length !== entryPoints.length) {
  throw new Error(
    `The build writes ${entryPoints.length} stylesheets but package.json exports ` +
      `${cssExports.length}: ${cssExports.join(', ')}`,
  );
}
console.log(`  ✓ ${cssExports.length} CSS export paths resolve`);

console.log('\n@tecton/react built.\n');
