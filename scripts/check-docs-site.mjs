#!/usr/bin/env node
/**
 * Does the documentation site still describe the package?
 *
 * The site is generated: every page under `apps/docs/content/docs` and every
 * module under `apps/docs/src/generated` is printed from the component system's
 * own doc objects, from the ported examples, from the built theme or from an
 * authored guide. That is what keeps it honest, and it is also what makes a
 * silent gap possible — a module whose page never got written, an example
 * nothing renders, a guide missing from the sidebar, a page the search index
 * never heard of. Nothing would break; the site would simply stop being
 * complete.
 *
 * This script is the check for that. It runs against the generated trees and
 * the built export, so it fails on the artefact rather than on the intention:
 *
 *   1. every exported module with a main doc has a page, and every page
 *      documents a module the package exports;
 *   2. every page the generator claims exists on disk;
 *   3. every ported example is rendered by exactly one page, and no page
 *      renders an example that is not in the registry;
 *   4. every example's module resolves to a file under apps/docs/examples;
 *   5. every written guide, and every section, is in the sidebar — and every
 *      component page is in the grouped component sidebar exactly once;
 *   6. every source a foundations page reads is still where it reads it from;
 *   7. the exported search index carries every page;
 *   8. nothing a reader sees names the upstream library, beyond the literal
 *      names they meet in DevTools.
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
const EXAMPLES = path.join(APP_ROOT, 'examples');
// `vite build` prerenders every route into `dist/client`, which is the whole
// static export: the HTML, the assets and the search index, and nothing else.
const EXPORT = path.join(APP_ROOT, 'dist/client');
const PACKAGE_ROOT = path.join(REPO_ROOT, 'packages/react');
const UPSTREAM_SRC = path.join(
  PACKAGE_ROOT,
  'node_modules/@astryxdesign/core/src',
);

const problems = [];
const notes = [];
const fail = message => problems.push(message);
const ok = message => notes.push(message);

const read = file => fs.readFileSync(file, 'utf8');

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

const components = readGenerated('componentIndex');
const examples = readGenerated('exampleIndex');
const templates = readGenerated('templateIndex');
const guides = readGenerated('guideIndex');
const foundations = readGenerated('foundationPages');
const sidebar = readGenerated('componentSidebar');
const pages = readGenerated('sitePages');

/* -------------------------------------------------------------------------- */
/* 1. Every module with a doc has a page, and every page has a module          */
/* -------------------------------------------------------------------------- */

/**
 * Every main doc the component system ships, found the way the generator finds
 * them: a `.doc.mjs` under `<Module>/` whose doc object is not a
 * sub-component's. They are imported rather than parsed, because a doc object
 * is a module and its `name` is a value, not a line of text — but nothing of
 * the generator's own logic is used, which is the point: this catches the
 * generator dropping one.
 */
async function upstreamMainDocs(dir = UPSTREAM_SRC, out = new Map()) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await upstreamMainDocs(full, out);
      continue;
    }
    if (!entry.name.endsWith('.doc.mjs')) continue;
    const module = await import(pathToFileURL(full).href);
    const doc = module.docs;
    if (!doc || doc.subComponentOf) continue;
    const name =
      doc.name ?? entry.name.replace(/\.doc\.mjs$/, '').replace(/^XDS/, '');
    out.set(name, path.relative(UPSTREAM_SRC, full).replaceAll(path.sep, '/'));
  }
  return out;
}

const exportSubpaths = new Set(
  Object.keys(
    JSON.parse(read(path.join(PACKAGE_ROOT, 'package.json'))).exports ?? {},
  ).map(entry => entry.replace(/^\.\/?/, '')),
);

const documented = new Map(components.map(entry => [entry.name, entry]));
const mainDocs = await upstreamMainDocs();

