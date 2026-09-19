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
 *   2. any exported name of `packages/react/dist/index.d.ts` (following local
 *      `export * from` re-exports) contains it.
 *
 * Internal imports inside packages/react/src are expected and not checked.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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

const entryTypes = path.join(ROOT, 'packages', 'react', 'dist', 'index.d.ts');
if (!fs.existsSync(entryTypes)) {
  failures.push(
    'packages/react/dist/index.d.ts is missing — build @tecton/react before running this check.',
  );
} else {
  const names = exportedNames(entryTypes);
  if (names.length === 0) {
    failures.push(
      'packages/react/dist/index.d.ts exports nothing — is the build broken?',
    );
  }
  for (const name of names) {
    if (FORBIDDEN.test(name)) {
      failures.push(
        `packages/react/dist/index.d.ts exports "${name}", which leaks the upstream name.`,
      );
    }
  }
  console.log(
    `Checked ${names.length} exported names in packages/react/dist/index.d.ts.`,
  );
}

if (failures.length > 0) {
  console.error('\nConsumer surface check FAILED:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('Consumer surface check passed.');
