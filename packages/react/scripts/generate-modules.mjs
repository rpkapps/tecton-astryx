#!/usr/bin/env node
/**
 * The subpath modules.
 *
 * `@tecton/react` publishes the upstream component library under Tecton's
 * name: every module the library exports is reachable at the same path below
 * `@tecton/react/`, with the same names and the same props. That is a
 * mechanical relationship, so it is generated rather than maintained:
 *
 *   src/modules/<Path>/index.ts   `export * from '<upstream>/<Path>';`
 *   package.json#exports          `./<Path>` → dist/modules/<Path>/index.{js,d.ts}
 *
 * The source of truth is the upstream package's own `exports` map, read from
 * its `package.json`. An upgrade that adds, moves or removes a module moves
 * the Tecton subpath with it, and `--check` fails the build when the committed
 * files no longer match — the same drift guard the palette and the icons have.
 *
 * Three kinds of upstream entry get no module of their own. The stylesheets
 * (`SKIPPED` below) are assembled into Tecton's own entry points and the
 * documentation data files belong to the documentation site, so neither is
 * published at all. `./theme` is published but hand-written
 * (`src/theme/public.ts`): it is Tecton's theme public API *and* the theme
 * runtime, which is more than a generated one-liner.
 *
 * `DIRECT` is the third: two entries that are published, but as the vendored
 * file itself rather than through a re-export module.
 *
 *   `./theme/tokens.stylex`  StyleX's compiler has to see the real
 *                            `defineVars()` call site to resolve a token to a
 *                            `var(--…)`. A module that re-exported it would
 *                            hide that call from the compiler and every token
 *                            reference in a consumer's StyleX would break.
 *   `./locales/*.json`       JSON. There is nothing to wrap it in.
 *
 * Both point straight into `dist/vendor/core`, which is otherwise internal.
 * That is the exception, and it is the reason the directory is named for its
 * role: the published path says `@tecton/react/theme/tokens.stylex`, and the
 * target is plumbing a consumer never writes.
 *
 *   node scripts/generate-modules.mjs           # write the modules and exports
 *   node scripts/generate-modules.mjs --check   # fail if they have drifted
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import prettier from 'prettier';

const PACKAGE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const MODULES = path.join(PACKAGE, 'src', 'modules');
const MANIFEST = path.join(PACKAGE, 'package.json');
const CHECK = process.argv.includes('--check');

const CORE = '@astryxdesign/core';
const corePkg = JSON.parse(
  fs.readFileSync(
    path.join(PACKAGE, 'node_modules', CORE, 'package.json'),
    'utf8',
  ),
);

/**
 * Upstream entries that do not become a `@tecton/react` subpath, and why.
 *
 * Everything else in the map does, including the ones that carry no component
 * — `./hooks`, `./utils`, `./i18n`, `./BaseProps`, `./naming` — because a
 * consumer who reaches for a component eventually reaches for those too.
 */
const SKIPPED = new Map([
  ['.', 'the package root, which src/index.ts owns'],
  ['./reset.css', 'assembled into Tecton’s own stylesheet entry points'],
  ['./astryx.css', 'assembled into Tecton’s own stylesheet entry points'],
  ['./tailwind-theme.css', 'a Tailwind bridge Tecton does not publish'],
  ['./docs.mjs', 'documentation data, consumed by the documentation site'],
  ['./groups.doc.mjs', 'documentation data, consumed by the documentation site'],
  ['./theme', 'hand-written: src/theme/public.ts, Tecton’s theme plus this one'],
  ['./theme/tokens.stylex', 'published straight from the vendored file: see DIRECT'],
  ['./locales/*.json', 'published straight from the vendored files: see DIRECT'],
]);

/**
 * The entries published as the vendored file itself, with no module in
 * between. The paths mirror the upstream exports map's own targets under
 * `dist/vendor/core/`, which is where the build puts the vendored package.
 */
const DIRECT = {
  './theme/tokens.stylex': {
    types: './dist/vendor/core/dist/theme/tokens.stylex.d.ts',
    default: './dist/vendor/core/dist/theme/tokens.stylex.js',
  },
  './locales/*.json': './dist/vendor/core/locales/*.json',
};

