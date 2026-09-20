#!/usr/bin/env node
/**
 * Consumer surface guard.
 *
 * Tecton is a design system in its own right: nothing a consumer reads, types
 * or imports may leak the name of the upstream component library Tecton is
 * implemented on top of. This script fails the build when
 *
 *   1. any file under `fixtures/consumers/<app>/src/**` mentions the upstream
 *      name (case-insensitive), or
 *   2. the declarations behind **any** exported subpath of `@tecton/react`
 *      mention it — in an exported name, in the right-hand side of a type
 *      alias, in an `import(...)` inside a published type, or in a doc comment
 *      an editor will show. A `.d.ts` carries no implementation, so every
 *      mention in one is part of what a consumer is handed.
 *
 * Rule 2 is deliberately blunt: re-exporting an upstream type under a Tecton
 * name (`export type ButtonVariant = AstryxButtonVariant`) hides the name from
 * the export list but not from the consumer's editor, so the text of every
 * reachable declaration file is checked, not just the names it exports.
 *
 * Internal imports inside packages/react/src are expected and not checked.
 *
 * The build vendors the upstream library into `dist/vendor/core/` and rewrites
 * every import of it to a relative path (`../vendor/core/dist/Dialog/index.js`
 * and friends — see docs/engineering/build-pipeline.md, step 8). Those paths
 * are internal plumbing, not surface: they name a directory, not the upstream
 * system, so they do not trip rule 2 and no exception is needed for them. Rule
 * 2 keeps doing its job either way — a vendored path that still carried the
 * upstream name, or a declaration that re-exported an upstream type under an
 * upstream name, would still fail. Keep the vendor directory named for its
 * role rather than for its origin, and this stays true.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE = path.join(ROOT, 'packages', 'react');
const FORBIDDEN = /astryx/i;

/** @type {string[]} */
const failures = [];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

// 1. Fixture consumer sources -------------------------------------------------
const consumersDir = path.join(ROOT, 'fixtures', 'consumers');
const consumerApps = fs.existsSync(consumersDir)
  ? fs
      .readdirSync(consumersDir, {withFileTypes: true})
      .filter(d => d.isDirectory())
  : [];

if (consumerApps.length === 0) {
  failures.push('No consumer fixtures found under fixtures/consumers/*.');
}

for (const app of consumerApps) {
  const srcDir = path.join(consumersDir, app.name, 'src');
  for (const file of walk(srcDir)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (FORBIDDEN.test(line)) {
        failures.push(
          `${path.relative(ROOT, file)}:${i + 1} mentions the upstream library: ${line.trim()}`,
        );
      }
    });
  }
}

// 2. Public type surface ------------------------------------------------------
function resolveDeclaration(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base.replace(/\.js$/, '.d.ts'),
    `${base}.d.ts`,
    path.join(base, 'index.d.ts'),
    base,
  ];
  return candidates.find(c => fs.existsSync(c) && c.endsWith('.d.ts'));
}

/** Every declaration file reachable from an entry point by re-export. */
function reachable(file, seen = new Set()) {
  if (!file || seen.has(file)) return seen;
  seen.add(file);
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(
    /export\s+(?:\*|type\s+\*|\{[^}]*\})\s+from\s+['"](\.[^'"]+)['"]/g,
  )) {
    reachable(resolveDeclaration(file, match[1]), seen);
  }
  return seen;
}

/** The names an entry point exports, following local re-exports. */
function exportedNames(file, seen = new Set()) {
  if (!file || seen.has(file)) return [];
  seen.add(file);
  const source = fs.readFileSync(file, 'utf8');
  const names = [];

  for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
    for (const clause of match[1].split(',')) {
      const trimmed = clause.trim();
      if (!trimmed) continue;
      const alias = trimmed
        .split(/\s+as\s+/)
        .pop()
        .trim();
      names.push(alias.replace(/^type\s+/, ''));
    }
  }
  const declared =
    /export\s+declare\s+(?:const|let|var|function|class|abstract\s+class|namespace|enum)\s+([A-Za-z_$][\w$]*)/g;
  for (const match of source.matchAll(declared)) names.push(match[1]);
  for (const match of source.matchAll(
    /export\s+(?:type|interface)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    names.push(match[1]);
  }
  for (const match of source.matchAll(
    /export\s+\*\s+from\s+['"](\.[^'"]+)['"]/g,
  )) {
    names.push(...exportedNames(resolveDeclaration(file, match[1]), seen));
  }
  return names;
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(PACKAGE, 'package.json'), 'utf8'),
);

/** Every subpath the package publishes types for, with its entry `.d.ts`. */
const entries = Object.entries(pkg.exports ?? {})
  .map(([subpath, target]) => [
    subpath,
    typeof target === 'object' && target !== null ? target.types : undefined,
  ])
  .filter(([, types]) => typeof types === 'string')
  .map(([subpath, types]) => [subpath, path.join(PACKAGE, types)]);

if (entries.length === 0) {
  failures.push(
    'packages/react/package.json publishes no typed subpaths — is the manifest broken?',
  );
}

const checkedFiles = new Set();
let checkedNames = 0;

for (const [subpath, entry] of entries) {
  if (!fs.existsSync(entry)) {
    failures.push(
      `${path.relative(ROOT, entry)} is missing — build @tecton/react before running this check (subpath "${subpath}").`,
    );
    continue;
  }

  const names = exportedNames(entry);
  if (names.length === 0) {
    failures.push(
      `${path.relative(ROOT, entry)} exports nothing — is the build broken?`,
    );
  }
  checkedNames += names.length;
  for (const name of names) {
    if (FORBIDDEN.test(name)) {
      failures.push(
        `"${name}", exported from "@tecton/react${subpath.slice(1)}", leaks the upstream name.`,
      );
    }
  }

  for (const file of reachable(entry)) {
    if (checkedFiles.has(file)) continue;
    checkedFiles.add(file);
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (FORBIDDEN.test(line)) {
        failures.push(
          `${path.relative(ROOT, file)}:${i + 1} puts the upstream name in the published types: ${line.trim()}`,
        );
      }
    });
  }
}

console.log(
  `Checked ${checkedNames} exported names across ${entries.length} subpaths and ${checkedFiles.size} declaration files.`,
);

if (failures.length > 0) {
  console.error('\nConsumer surface check FAILED:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('Consumer surface check passed.');