for (const [name, file] of [...mainDocs].sort()) {
  if (!documented.has(name)) {
    fail(
      `@tecton/react re-exports the module documented by ${file}, but no page documents "${name}".`,
    );
  }
}
for (const entry of components) {
  if (!mainDocs.has(entry.name)) {
    fail(
      `The site documents "${entry.name}", which has no main doc under @astryxdesign/core/src.`,
    );
  }
  if (!exportSubpaths.has(entry.module)) {
    fail(
      `The page for "${entry.name}" imports from "${entry.importPath}", which @tecton/react does not export.`,
    );
  }
}
if (problems.length === 0) {
  ok(
    `${mainDocs.size} exported modules with a doc, all documented (${
      components.filter(entry => entry.isHook).length
    } of them hooks).`,
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Every page the generator claims exists                                   */
/* -------------------------------------------------------------------------- */

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

const expected = new Set(pages.map(page => page.url));
for (const entry of components) {
  const url = `/docs/components/${entry.name}`;
  if (!expected.has(url)) fail(`${entry.name} has no page at ${url}.`);
}
for (const template of templates) {
  const url = `/docs/templates/${template.slug}`;
  if (!expected.has(url)) {
    fail(`The template ${template.slug} has no page at ${url}.`);
  }
}
ok(`${pages.length} generated pages, all backed by an MDX file.`);

/* -------------------------------------------------------------------------- */
/* 3 & 4. Every example rendered once, from a file that exists                 */
/* -------------------------------------------------------------------------- */

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const renderedBy = new Map();
for (const file of walk(CONTENT)) {
  for (const match of read(file).matchAll(
    /<ExampleBlock\s+id=\{"([^"]+)"\}/g,
  )) {
    const where = path.relative(CONTENT, file);
    renderedBy.set(match[1], [...(renderedBy.get(match[1]) ?? []), where]);
  }
}

const loaders = read(path.join(GENERATED, 'exampleLoaders.ts'));
for (const example of examples) {
  const where = renderedBy.get(example.id) ?? [];
  if (where.length === 0) {
    fail(
      `The example "${example.id}" is in the registry but no page renders it.`,
    );
  } else if (where.length > 1) {
    fail(
      `The example "${example.id}" is rendered by ${where.length} pages (${where.join(', ')}); it belongs to exactly one.`,
    );
  }

  const source = path.join(
    EXAMPLES,
    'components',
    example.dir,
    `${example.id}.tsx`,
  );
  if (!fs.existsSync(source)) {
    fail(
      `The example "${example.id}" has no source at ${path.relative(REPO_ROOT, source)}.`,
    );
    continue;
  }
  if (!loaders.includes(`"${example.id}":`)) {
    fail(`The example "${example.id}" has no entry in exampleLoaders.ts.`);
  }
  if (!read(source).includes('@tecton/react')) {
    fail(`The example "${example.id}" imports nothing from '@tecton/react'.`);
  }
}
const known = new Set(examples.map(example => example.id));
for (const id of renderedBy.keys()) {
  if (!known.has(id)) {
    fail(`A page renders "${id}", which is not in the example registry.`);
  }
}
ok(`${examples.length} examples, each rendered by exactly one page.`);

const templateLoaders = read(path.join(GENERATED, 'templateLoaders.ts'));
for (const template of templates) {
  const source = path.join(EXAMPLES, 'pages', template.slug, 'page.tsx');
  if (!fs.existsSync(source)) {
    fail(
      `The template "${template.slug}" has no source at ${path.relative(REPO_ROOT, source)}.`,
    );
  }
  if (!templateLoaders.includes(`"${template.slug}":`)) {
    fail(`The template "${template.slug}" has no entry in templateLoaders.ts.`);
  }
}
ok(`${templates.length} page templates, each with a source and a loader.`);

/* -------------------------------------------------------------------------- */
/* 5. The sidebar                                                              */
/* -------------------------------------------------------------------------- */

const rootMeta = JSON.parse(read(path.join(CONTENT, 'meta.json')));
const rootPages = new Set(rootMeta.pages);
for (const guide of guides) {
  if (!rootPages.has(guide.name)) {
    fail(`The guide "${guide.name}" is not listed in content/docs/meta.json.`);
  }
}
for (const section of ['foundations', 'components', 'templates', 'changelog']) {
  if (!rootPages.has(section)) {
    fail(`The sidebar does not list the "${section}" section.`);
  }
}

/**
 * The component sidebar is grouped, so a page has to appear in exactly one
 * group (or as a flattened entry, or under Utilities). A page in none is a page
 * only search can find; a page in two is a page that looks like two things.
 */
const placed = new Map();
const place = (name, where) =>
  placed.set(name, [...(placed.get(name) ?? []), where]);
for (const item of sidebar.items) {
  if (item.type === 'entry') place(item.name, 'top level');
  else
    for (const entry of item.entries) place(entry.name, `group ${item.label}`);
}
for (const entry of sidebar.utilities) place(entry.name, 'Utilities');

for (const entry of components) {
  const where = placed.get(entry.name) ?? [];
  if (where.length === 0) {
    fail(`${entry.name} is missing from the component sidebar.`);
  } else if (where.length > 1) {
    fail(`${entry.name} is in the sidebar twice (${where.join(', ')}).`);
  }
}
for (const name of placed.keys()) {
  if (!documented.has(name)) {
    fail(`The sidebar lists "${name}", which has no page.`);
  }
}
ok(
  `${guides.length} guides in the sidebar, and ${components.length} component pages across ${
    sidebar.items.filter(item => item.type === 'group').length
  } groups, ${sidebar.items.filter(item => item.type === 'entry').length} single entries and ${
    sidebar.utilities.length
  } utilities.`,
);

/* -------------------------------------------------------------------------- */
/* 6. Every foundations page's sources are still there                         */
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
/* 7 & 8. The export: search index, and the upstream name                      */
/* -------------------------------------------------------------------------- */

/**
 * What a reader is allowed to meet of the library's own name.
 *
 * Three things keep it: the `@astryx.` message ids an i18n override has to be
 * keyed on exactly, the `data-astryx-*` attributes the theme is scoped to, and
 * the `astryx-*` class and layer names the components carry. All three are
 * things a consumer reads in DevTools or writes in a selector, so a renamed one
 * would be a lie. Anything else naming the library is a leak.
 */
const ALLOWED_UPSTREAM =
  /@astryx\.[A-Za-z0-9_.]+|data-astryx[a-z0-9-]*|astryx-[a-z0-9-]+/g;

function leaks(text) {
  const remaining = text.replace(ALLOWED_UPSTREAM, '');
  return /astryx/i.test(remaining);
}

const named = [];
for (const file of walk(CONTENT)) {
  if (leaks(read(file))) named.push(path.relative(REPO_ROOT, file));
}
if (named.length > 0) {
  fail(`These generated pages name the upstream library: ${named.join(', ')}.`);
} else {
  ok('No generated page names the upstream library.');
}

if (!fs.existsSync(EXPORT)) {
  ok(
    'No static export to check; run pnpm --filter @tecton/docs build for the rest.',
  );
} else {
  const index = path.join(EXPORT, 'api/search');
  if (!fs.existsSync(index)) {
    fail('The static export has no search index at dist/client/api/search.');
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

  // The rendered HTML is the artefact a reader actually gets, so the name check
  // runs against it too — the class names the components carry are allowed, the
  // package name is not.
  const htmlLeaks = [];
  const walkHtml = (dir, out = []) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkHtml(full, out);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
    return out;
  };
  for (const file of walkHtml(EXPORT)) {
    if (leaks(read(file))) htmlLeaks.push(path.relative(REPO_ROOT, file));
  }
  if (htmlLeaks.length > 0) {
    fail(
      `${htmlLeaks.length} exported page(s) name the upstream library, e.g. ${htmlLeaks
        .slice(0, 5)
        .join(', ')}.`,
    );
  } else {
    ok('No exported page names the upstream library.');
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
