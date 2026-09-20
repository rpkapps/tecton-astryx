#!/usr/bin/env node
/**
 * The README's module list.
 *
 * The package README opens with what Tecton *is* and closes with how it is
 * used; in between is the list of everything it publishes. That list is not
 * written by hand, because it is not an editorial choice: it is exactly the
 * `exports` map of `packages/react/package.json`, which
 * `scripts/generate-modules.mjs` derives from the component system's own
 * exports map. Generating it from there is what keeps the front page true
 * across an upgrade.
 *
 * Everything outside the `## Modules` section is written by a person and never
 * touched.
 *
 *   node scripts/generate-readme.mjs            # rewrite the section
 *   node scripts/generate-readme.mjs --check    # fail if it has drifted
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import prettier from 'prettier';

const PACKAGE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const README = path.join(PACKAGE, 'README.md');
const CHECK = process.argv.includes('--check');

const pkg = JSON.parse(
  fs.readFileSync(path.join(PACKAGE, 'package.json'), 'utf8'),
);

/** The entry points that are not a module: stylesheets and the manifest. */
const NOT_A_MODULE = new Set(['./package.json']);

const subpaths = Object.keys(pkg.exports)
  .filter(
    subpath =>
      subpath !== '.' &&
      !subpath.endsWith('.css') &&
      !NOT_A_MODULE.has(subpath),
  )
  .map(subpath => subpath.slice(2));

const stylesheets = Object.keys(pkg.exports).filter(subpath =>
  subpath.endsWith('.css'),
);

/**
 * Three columns, alphabetical down each one. A flat list of 120 names in one
 * column is a scroll; three is a glance.
 */
const COLUMNS = 3;
const sorted = [...subpaths].sort((a, b) => a.localeCompare(b));
const rows = Math.ceil(sorted.length / COLUMNS);

const lines = [
  '## Modules',
  '',
  `Everything below is exported from the package root as well, so`,
  '`import {Button} from \'@tecton/react\'` and',
  '`import {Button} from \'@tecton/react/Button\'` are the same component. Pick',
  'the subpath when you would rather not pull the whole surface through one',
  'module.',
  '',
  `${sorted.length} subpaths, plus ${stylesheets.length} stylesheet entry points`,
  `(${stylesheets.map(s => `\`@tecton/react/${s.slice(2)}\``).join(', ')}).`,
  '',
  `| ${Array.from({length: COLUMNS}, () => ' ').join(' | ')} |`,
  `| ${Array.from({length: COLUMNS}, () => '---').join(' | ')} |`,
];

for (let row = 0; row < rows; row += 1) {
  const cells = [];
  for (let column = 0; column < COLUMNS; column += 1) {
    const name = sorted[column * rows + row];
    cells.push(name ? `\`@tecton/react/${name}\`` : '');
  }
  lines.push(`| ${cells.join(' | ')} |`);
}
lines.push('');

const readme = fs.readFileSync(README, 'utf8');
const start = readme.indexOf('## Modules');
if (start === -1) {
  console.error('README has no "## Modules" section to generate into.');
  process.exit(1);
}
const after = readme.indexOf('\n## ', start + 1);
if (after === -1) {
  console.error('README has no heading after "## Modules".');
  process.exit(1);
}

const config = await prettier.resolveConfig(README);
const next = await prettier.format(
  readme.slice(0, start) + lines.join('\n') + readme.slice(after + 1),
  {...config, parser: 'markdown'},
);

if (next === readme) {
  console.log(`README module list is up to date (${sorted.length} subpaths).`);
  process.exit(0);
}

if (CHECK) {
  console.error(
    '\nREADME check FAILED: the module list has drifted.\n' +
      'Run `pnpm --filter @tecton/react generate:readme` and commit the result.',
  );
  process.exit(1);
}

fs.writeFileSync(README, next);
console.log(`README module list regenerated: ${sorted.length} subpaths.`);
