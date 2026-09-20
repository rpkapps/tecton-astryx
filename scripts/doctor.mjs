#!/usr/bin/env node
/**
 * `pnpm doctor` — says whether this checkout can run, and what to do next.
 *
 * Checks the things that have actually tripped people up: Node and pnpm
 * versions, a CRLF checkout (breaks the byte-for-byte drift checks), a missing
 * install, and a package that has not been built (the docs site and the
 * fixtures consume the built package).
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootPkg = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'),
);
const wantedPnpm = rootPkg.packageManager.split('@')[1];

let failures = 0;
const ok = message => console.log(`  ok    ${message}`);
const bad = (message, fix) => {
  failures += 1;
  console.log(`  FAIL  ${message}`);
  if (fix) console.log(`        -> ${fix}`);
};
const run = (cmd, args) =>
  execFileSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();

console.log('\nTecton doctor\n');

// Node
const major = Number(process.versions.node.split('.')[0]);
if (major >= 22) ok(`node ${process.versions.node}`);
else
  bad(`node ${process.versions.node} is too old`, 'install Node 22 or newer');

// pnpm
let pnpmVersion = null;
try {
  pnpmVersion = run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', [
    '--version',
  ]);
} catch {
  /* handled below */
}
if (!pnpmVersion) {
  bad(
    'pnpm is not on PATH',
    'run `corepack enable` (ships with Node) and re-open the shell',
  );
} else if (pnpmVersion !== wantedPnpm) {
  ok(
    `pnpm ${pnpmVersion} (repository pins ${wantedPnpm}; corepack switches automatically)`,
  );
} else {
  ok(`pnpm ${pnpmVersion}`);
}

// Line endings: any tracked text file checked out with CRLF breaks the
// generated-file checks and the docs example rewriter.
try {
  const eol = run('git', [
    'ls-files',
    '--eol',
    '--',
    'packages/react/src/theme/palette.generated.ts',
    'packages/react/src/icons/generated/index.ts',
    'README.md',
  ]);
  const crlf = eol.split('\n').filter(line => /\bw\/crlf\b/.test(line));
  if (crlf.length === 0) ok('checkout uses LF line endings');
  else
    bad(
      `${crlf.length} tracked file(s) are checked out with CRLF`,
      'run: git config core.autocrlf false && git add --renormalize . && git checkout -- .',
    );
} catch {
  ok('not a git checkout (line-ending check skipped)');
}

// Install
if (fs.existsSync(path.join(ROOT, 'node_modules', '.pnpm')))
  ok('dependencies installed');
else bad('dependencies are not installed', 'run: pnpm install');

// Built package
const dist = path.join(ROOT, 'packages/react/dist/index.js');
if (fs.existsSync(dist)) {
  const built = fs.statSync(dist).mtimeMs;
  const srcDir = path.join(ROOT, 'packages/react/src');
  let newest = 0;
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else newest = Math.max(newest, fs.statSync(full).mtimeMs);
    }
  };
  walk(srcDir);
  if (newest > built)
    bad(
      '@tecton/react/dist is older than its source',
      'run: pnpm build:package',
    );
  else ok('@tecton/react is built');
} else {
  bad(
    '@tecton/react is not built (the docs site and fixtures consume dist/)',
    'run: pnpm build:package',
  );
}

console.log('');
if (failures === 0) {
  console.log(
    'Everything is in place. Next: `pnpm dev` (docs site with live examples) or `pnpm check`.\n',
  );
} else {
  console.log(`${failures} thing(s) to fix, then run \`pnpm doctor\` again.\n`);
  process.exitCode = 1;
}
