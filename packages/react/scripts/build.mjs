#!/usr/bin/env node
/**
 * @tecton/react production build.
 *
 * Steps, in order:
 *   0. check the generated palette is in sync with tokens/tecton.tokens.json,
 *      the generated icons with design/icons/tecton/, and the generated
 *      subpath modules and README with the component system's exports map
 *   1. clean dist/
 *   2. compile src/**\/*.{ts,tsx} with Babel (TypeScript + automatic JSX +
 *      StyleX), collecting the StyleX rules every file produces
 *   3. write the extracted component CSS to dist/css/tecton-components.css
 *   4. emit declarations with tsc
 *   5. compile the Tecton theme (CSS + a pre-resolved theme module) with the
 *      theme compiler, replacing the source placeholder in dist/theme/
 *   6. check the theme's token coverage against theme-token-manifest.json
 *   7. assemble the consumer stylesheets (dist/tecton*.css)
 *   8. vendor the upstream library into dist/vendor/core, rewrite every
 *      upstream import in the compiled JS and the emitted .d.ts to a relative
 *      path into it, and scrub the vendored declarations' comments and import
 *      specifiers of the upstream name
 *   9. verify the output actually loads and contains what it must, then report
 *      what the published package weighs
 *
 * Everything a consumer needs ends up in dist/: compiled ESM, declarations,
 * the stylesheets and the upstream code itself. No StyleX or Babel setup is
 * required downstream, and nothing named `@astryxdesign/*` is installed.
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
/** Where the upstream library's own files are copied (step 8). */
const VENDOR = path.join(DIST, 'vendor', 'core');
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

// --- finding upstream imports ------------------------------------------------
// "The upstream package's name appears in this file" is not the question: the
// vendored code's own prose is full of `import {stack} from
// '@astryxdesign/core/Layout'` examples, and one runtime warning builds such a
// specifier inside a template literal. The question is whether a *module
// position* names it — which needs the file read as code rather than as text.

/**
 * Split `source` into code and string literals.
 *
 * Returns the source with every comment and every string body blanked out
 * (offsets preserved, so an index into it is an index into the original), plus
 * where each string literal is and what it says. A template literal is one
 * literal, taken whole: the `${}` holes are not code for this purpose, which is
 * exactly what keeps a warning message that *quotes* an import out of the
 * results.
 */
function tokenizeModule(source) {
  const masked = [];
  const strings = [];
  const comments = [];
  let i = 0;
  /** The last code character seen, for telling `/` division from `/`regex. */
  let previous = '';

  const blank = text => text.replace(/[^\n]/g, ' ');

  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];

    if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      comments.push({start: i, end: stop});
      masked.push(blank(source.slice(i, stop)));
      i = stop;
      continue;
    }
    if (char === '/' && next === '/') {
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? source.length : end;
      comments.push({start: i, end: stop});
      masked.push(blank(source.slice(i, stop)));
      i = stop;
      continue;
    }
    if (char === '/' && /[(,=:[!&|?{};+\-*%~^]/.test(previous)) {
      // A regular expression literal: skip it whole, so a quote or a `//`
      // inside its character classes cannot be read as a string or a comment.
      let j = i + 1;
      let inClass = false;
      for (; j < source.length; j += 1) {
        const c = source[j];
        if (c === '\\') j += 1;
        else if (c === '[') inClass = true;
        else if (c === ']') inClass = false;
        else if (c === '/' && !inClass) break;
        else if (c === '\n') break;
      }
      const stop = Math.min(j + 1, source.length);
      masked.push(blank(source.slice(i, stop)));
      i = stop;
      previous = '/';
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      let j = i + 1;
      for (; j < source.length; j += 1) {
        if (source[j] === '\\') j += 1;
        else if (source[j] === char) break;
      }
      const end = Math.min(j + 1, source.length);
      strings.push({
        start: i + 1,
        end: end - 1,
        value: source.slice(i + 1, end - 1),
      });
      masked.push(blank(source.slice(i, end)));
      i = end;
      previous = char;
      continue;
    }

    masked.push(char);
    if (!/\s/.test(char)) previous = char;
    i += 1;
  }

  return {masked: masked.join(''), strings, comments};
}

