#!/usr/bin/env node
/**
 * Does the documentation site still describe the package?
 *
 * The site is generated: every page under `apps/docs/content/docs` and every
 * module under `apps/docs/src/generated` is printed from the package, from the
 * built theme or from an authored guide. That is what keeps it honest, and it
 * is also what makes a silent gap possible — a component whose doc file never
 * landed, an example nothing renders, a guide missing from the sidebar, a page
 * the search index never heard of. Nothing in the site would break; it would
 * simply stop being complete.
 *
 * This script is the check for that. It runs against the generated trees and
 * the built export, so it fails on the artefact rather than on the intention:
 *
 *   1. every component the package's barrel exports has a page,
 *   2. every page the generator claims exists on disk and in the export,
 *   3. every example in the registry is rendered by exactly one page,
 *   4. every example's generated module imports the public entry point,
 *   5. every written guide is in the sidebar's `meta.json`,
 *   6. every foundations page's sources are still where it reads them from,
 *   7. the exported search index carries every page,
 *   8. no page names the upstream library the package is built on.
 *
 * Run it after `pnpm --filter @tecton/docs build`; `pnpm check` does.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const APP_ROOT = path.join(REPO_ROOT, 'apps/docs');
const CONTENT = path.join(APP_ROOT, 'content/docs');
const GENERATED = path.join(APP_ROOT, 'src/generated');
const EXPORT = path.join(APP_ROOT, 'out');
const PACKAGE_SRC = path.join(REPO_ROOT, 'packages/react/src');

const problems = [];
const notes = [];
const fail = message => problems.push(message);
const ok = message => notes.push(message);

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

/** Read a generated TypeScript module's single exported literal. */
function readGenerated(name) {
  const file = path.join(GENERATED, `${name}.ts`);
  if (!fs.existsSync(file)) {
    throw new Error(
      `apps/docs/src/generated/${name}.ts is missing. Run: pnpm --filter @tecton/docs generate`,
    );
  }
  const source = read(file);
  const start = source.indexOf('= ', source.indexOf('export const'));
  const literal = source.slice(start + 2).replace(/;\s*$/, '');
  return JSON.parse(literal);
}

if (!fs.existsSync(CONTENT) || !fs.existsSync(GENERATED)) {
  console.error(
    'The docs site has not been generated. Run: pnpm --filter @tecton/docs generate',
  );
  process.exit(1);
}

const components = readGenerated('componentRegistry');
const examples = readGenerated('exampleRegistry');
const templates = readGenerated('templateRegistry');
const guides = readGenerated('guideRegistry');
const foundations = readGenerated('foundationPages');
const pages = readGenerated('sitePages');

/* -------------------------------------------------------------------------- */
/* 1. Every exported component is documented                                  */
/* -------------------------------------------------------------------------- */

/**
 * What the package's barrel publishes out of `components/`, as values.
 *
 * Type-only exports are a separate statement and are skipped: a page documents
 * something a consumer can render or call, not a type. Not every one is a
 * component — `useToast` is a hook — so the check below matches a page by
 * either the name it is filed under or the name it is published as.
 */
function barrelComponents(entry = 'index.ts', seen = new Set()) {
  const file = path.join(PACKAGE_SRC, entry);
  if (seen.has(file) || !fs.existsSync(file)) return new Set();
  seen.add(file);
  const source = read(file);
  const names = new Set();
  for (const match of source.matchAll(
    /export\s+\{([^}]*)\}\s+from\s+'(?:\.\.\/)*\.?\/?components\/[A-Za-z0-9]+\//g,
  )) {
    for (const name of match[1].split(',')) {
      const trimmed = name.trim();
      if (!trimmed || trimmed.startsWith('type ')) continue;
      names.add(trimmed.replace(/^.*\s+as\s+/, ''));
    }
  }
  // The barrel keeps its generated pass-through components in a second
  // module it re-exports wholesale (`export * from './generated/…'`); follow it.
  for (const match of source.matchAll(/export\s+\*\s+from\s+'(\.[^']*)'/g)) {
    const target = path
      .join(path.dirname(entry), match[1])
      .replace(/\.js$/, '.ts');
    for (const name of barrelComponents(target, seen)) names.add(name);
  }
  return names;
}

/** Every name a page answers to: what it is filed under, and what it is called. */
const documented = new Map();
for (const entry of components) {
  documented.set(entry.name, entry.name);
  if (entry.displayName) documented.set(entry.displayName, entry.name);
}
const exported = barrelComponents();
for (const name of [...exported].sort()) {
  if (!documented.has(name)) {
    fail(
      `@tecton/react exports "${name}", but no page documents it. Add packages/react/src/components/${name}/${name}.doc.mjs.`,
    );
  }
}
for (const entry of components) {
  if (!exported.has(entry.name) && !exported.has(entry.displayName ?? '')) {
    fail(
      `The site documents "${entry.name}", which the package's barrel does not export.`,
    );
  }
}
if (problems.length === 0) {
  ok(`${exported.size} exported components and hooks, all documented.`);
}

/* -------------------------------------------------------------------------- */
/* 2. Every page the generator claims exists                                  */
/* -------------------------------------------------------------------------- */

/** Where a site path's MDX file lives. */
function mdxFor(url) {
  const slug = url.replace(/^\/docs\/?/, '');
  const candidates = slug
    ? [`${slug}.mdx`, path.join(slug, 'index.mdx')]
    : ['index.mdx'];
  return candidates
    .map(candidate => path.join(CONTENT, candidate))
    .find(candidate => fs.existsSync(candidate));
}

for (const page of pages) {
  if (!mdxFor(page.url)) {
    fail(
      `${page.url} is in the page list but has no MDX file under content/docs.`,
    );
  }
}

