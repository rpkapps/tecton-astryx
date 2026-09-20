#!/usr/bin/env node
/**
 * The README's component list.
 *
 * The package README opens with what Tecton *is* and closes with how it is
 * built; in between is a table of every component, and that table is the one
 * part of it that cannot be maintained by hand — there are 180 components, and
 * each one's one-line description already exists, beside the component, in its
 * `.doc.mjs`. So the section between `## Components` and the heading after it
 * is generated from those files, grouped by the category each doc declares.
 *
 * Everything outside that section is written by a person and never touched.
 *
 *   node scripts/generate-readme.mjs            # rewrite the section
 *   node scripts/generate-readme.mjs --check    # fail if it has drifted
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import prettier from 'prettier';

const PACKAGE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const SRC = path.join(PACKAGE, 'src');
const README = path.join(PACKAGE, 'README.md');
const CHECK = process.argv.includes('--check');

const manifest = JSON.parse(
  fs.readFileSync(path.join(PACKAGE, 'wrappers.manifest.json'), 'utf8'),
);

/** The order the categories read in: what you act with, then what you show. */
const ORDER = [
  'Action',
  'Forms',
  'Content',
  'Typography',
  'Feedback',
  'Data',
  'Navigation',
  'Surfaces',
  'Overlay',
  'Layout',
  'Chat',
  'Providers',
];

/** The first sentence of a description, which is what a table row wants. */
function firstSentence(text) {
  const match = String(text ?? '').match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : String(text ?? '')).trim();
}

const rows = new Map();
for (const entry of manifest.components) {
  const docFile = path.join(
    SRC,
    'components',
    entry.name,
    `${entry.name}.doc.mjs`,
  );
  if (!fs.existsSync(docFile)) continue;
  const module = await import(pathToFileURL(docFile).href);
  const doc = module.docs ?? module.default;
  const category = doc?.category ?? entry.category;
  if (!rows.has(category)) rows.set(category, []);
  rows.get(category).push({
    name: entry.name,
    generated: !entry.handwritten,
    examples: (doc?.examples ?? []).length,
    description: firstSentence(doc?.usage?.description),
  });
}

const categories = [
  ...ORDER.filter(category => rows.has(category)),
  ...[...rows.keys()].filter(category => !ORDER.includes(category)).sort(),
];

const total = [...rows.values()].reduce((sum, list) => sum + list.length, 0);
const generated = [...rows.values()]
  .flat()
  .filter(component => component.generated).length;
const examples = [...rows.values()]
  .flat()
  .reduce((sum, component) => sum + component.examples, 0);
const templates = fs.existsSync(path.join(SRC, 'templates'))
  ? fs
      .readdirSync(path.join(SRC, 'templates'), {withFileTypes: true})
      .filter(entry => entry.isDirectory()).length
  : 0;

const lines = [
  '## Components',
  '',
  `${total} components, every one exported from the package root and from its`,
  'own subpath (`@tecton/react/Button`). The hooks and data types they need are',
  'at `@tecton/react/support`, the icon set at `@tecton/react/icons`, the tokens',
  'at `@tecton/react/theme` and the page templates at `@tecton/react/templates`.',
  '',
  `${total - generated} of them are designed: Tecton names the props, narrows`,
  'the choices and writes the documentation. The other ' +
    `${generated} are published as they`,
  'are, under Tecton names and with Tecton glyphs on their icon props; they are',
  'generated from `wrappers.manifest.json`, and',
  '`docs/engineering/component-mapping.md` says which is which and why.',
  '',
  `Between them they carry ${examples} runnable examples and ${templates} page templates.`,
  '',
];

for (const category of categories) {
  const list = rows.get(category).sort((a, b) => a.name.localeCompare(b.name));
  lines.push(`### ${category}`);
  lines.push('');
  lines.push('| Component | What it is |');
  lines.push('| --- | --- |');
  for (const component of list) {
    const description = component.description.replace(/\|/g, '\\|');
    lines.push(`| \`${component.name}\` | ${description} |`);
  }
  lines.push('');
}

lines.push(
  '`docs/engineering/component-mapping.md` in the repository lists, for each',
);
lines.push(
  'component, what it is built on, how the props map, and where Tecton’s design',
);
lines.push('and what the component can express disagree.');
lines.push('');

const readme = fs.readFileSync(README, 'utf8');
const start = readme.indexOf('## Components');
if (start === -1) {
  console.error('README has no "## Components" section to generate into.');
  process.exit(1);
}
const after = readme.indexOf('\n## ', start + 1);
if (after === -1) {
  console.error('README has no heading after "## Components".');
  process.exit(1);
}

const config = await prettier.resolveConfig(README);
const next = await prettier.format(
  readme.slice(0, start) + lines.join('\n') + readme.slice(after + 1),
  {...config, parser: 'markdown'},
);

if (next === readme) {
  console.log(`README component list is up to date (${total} components).`);
  process.exit(0);
}

if (CHECK) {
  console.error(
    '\nREADME check FAILED: the component list has drifted.\n' +
      'Run `pnpm --filter @tecton/react generate:readme` and commit the result.',
  );
  process.exit(1);
}

fs.writeFileSync(README, next);
console.log(
  `README component list regenerated: ${total} components (${generated} generated), ${examples} examples, ${templates} templates.`,
);