/** Where a module position names the upstream package: `{specifier, start, end}`. */
function upstreamImports(source) {
  const {masked, strings} = tokenizeModule(source);
  const hits = [];
  for (const literal of strings) {
    if (!/^@astryxdesign\/[^'"`]+$/.test(literal.value)) continue;
    // `from '…'`, a bare `import '…'`, a dynamic `import('…')`, a
    // `require('…')`, or the `declare module '…'` of a generated augmentation.
    const before = masked.slice(
      Math.max(0, literal.start - 64),
      literal.start - 1,
    );
    if (
      !/(?:^|[^\w$.])(?:from|import|require|declare\s+module)\s*\(?\s*$/.test(
        before,
      )
    ) {
      continue;
    }
    hits.push({
      specifier: literal.value,
      start: literal.start,
      end: literal.end,
    });
  }
  return hits;
}

/** Every file under `dir`, recursively, whose path passes `test`. */
function listFiles(dir, test, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, test, out);
    else if (test(full)) out.push(full);
  }
  return out;
}

/** Total size of everything under `dir`, in megabytes, for the build log. */
function directorySizeMb(dir) {
  let bytes = 0;
  for (const file of listFiles(dir, () => true)) {
    bytes += fs.statSync(file).size;
  }
  return (bytes / 1024 / 1024).toFixed(1);
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

// 0c — subpath drift ----------------------------------------------------------
// Every module the component system exports is published at the same path
// under `@tecton/react/`, from a one-line file generated out of its exports
// map. An upgrade that adds, moves or removes a module has to regenerate
// them, so the build refuses to run against a subpath set that no longer
// matches the release it is building against.
step('Checking the generated subpath modules against the exports map');
run(
  process.execPath,
  [path.join(PACKAGE_ROOT, 'scripts', 'generate-modules.mjs'), '--check'],
  'generate-modules --check',
);

// 0d — README drift ----------------------------------------------------------
// The README's module list is generated from the same exports map. It is the
// package's front page, so it fails the build rather than going stale.
step('Checking the README module list');
run(
  process.execPath,
  [path.join(PACKAGE_ROOT, 'scripts', 'generate-readme.mjs'), '--check'],
  'generate-readme --check',
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
/**
 * Tecton styles no component of its own.
 *
 * Tecton is a theme: the components are the component system's, and every
 * Tecton rule is a token override or a component override inside the theme's
 * own `@scope` (step 5). So this extract is empty today, and an empty extract
 * is correct rather than a mis-wired Babel plugin — the old
 * "no CSS means no plugin" check was a check on hand-written Tecton
 * components, and there are none.
 *
 * The step itself stays, and so does the StyleX transform in step 2: the
 * moment a Tecton module reaches for `stylex.create` its rules flow into
 * `dist/css/tecton-components.css` and into the bundle below with nothing to
 * configure. What replaces the old assertion is `hasComponentCss`, which the
 * assertions in step 9 read so they check what is actually true of this build.
 */
const componentCss = styleXBabelPlugin.processStylexRules(styleXRules, false);
const hasComponentCss = componentCss.trim().length > 0;
const componentCssPath = path.join(DIST_CSS, 'tecton-components.css');
await fsp.writeFile(
  componentCssPath,
  hasComponentCss
    ? `/* Tecton component styles, extracted from StyleX at build time. */\n${componentCss}`
    : '/* Tecton styles no component of its own: the theme carries every Tecton rule. */\n',
  'utf8',
);
console.log(
  hasComponentCss
    ? `  ${styleXRules.length} rules → dist/css/tecton-components.css`
    : '  no Tecton component rules — every Tecton rule is in the theme layer',
);

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
/** The upstream package's own root, read from an export it publishes. */
const CORE_ROOT = path.join(path.dirname(baseCssPath), '..');
const corePkg = JSON.parse(
  await fsp.readFile(path.join(CORE_ROOT, 'package.json'), 'utf8'),
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

const componentsLayer = hasComponentCss
  ? `/* ----- Tecton components (StyleX, extracted at build time) ----- */
@layer astryx-base {
${indent(componentCss)}
}
`
  : '/* ----- Tecton adds no component rules: see the theme layer ----- */\n';

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

// 8 — vendor the upstream library ---------------------------------------------
// A consumer installs `@tecton/react` and nothing else — no `@astryxdesign/*`
// package is ever in their tree — so the upstream code has to travel inside
// this package. Two reasons, and the second is the one that forced it:
//
//   1. the install story. One dependency, no upstream name in a lockfile, no
//      way for an application to reach past Tecton to the library underneath.
//   2. the patches. `patches/@astryxdesign__core@0.6.2.patch` fixes the
//      document-keyed scroll lock and layer stack (see
//      docs/engineering/upstream-patches.md). pnpm applies patches to THIS
//      workspace's install; a consumer resolving their own copy of the
//      upstream package would get the unpatched one, and the S1 frozen-page
//      failure back with it. Shipping the code is what makes the fix reach
//      them.
//
// The copy is verbatim apart from `*.d.ts.map`, which point at upstream
// `src/` files this package does not ship. Everything else — `'use client'`
// banners, the JSON locale catalogues, `astryx.css` — is byte-identical.
step('Vendoring the upstream library into dist/vendor/core');

await fsp.cp(path.join(CORE_ROOT, 'dist'), path.join(VENDOR, 'dist'), {
  recursive: true,
  filter: src => !src.endsWith('.d.ts.map'),
});
await fsp.cp(path.join(CORE_ROOT, 'locales'), path.join(VENDOR, 'locales'), {
  recursive: true,
});

// The declaration maps are gone, so the comments pointing at them are noise.
let strippedMapComments = 0;
for (const file of listFiles(VENDOR, f => f.endsWith('.d.ts'))) {
  const before = await fsp.readFile(file, 'utf8');
  const after = before.replace(
    /\n?\/\/# sourceMappingURL=[^\n]*\.d\.ts\.map\n?/g,
    '\n',
  );
  if (after !== before) {
    await fsp.writeFile(file, after, 'utf8');
    strippedMapComments += 1;
  }
}

/**
 * Resolve one upstream specifier to the file it names inside `dist/vendor/core`.
 *
 * The mapping is the upstream package's own `exports` map, read from its
 * `package.json` rather than guessed: `@astryxdesign/core/Dialog` is only
 * `dist/Dialog/index.js` because the map says so, and subpaths like
 * `./theme/tokens.stylex`, `./naming` and the `./locales/*.json` pattern do
 * not follow the directory-plus-index shape at all. An upgrade that moves a
 * file therefore moves the rewrite with it, and a specifier the map does not
 * cover fails the build instead of shipping a broken import.
 */
function resolveVendored(specifier) {
  const subpath =
    specifier === corePkg.name
      ? '.'
      : `.${specifier.slice(corePkg.name.length)}`;

  const pick = entry => (typeof entry === 'string' ? entry : entry?.default);
  let target = pick(corePkg.exports[subpath]);

  if (target === undefined) {
    for (const [pattern, entry] of Object.entries(corePkg.exports)) {
      const star = pattern.indexOf('*');
      if (star === -1) continue;
      const head = pattern.slice(0, star);
      const tail = pattern.slice(star + 1);
      if (!subpath.startsWith(head) || !subpath.endsWith(tail)) continue;
      const filled = subpath.slice(head.length, subpath.length - tail.length);
      target = pick(entry)?.replace('*', filled);
      break;
    }
  }

  if (target === undefined) {
    throw new Error(
      `"${specifier}" is not in ${corePkg.name}@${corePkg.version}'s exports map, ` +
        'so it cannot be rewritten to a vendored path.',
    );
  }

  const file = path.join(VENDOR, target);
  if (!fs.existsSync(file)) {
    throw new Error(
      `The exports map points "${specifier}" at ${target}, which is not vendored ` +
        '— only the upstream dist/ and locales/ directories are copied.',
    );
  }
  return file;
}

const ownModules = listFiles(
  DIST,
  f =>
    (f.endsWith('.js') || f.endsWith('.d.ts')) &&
    !f.startsWith(`${VENDOR}${path.sep}`),
);

let rewrittenSpecifiers = 0;
let rewrittenFiles = 0;
for (const file of ownModules) {
  const before = await fsp.readFile(file, 'utf8');
  const hits = upstreamImports(before);
  if (hits.length === 0) continue;

  // Right to left, so an earlier replacement cannot move a later offset.
  let after = before;
  for (const hit of [...hits].reverse()) {
    let relative = path
      .relative(path.dirname(file), resolveVendored(hit.specifier))
      .split(path.sep)
      .join('/');
    if (!relative.startsWith('.')) relative = `./${relative}`;
    after = after.slice(0, hit.start) + relative + after.slice(hit.end);
  }
  await fsp.writeFile(file, after, 'utf8');
  rewrittenSpecifiers += hits.length;
  rewrittenFiles += 1;
}

/**
 * Scrub the vendored declarations of the upstream name — and nothing else.
 *
 * A `.d.ts` is surface: an editor shows its prose, its `@example` blocks and
 * the specifiers it imports from, so a consumer reading `TableProps` would
 * otherwise be reading the name of the system Tecton is built on. Two, and
 * only two, kinds of span are rewritten:
 *
 *   - **comments**, where the name appears as prose, in `@example` imports and
 *     in `@file`/`SYNC` headers;
 *   - **import specifiers in module positions**, which name a package.
 *
 * Everything else is left exactly as it is, because everything else is
 * MEANING, not prose:
 *
 *   - a **string-literal type** (`'data-astryx-theme'`, `'astryx-toast-'`) is
 *     a value the runtime compares against and the CSS is scoped by. Rewriting
 *     it would make the types describe attributes the code never sets.
 *   - an **identifier** (`AstryxTheme`, `dataAstryx`) is a name the emitted
 *     JavaScript imports and exports. Rewriting it would break the link
 *     between the declarations and the modules they describe.
 *   - **`.js` files are never touched at all**: they are the program.
 *
 * What survives the scrub is therefore real, and is the guard's business:
 * `scripts/check-consumer-surface.mjs` lists every remaining mention with the
 * reason it has to stay.
 */
const SCRUBS = [
  [new RegExp(`${corePkg.name}(?=/|$|[^\\w-])`, 'g'), '@tecton/react'],
  [/Astryx/g, 'Tecton'],
  [/astryx/g, 'tecton'],
];

function scrubText(text) {
  let out = text;
  for (const [pattern, replacement] of SCRUBS)
    out = out.replace(pattern, replacement);
  return out;
}

let scrubbedFiles = 0;
let scrubbedSpans = 0;
for (const file of listFiles(VENDOR, f => f.endsWith('.d.ts'))) {
  const before = await fsp.readFile(file, 'utf8');
  const {masked, strings, comments} = tokenizeModule(before);

  /** The spans this file may rewrite: its comments and its specifiers. */
  const spans = [...comments];
  for (const literal of strings) {
    const lead = masked.slice(
      Math.max(0, literal.start - 64),
      literal.start - 1,
    );
    if (
      /(?:^|[^\w$.])(?:from|import|require|declare\s+module)\s*\(?\s*$/.test(
        lead,
      )
    ) {
      spans.push({start: literal.start, end: literal.end});
    }
  }

  // Right to left, so an earlier replacement cannot move a later offset.
  let after = before;
  let touched = 0;
  for (const span of spans.sort((a, b) => b.start - a.start)) {
    const original = before.slice(span.start, span.end);
    const replaced = scrubText(original);
    if (replaced === original) continue;
    after = after.slice(0, span.start) + replaced + after.slice(span.end);
    touched += 1;
  }
  if (touched === 0) continue;
  await fsp.writeFile(file, after, 'utf8');
  scrubbedFiles += 1;
  scrubbedSpans += touched;
}

console.log(
  `  ${corePkg.name}@${corePkg.version} → dist/vendor/core ` +
    `(${directorySizeMb(VENDOR)} MB, ${strippedMapComments} declaration-map comments removed)`,
);
console.log(
  `  ${scrubbedSpans} comments and specifiers scrubbed in ${scrubbedFiles} vendored declarations`,
);
console.log(
  `  ${rewrittenSpecifiers} upstream specifiers rewritten in ${rewrittenFiles} of ` +
    `${ownModules.length} emitted modules`,
);

// 9 — verify ------------------------------------------------------------------
step('Verifying the build');

/**
 * Nothing in the published JavaScript or types may import the upstream package
 * by name. If one specifier survives, a consumer's bundler tries to resolve
 * `@astryxdesign/core` from their node_modules — where it is not installed,
 * and where, if they installed it themselves, it would be the UNPATCHED copy.
 */
const leakedSpecifiers = [];
const publishedModules = listFiles(
  DIST,
  f => f.endsWith('.js') || f.endsWith('.d.ts'),
);
for (const file of publishedModules) {
  const source = await fsp.readFile(file, 'utf8');
  for (const hit of upstreamImports(source)) {
    leakedSpecifiers.push(`${path.relative(DIST, file)} → ${hit.specifier}`);
  }
}
if (leakedSpecifiers.length > 0) {
  throw new Error(
    [
      'A bare upstream import survived the vendoring step:',
      ...leakedSpecifiers.map(line => `  ${line}`),
      '',
      'Every module position must point into dist/vendor/core. Check that the',
      "specifier is in the upstream exports map (step 8's resolver reads it).",
    ].join('\n'),
  );
}
console.log(
  `  ✓ no bare upstream import in any of ${publishedModules.length} published ` +
    'modules (vendored code included)',
);

/**
 * The vendored copy must be the PATCHED one. pnpm applies
 * `patches/@astryxdesign__core@0.6.2.patch` on install; an install that
 * skipped it (a `--no-optional`-style flag, a stale store, a merge that
 * dropped `pnpm.patchedDependencies`) would vendor upstream's own modules and
 * silently ship the frozen-page and wrong-Escape defects the patch removes.
 */
const PATCH_MARKERS = [
  [
    'dist/hooks/useScrollLock.js',
    "Symbol.for('@astryxdesign/core/scroll-lock/v1')",
  ],
  [
    'dist/Layer/layerStack.js',
    "Symbol.for('@astryxdesign/core/layer-stack/v1')",
  ],
];
for (const [file, marker] of PATCH_MARKERS) {
  const source = await fsp.readFile(path.join(VENDOR, file), 'utf8');
  if (!source.includes(marker)) {
    throw new Error(
      `dist/vendor/core/${file} does not carry ${marker}: the upstream patch is ` +
        'not applied. Run `pnpm install` from the repository root and see ' +
        'docs/engineering/upstream-patches.md.',
    );
  }
  console.log(`  ✓ dist/vendor/core/${file} carries the patched store`);
}

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
  ...(hasComponentCss
    ? [['dist/css/tecton-components.css', componentCss, '.tecton']]
    : []),
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
if (!noResetBundle.includes(THEME_SELECTOR)) {
  throw new Error('dist/tecton-no-reset.css lost the theme');
}
if (hasComponentCss && !noResetBundle.includes('.tecton')) {
  throw new Error('dist/tecton-no-reset.css lost the Tecton component styles');
}
console.log('  ✓ dist/tecton-no-reset.css is still themed');

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
  if (!css.includes('.astryx')) {
    throw new Error(`dist/${file} is missing the component stylesheet`);
  }
  if (hasComponentCss && !css.includes('.tecton')) {
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

/**
 * What a consumer actually downloads. Vendoring the upstream library is the
 * dominant term, so the number belongs in the build log where a change to it
 * is visible rather than in a document that goes stale.
 */
step('Measuring the published package');
const packed = spawnSync('npm', ['pack', '--dry-run', '--json'], {
  cwd: PACKAGE_ROOT,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});
if (packed.status === 0) {
  try {
    const [report] = JSON.parse(packed.stdout);
    console.log(
      `  ${report.filename}: ${(report.size / 1024 / 1024).toFixed(1)} MB packed, ` +
        `${(report.unpackedSize / 1024 / 1024).toFixed(1)} MB unpacked, ` +
        `${report.entryCount} files`,
    );
    console.log(
      `  of which dist/vendor/core: ${directorySizeMb(VENDOR)} MB unpacked`,
    );
  } catch {
    console.log(
      '  (npm pack produced no readable report; skipping the size line)',
    );
  }
} else {
  console.log('  (npm pack unavailable; skipping the size line)');
}

console.log('\n@tecton/react built.\n');