const expectedPages = new Set(pages.map(page => page.url));
for (const component of components) {
  const url = `/docs/components/${component.name}`;
  if (!expectedPages.has(url)) fail(`${component.name} has no page at ${url}.`);
}
for (const template of templates) {
  const url = `/docs/templates/${template.id}`;
  if (!expectedPages.has(url))
    fail(`The template ${template.id} has no page at ${url}.`);
}
ok(`${pages.length} generated pages, all backed by an MDX file.`);

/* -------------------------------------------------------------------------- */
/* 3 & 4. Every example is rendered once, from the public entry point         */
/* -------------------------------------------------------------------------- */

/** Which page renders which example, read out of the generated MDX. */
const renderedBy = new Map();
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}
for (const file of walk(CONTENT)) {
  for (const match of read(file).matchAll(
    /<ExampleFrame\s+id=\{"([^"]+)"\}/g,
  )) {
    const where = path.relative(CONTENT, file);
    renderedBy.set(match[1], [...(renderedBy.get(match[1]) ?? []), where]);
  }
}

for (const example of examples) {
  const where = renderedBy.get(example.id) ?? [];
  if (where.length === 0) {
    fail(
      `The example "${example.id}" is in the registry but no page renders it.`,
    );
  } else if (where.length > 1) {
    fail(
      `The example "${example.id}" is rendered by ${where.length} pages (${where.join(', ')}); it should belong to exactly one.`,
    );
  }

  const module = path.join(GENERATED, 'examples', `${example.id}.tsx`);
  if (!fs.existsSync(module)) {
    fail(
      `The example "${example.id}" has no runnable module in src/generated/examples.`,
    );
    continue;
  }
  const source = read(module);
  if (!source.includes("from '@tecton/react'")) {
    fail(`The example "${example.id}" does not import from '@tecton/react'.`);
  }
  if (/from\s+'\.\.?\//.test(source)) {
    fail(`The example "${example.id}" still carries a relative import.`);
  }
}
const known = new Set(examples.map(example => example.id));
for (const id of renderedBy.keys()) {
  if (!known.has(id))
    fail(`A page renders "${id}", which is not in the example registry.`);
}
ok(`${examples.length} examples, each rendered by exactly one page.`);

/* -------------------------------------------------------------------------- */
/* 5. Every guide is in the sidebar                                           */
/* -------------------------------------------------------------------------- */

const rootMeta = JSON.parse(read(path.join(CONTENT, 'meta.json')));
const sidebar = new Set(rootMeta.pages);
for (const guide of guides) {
  if (!sidebar.has(guide.name)) {
    fail(`The guide "${guide.name}" is not listed in content/docs/meta.json.`);
  }
}
for (const section of ['foundations', 'components', 'templates', 'changelog']) {
  if (!sidebar.has(section)) {
    fail(`The sidebar does not list the "${section}" section.`);
  }
}
const componentMeta = JSON.parse(
  read(path.join(CONTENT, 'components/meta.json')),
);
for (const component of components) {
  if (!componentMeta.pages.includes(component.name)) {
    fail(`${component.name} is missing from the components sidebar.`);
  }
}
ok(
  `${guides.length} guides and ${components.length} components in the sidebar.`,
);

/* -------------------------------------------------------------------------- */
/* 6. Every foundations page's sources are still there                        */
/* -------------------------------------------------------------------------- */

const {foundationPages: declared} = await import(
  pathToFileURL(path.join(APP_ROOT, 'scripts/foundation-sources.mjs')).href
);
for (const page of declared) {
  for (const source of page.sources) {
    if (!fs.existsSync(path.join(REPO_ROOT, source))) {
      fail(
        `The ${page.name} foundations page reads ${source}, which is missing. Build the package, or update apps/docs/scripts/foundation-sources.mjs.`,
      );
    }
  }
  if (!foundations.some(entry => entry.name === page.name)) {
    fail(`The foundations page "${page.name}" was never generated.`);
  }
}
ok(`${declared.length} foundations pages, every source present.`);

/* -------------------------------------------------------------------------- */
/* 7 & 8. The export: search index and the upstream name                      */
/* -------------------------------------------------------------------------- */

if (!fs.existsSync(EXPORT)) {
  ok(
    'No static export to check; run pnpm --filter @tecton/docs build for the rest.',
  );
} else {
  const index = path.join(EXPORT, 'api/search');
  if (!fs.existsSync(index)) {
    fail('The static export has no search index at out/api/search.');
  } else {
    const indexed = new Set(
      JSON.parse(read(index)).internalDocumentIDStore.internalIdToId.map(id =>
        // Each heading and paragraph is indexed under "<url>-<n>".
        String(id).replace(/-\d+$/, ''),
      ),
    );
    for (const page of pages) {
      if (!indexed.has(page.url)) {
        fail(`${page.url} is not in the exported search index.`);
      }
    }
    ok(`${pages.length} pages in the exported search index.`);
  }

  // The package is built on an upstream library whose name is not Tecton's to
  // show. It may appear in class names, which readers never see; it may not
  // appear in anything a page says.
  const named = [];
  for (const file of walk(CONTENT)) {
    if (/astryx/i.test(read(file))) named.push(path.relative(REPO_ROOT, file));
  }
  if (named.length > 0) {
    fail(`These pages name the upstream library: ${named.join(', ')}.`);
  } else {
    ok('No page names the upstream library.');
  }
}

/* -------------------------------------------------------------------------- */

for (const note of notes) console.log(`  ✓ ${note}`);
if (problems.length > 0) {
  console.error('\nThe documentation site is out of step with the package:\n');
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  console.error('');
  process.exit(1);
}
console.log('\nThe documentation site covers the package.');