/** The upstream subpaths that become `@tecton/react/<Path>`, in map order. */
export function upstreamModulePaths() {
  return Object.keys(corePkg.exports)
    .filter(subpath => !SKIPPED.has(subpath))
    .map(subpath => subpath.slice(2));
}

/** The `exports` entries Tecton publishes that are not generated from above. */
function fixedExports(current) {
  const fixed = {};
  for (const [subpath, target] of Object.entries(current)) {
    if (subpath === '.' || subpath === './package.json') fixed[subpath] = target;
    else if (subpath.endsWith('.css')) fixed[subpath] = target;
    else if (subpath === './theme' || subpath === './icons')
      fixed[subpath] = target;
  }
  return fixed;
}

function moduleSource(subpath) {
  return `/**
 * \`@tecton/react/${subpath}\` — the \`${subpath}\` module, as the design system publishes it.
 *
 * @generated by packages/react/scripts/generate-modules.mjs — do not edit.
 */
export * from '${CORE}/${subpath}';
`;
}

const paths = upstreamModulePaths();
const config = await prettier.resolveConfig(MANIFEST);

/** path → formatted source, for every module that should exist. */
const wanted = new Map();
for (const subpath of paths) {
  wanted.set(
    path.join(MODULES, subpath, 'index.ts'),
    await prettier.format(moduleSource(subpath), {
      ...config,
      parser: 'typescript',
    }),
  );
}

/** Every file currently under src/modules, so a removed module is noticed. */
function existing(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) existing(full, out);
    else out.push(full);
  }
  return out;
}

const present = existing(MODULES);
const stale = present.filter(file => !wanted.has(file));
const changed = [...wanted].filter(
  ([file, source]) =>
    !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== source,
);

// The exports map ------------------------------------------------------------
const manifestText = fs.readFileSync(MANIFEST, 'utf8');
const manifest = JSON.parse(manifestText);
const nextExports = {...fixedExports(manifest.exports ?? {}), ...DIRECT};
for (const subpath of paths) {
  nextExports[`./${subpath}`] = {
    types: `./dist/modules/${subpath}/index.d.ts`,
    default: `./dist/modules/${subpath}/index.js`,
  };
}
manifest.exports = nextExports;
const nextManifest = await prettier.format(
  `${JSON.stringify(manifest, null, 2)}\n`,
  {...config, parser: 'json'},
);
const manifestDrifted = nextManifest !== manifestText;

if (CHECK) {
  if (changed.length === 0 && stale.length === 0 && !manifestDrifted) {
    console.log(
      `Subpath modules are up to date (${paths.length} modules from ${CORE}@${corePkg.version}).`,
    );
    process.exit(0);
  }
  console.error('\nSubpath module check FAILED:\n');
  for (const [file] of changed)
    console.error(`  - ${path.relative(PACKAGE, file)} is missing or stale`);
  for (const file of stale)
    console.error(
      `  - ${path.relative(PACKAGE, file)} is no longer an upstream module`,
    );
  if (manifestDrifted)
    console.error('  - package.json#exports does not match the modules');
  console.error(
    '\nRun `pnpm --filter @tecton/react generate:modules` and commit the result.',
  );
  process.exit(1);
}

for (const file of stale) fs.rmSync(file);
for (const [file, source] of changed) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, source);
}
/** Directories a removed module left behind, innermost first. */
function pruneEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.isDirectory()) pruneEmpty(path.join(dir, entry.name));
  }
  if (dir !== MODULES && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}
pruneEmpty(MODULES);
if (manifestDrifted) fs.writeFileSync(MANIFEST, nextManifest);

console.log(
  `${paths.length} subpath modules written from ${CORE}@${corePkg.version}` +
    ` (${changed.length} changed, ${stale.length} removed), plus ` +
    `${Object.keys(DIRECT).length} published straight from the vendored files` +
    `${manifestDrifted ? ', package.json#exports updated' : ''}.`,
);
