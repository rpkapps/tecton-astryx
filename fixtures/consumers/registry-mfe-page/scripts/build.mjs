#!/usr/bin/env node
/**
 * Build the two-version micro-frontend page out of `node_modules`.
 *
 * Both versions of `@tecton/react` are already installed here, from a
 * registry, under npm aliases:
 *
 *   node_modules/tecton-a   @tecton/react@<A>
 *   node_modules/tecton-b   @tecton/react@<B>
 *
 * Nothing in this script patches, rewrites or synthesises a version — that is
 * the difference between this fixture and `fixtures/consumers/mfe-harness/`,
 * which derives its second version by editing a copy of `dist/`. Here the two
 * versions were published and installed, and all this does is bundle each
 * container against the one it owns and copy the stylesheets the host links.
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES = path.join(FIXTURE, 'node_modules');
const OUT = path.join(FIXTURE, 'dist', 'host');

function installed(alias) {
  const dir = path.join(MODULES, alias);
  const manifest = path.join(dir, 'package.json');
  if (!fs.existsSync(manifest)) {
    throw new Error(
      `${alias} is not installed — run \`npm install\` in ${FIXTURE} first.`,
    );
  }
  const {name, version} = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  return {dir, name, version};
}

const versions = {a: installed('tecton-a'), b: installed('tecton-b')};
if (versions.a.version === versions.b.version) {
  throw new Error(
    `tecton-a and tecton-b both resolved to ${versions.a.version} — the two ` +
      'published versions must differ.',
  );
}

fs.rmSync(path.join(FIXTURE, 'dist'), {recursive: true, force: true});
fs.mkdirSync(path.join(OUT, 'css'), {recursive: true});

// --- the bundles -------------------------------------------------------------
const vite = path.join(MODULES, 'vite', 'bin', 'vite.js');
for (const id of ['a', 'b']) {
  console.log(
    `▸ Bundling container ${id} against ${versions[id].name}@${versions[id].version}`,
  );
  execFileSync(
    process.execPath,
    [vite, 'build', '--config', path.join(FIXTURE, 'vite.config.mjs')],
    {cwd: FIXTURE, stdio: 'inherit', env: {...process.env, MFE_TARGET: id}},
  );
}

// --- the stylesheets ---------------------------------------------------------
// One tokens.css for the page — the newest version's — and one components.css
// per container, exactly as the micro-frontend guide says.
fs.copyFileSync(
  path.join(versions.b.dir, 'dist', 'tecton-tokens.css'),
  path.join(OUT, 'css', 'tokens-b.css'),
);
for (const id of ['a', 'b']) {
  fs.copyFileSync(
    path.join(versions[id].dir, 'dist', 'tecton-components.css'),
    path.join(OUT, 'css', `components-${id}.css`),
  );
}

fs.copyFileSync(
  path.join(FIXTURE, 'host', 'mfe-page.html'),
  path.join(OUT, 'mfe-page.html'),
);

console.log(
  `\nregistry-mfe-page built into dist/host ` +
    `(A=${versions.a.version}, B=${versions.b.version}).\n`,
);
