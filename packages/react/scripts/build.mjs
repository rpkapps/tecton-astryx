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
 *   6. assemble the single consumer stylesheet dist/tecton.css
 *   7. verify the output actually loads and contains what it must
 *
 * Everything a consumer needs ends up in dist/: compiled ESM, declarations and
 * one stylesheet. No StyleX or Babel setup is required downstream.
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

// 6 — assemble the consumer stylesheet ---------------------------------------
step('Assembling dist/tecton.css');
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

const header = `/*!
 * Tecton ${pkg.version} — the complete Tecton stylesheet.
 *
 * Generated by packages/react/scripts/build.mjs. Do not edit.
 * Built on ${corePkg.name}@${corePkg.version}.
 *
 * Layer order: reset → astryx-base (foundation + Tecton components) →
 * astryx-theme (Tecton tokens). Import this file once, as early as your other
 * global CSS, and nothing else.
 */
@layer reset, astryx-base, astryx-theme;
`;

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

await fsp.writeFile(path.join(DIST, 'tecton.css'), bundle, 'utf8');

// The same pieces, separately, for debugging a cascade problem.
await fsp.writeFile(path.join(DIST_CSS, 'reset.css'), resetCss, 'utf8');
await fsp.writeFile(path.join(DIST_CSS, 'foundation.css'), baseCss, 'utf8');
await fsp.writeFile(path.join(DIST_CSS, 'tecton-theme.css'), themeCss, 'utf8');
console.log(
  `  dist/tecton.css (${(Buffer.byteLength(bundle) / 1024).toFixed(1)} kB) + dist/css/ parts`,
);

// 7 — verify ------------------------------------------------------------------
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

const assertions = [
  ['dist/tecton.css', bundle, '@layer reset'],
  ['dist/tecton.css', bundle, '@layer astryx-base'],
  ['dist/tecton.css', bundle, `[data-astryx-theme="${THEME_NAME}"]`],
  ['dist/css/tecton-components.css', componentCss, '.tecton'],
];
for (const [label, haystack, needle] of assertions) {
  if (!haystack.includes(needle)) {
    throw new Error(`${label} is missing ${needle}`);
  }
  console.log(`  ✓ ${label} contains ${needle}`);
}

console.log('\n@tecton/react built.\n');
