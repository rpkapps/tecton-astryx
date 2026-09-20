#!/usr/bin/env node
/**
 * Wrapper generator.
 *
 * Most of Tecton's surface is a *pass-through*: a component the design has no
 * opinion about yet, published under a Tecton name, with Tecton-named types and
 * Tecton glyphs on its icon props, and nothing else changed. Writing a hundred
 * of those by hand would be a hundred chances to misspell a prop, and every
 * upstream upgrade would rot all of them at once. So they are generated from
 * one checked-in manifest — `packages/react/wrappers.manifest.json` — and the
 * output is committed, reviewed and checked.
 *
 * For every manifest entry that is not `handwritten`, this script writes:
 *
 *   src/components/<Name>/<Name>.tsx        the wrapper
 *   src/components/<Name>/<Name>.doc.mjs    its documentation, in Tecton's terms
 *   src/components/<Name>/<Name>.test.tsx   a smoke test
 *   src/components/<Name>/index.ts          its barrel
 *
 * and, from the whole manifest (hand-written entries included):
 *
 *   src/generated/componentExports.ts       the export block src/index.ts re-exports
 *   package.json#exports                    one typed subpath per component
 *
 * The documentation is *translated*, not copied: component names are renamed
 * through the manifest, prop descriptions are rewritten, and every mention of
 * the library Tecton is implemented on is removed. The props table is filtered
 * against the wrapper's real props type using the TypeScript compiler — the
 * same reading `scripts/check-docs-drift.mjs` does — so a prop the upstream
 * documentation describes but the type does not have never reaches a Tecton doc.
 *
 * `--check` regenerates everything in memory and fails on any difference. It
 * runs in the package build and in `pnpm check`, so an upstream upgrade that
 * moves a prop is a build failure with a diff, not a silently stale doc.
 *
 *   node scripts/generate-wrappers.mjs            # write
 *   node scripts/generate-wrappers.mjs --check    # fail on drift
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';

const PACKAGE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const SRC = path.join(PACKAGE, 'src');
const COMPONENTS = path.join(SRC, 'components');
const UPSTREAM_SRC = path.join(
  PACKAGE,
  'node_modules',
  '@astryxdesign',
  'core',
  'src',
);
const UPSTREAM_PACKAGE = '@astryxdesign/core';

const CHECK = process.argv.includes('--check');

const manifest = JSON.parse(
  fs.readFileSync(path.join(PACKAGE, 'wrappers.manifest.json'), 'utf8'),
);
const components = manifest.components;
const generated = components.filter(entry => !entry.handwritten);

/** Upstream component name → Tecton name, for rewriting prose and types. */
const RENAMES = new Map();
for (const entry of components) {
  if (!entry.upstream?.export) continue;
  if (!RENAMES.has(entry.upstream.export)) {
    RENAMES.set(entry.upstream.export, entry.name);
  }
}
/** Names the manifest cannot carry because Tecton folds them into a sibling. */
for (const [from, to] of Object.entries(manifest.aliases ?? {})) {
  RENAMES.set(from, to);
}

/** Type names that travel with a renamed component. */
const TYPE_RENAMES = new Map();
for (const [from, to] of RENAMES) {
  if (from === to) continue;
  for (const suffix of [
    'Props',
    'Size',
    'Variant',
    'VariantMap',
    'Status',
    'StatusType',
    'Density',
    'Option',
    'OptionData',
    'Section',
    'Divider',
    'Presentation',
    'ItemData',
    'Handle',
    'Layout',
    'Pattern',
    'Overflow',
    'Shape',
    'Align',
    'Alignment',
    'Columns',
    'Color',
    'ColorMap',
    'Mode',
    'Type',
    'TypeMap',
    'Level',
    'Format',
  ]) {
    TYPE_RENAMES.set(`${from}${suffix}`, `${to}${suffix}`);
  }
}

/* ---------------------------------------------------------------- prose ---- */

const UPSTREAM_WORDS = /astryx/i;

/**
 * Rewrite a string of documentation into Tecton's vocabulary.
 *
 * Component names are renamed longest-first so `DropdownMenuCheckboxItem` is
 * not half-renamed by the rule for `DropdownMenu`, and any surviving mention of
 * the upstream system is removed rather than translated.
 */
const RENAME_ORDER = [...RENAMES.entries(), ...TYPE_RENAMES.entries()]
  .filter(([from, to]) => from !== to)
  .sort((a, b) => b[0].length - a[0].length);

function tectonProse(text) {
  if (typeof text !== 'string') return text;
  let out = text;
  for (const [from, to] of RENAME_ORDER) {
    out = out.replace(
      new RegExp(`(?<![A-Za-z0-9_])${from}(?![A-Za-z0-9_])`, 'g'),
      to,
    );
  }
  // A sentence that names the upstream system is dropped whole rather than
  // half-translated: it is always about a CLI or a class name a Tecton
  // consumer has no way to reach.
  if (UPSTREAM_WORDS.test(out)) {
    const kept = out
      .split(/(?<=[.!?])\s+/)
      .filter(sentence => !/astryx/i.test(sentence));
    out = kept.join(' ').trim();
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Deep-rewrite every string in a plain JSON-ish value. */
function tectonValue(value) {
  if (typeof value === 'string') return tectonProse(value);
  if (Array.isArray(value)) return value.map(tectonValue);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, inner] of Object.entries(value))
      out[key] = tectonValue(inner);
    return out;
  }
  return value;
}

/* ------------------------------------------------------------- upstream ---- */

/** The upstream documentation for an entry, or `undefined`. */
async function upstreamDoc(entry) {
  const relative = entry.upstream?.doc;
  if (!relative) return undefined;
  const file = path.join(UPSTREAM_SRC, relative);
  if (!fs.existsSync(file)) return undefined;
  const module = await import(pathToFileURL(file).href);
  return module.docs ?? module.default;
}

/** The one-line description an upstream doc carries, wherever it keeps it. */
function upstreamDescription(doc) {
  return doc?.usage?.description ?? doc?.description ?? undefined;
}

/**
 * How a prop wants a glyph, or `undefined` if it does not take one.
 *
 * Upstream has two icon-shaped slots: one that takes a rendered node and one
 * that takes a glyph *component* by name. Tecton's prop takes a
 * `TectonIconRef` either way; which helper resolves it is what differs.
 */
function iconSlotKind(prop) {
  if (!/(^|[a-z])[Ii]con$|^icon[A-Z]|Icon$/.test(prop.name)) return undefined;
  const type = String(prop.type ?? '');
  if (/=>/.test(type)) return undefined;
  if (/\bIconType\b|\bIconName\b|\bExtendedIconName\b/.test(type))
    return 'resolve';
  if (/ReactNode|ReactElement/.test(type)) return 'render';
  return undefined;
}

/* ------------------------------------------------------------ emitters ---- */

const BANNER = `/**
 * @generated by packages/react/scripts/generate-wrappers.mjs — do not edit.
 * Regenerate with \`pnpm --filter @tecton/react generate:wrappers\`.
 */`;

function wrapperSource(entry, doc) {
  const {name} = entry;
  const {module, export: exported} = entry.upstream;
  const base = `Base${name}`;
  const skip = new Set(entry.skipIconProps ?? []);
  const iconProps = (doc?.props ?? [])
    .map(prop => [prop.name, iconSlotKind(prop)])
    .filter(([propName, kind]) => kind && !skip.has(propName))
    .sort((a, b) => a[0].localeCompare(b[0]));

  const description = upstreamDescription(doc)
    ? tectonProse(upstreamDescription(doc))
    : `${name} is published as part of the Tecton surface.`;

  const lines = [];
  lines.push('/**');
  lines.push(` * Tecton ${name}.`);
  lines.push(' *');
  for (const line of wrapText(description, 74)) lines.push(` * ${line}`);
  lines.push(' *');
  lines.push(
    ' * @generated by packages/react/scripts/generate-wrappers.mjs — do not edit.',
  );
  lines.push(' */');

  const reactTypes = ['ComponentProps'];
  lines.push(`import type {${reactTypes.join(', ')}} from 'react';`);
  lines.push(
    `import {${exported === name ? `${exported} as ${base}` : `${exported} as ${base}`}} from '${UPSTREAM_PACKAGE}/${module}';`,
  );
  if (iconProps.length > 0) {
    const helpers = [
      ...new Set(
        iconProps.map(([, kind]) =>
          kind === 'resolve' ? 'tectonIconValue' : 'tectonIconNode',
        ),
      ),
    ].sort();
    lines.push(
      `import {${helpers.join(', ')}, type TectonIconRef} from '../../icons/renderIcon.js';`,
    );
  }
  lines.push('');
  lines.push(`type ${name}BaseProps = ComponentProps<typeof ${base}>;`);
  lines.push('');

  if (iconProps.length === 0) {
    lines.push(`/** Props for {@link ${name}}. */`);
    lines.push(`export type ${name}Props = ${name}BaseProps;`);
    lines.push('');
    lines.push(`export function ${name}(props: ${name}Props) {`);
    lines.push(`  return <${base} {...props} />;`);
    lines.push('}');
  } else {
    const omitted = iconProps.map(([p]) => `'${p}'`).join(' | ');
    lines.push(`/** Props for {@link ${name}}. */`);
    lines.push(
      `export interface ${name}Props extends Omit<${name}BaseProps, ${omitted}> {`,
    );
    for (const [prop] of iconProps) {
      const described = (doc?.props ?? []).find(p => p.name === prop);
      lines.push('  /**');
      for (const line of wrapText(
        described?.description
          ? `${tectonProse(described.description)} Takes a Tecton glyph name or an SVG component.`
          : 'Glyph, by name or as an SVG component.',
        70,
      )) {
        lines.push(`   * ${line}`);
      }
      lines.push('   */');
      lines.push(`  ${prop}?: TectonIconRef | ${name}BaseProps['${prop}'];`);
    }
    lines.push('}');
    lines.push('');
    lines.push(
      `export function ${name}({${iconProps.map(([p]) => p).join(', ')}, ...rest}: ${name}Props) {`,
    );
    lines.push('  return (');
    lines.push(`    <${base}`);
    lines.push(`      {...(rest as ${name}BaseProps)}`);
    for (const [prop, kind] of iconProps) {
      const helper = kind === 'resolve' ? 'tectonIconValue' : 'tectonIconNode';
      lines.push(
        `      ${prop}={${helper}(${prop}) as ${name}BaseProps['${prop}']}`,
      );
    }
    lines.push('    />');
    lines.push('  );');
    lines.push('}');
  }
  lines.push('');
  lines.push(`${name}.displayName = '${name}';`);
  lines.push('');
  return lines.join('\n');
}

function wrapText(text, width) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const out = [];
  let line = '';
  for (const word of words) {
    if (line && line.length + word.length + 1 > width) {
      out.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) out.push(line);
  return out.length > 0 ? out : [''];
}

function indexSource(entry) {
  const {name} = entry;
  return [
    BANNER,
    `export {${name}} from './${name}.js';`,
    `export type {${name}Props} from './${name}.js';`,
    '',
  ].join('\n');
}

function testSource(entry) {
  const {name} = entry;
  return `${BANNER}
import {describe, expect, it} from 'vitest';
import {${name}} from './${name}.js';

describe('${name}', () => {
  it('is a component', () => {
    expect(typeof ${name}).toBe('function');
  });

  it('names itself for the React tree', () => {
    expect(${name}.displayName).toBe('${name}');
  });
});
`;
}

/** The examples that live beside a component, in the order the docs list them. */
function examplesOf(name) {
  const dir = path.join(COMPONENTS, name, 'examples');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => file.replace(/\.tsx$/, ''))
    .sort();
}

function literal(value, indent) {
  return JSON.stringify(value, null, 2).split('\n').join(`\n${indent}`);
}

function docSource(entry, upstream, propNames) {
  const {name, category} = entry;
  const usage = upstream?.usage ?? {};
  const props = (upstream?.props ?? [])
    .filter(prop => propNames.has(prop.name))
    .map(prop => {
      // A description can come back empty when every sentence in it named the
      // upstream system; the prop still has to say something.
      const described = tectonProse(prop.description ?? '');
      const out = {
        name: prop.name,
        type: tectonProse(String(prop.type ?? 'unknown')),
        description:
          described || `${prop.name} is passed through to ${name} unchanged.`,
      };
      if (prop.required) out.required = true;
      if (prop.default !== undefined)
        out.default = tectonProse(String(prop.default));
      return out;
    });

  const doc = {
    name,
    displayName: name,
    group:
      entry.group ??
      (upstream?.subComponentOf
        ? (RENAMES.get(upstream.subComponentOf) ?? upstream.subComponentOf)
        : name),
    category,
    keywords: (upstream?.keywords ?? [name.toLowerCase()])
      .map(word => tectonProse(String(word)))
      .filter(word => !UPSTREAM_WORDS.test(word)),
    usage: {
      description:
        tectonProse(upstreamDescription(upstream) ?? '') ||
        `${name} is published as part of the Tecton surface.`,
      ...(usage.bestPractices
        ? {bestPractices: tectonValue(usage.bestPractices)}
        : {}),
      ...(usage.accessibility
        ? {accessibility: tectonProse(usage.accessibility)}
        : {}),
      ...(usage.anatomy ? {anatomy: tectonValue(usage.anatomy)} : {}),
    },
    props,
    examples: examplesOf(name),
    notes: [
      'Generated wrapper: Tecton publishes this component with its behaviour unchanged, under Tecton names and with Tecton glyphs on its icon props.',
      ...(entry.notes ?? []).map(tectonProse),
    ],
  };

  return `${BANNER}
/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = ${literal(doc, '')};
`;
}

/* ---------------------------------------------------- the export surface ---- */

function exportBlockSource() {
  const byCategory = new Map();
  for (const entry of generated) {
    if (!byCategory.has(entry.category)) byCategory.set(entry.category, []);
    byCategory.get(entry.category).push(entry);
  }
  const lines = [
    BANNER,
    '/**',
    ' * The generated half of the Tecton component surface.',
    ' *',
    ' * `src/index.ts` re-exports this module, so `@tecton/react` hands a',
    ' * consumer one flat surface whether a component was designed by hand or',
    ' * published as a pass-through. Each component also has its own subpath in',
    ' * `package.json#exports`.',
    ' */',
    '',
  ];
  for (const category of [...byCategory.keys()].sort()) {
    const rule = '-'.repeat(Math.max(1, 68 - category.length));
    lines.push(`/* ${category} ${rule} */`);
    lines.push('');
    for (const entry of byCategory
      .get(category)
      .sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(
        `export {${entry.name}} from '../components/${entry.name}/index.js';`,
      );
      lines.push(
        `export type {${entry.name}Props} from '../components/${entry.name}/index.js';`,
      );
    }
    lines.push('');
  }
  return lines.join('\n');
}

function exportsMap(existing) {
  const head = {};
  for (const [key, value] of Object.entries(existing)) {
    if (
      key === '.' ||
      key.endsWith('.css') ||
      key === './theme' ||
      key === './icons'
    ) {
      head[key] = value;
    }
  }
  const out = {...head};
  for (const entry of [...components].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    out[`./${entry.name}`] = {
      types: `./dist/components/${entry.name}/index.d.ts`,
      default: `./dist/components/${entry.name}/index.js`,
    };
  }
  out['./support'] = {
    types: './dist/support/index.d.ts',
    default: './dist/support/index.js',
  };
  out['./templates'] = {
    types: './dist/templates/index.d.ts',
    default: './dist/templates/index.js',
  };
  out['./package.json'] = './package.json';
  return out;
}

/**
 * The upstream-to-Tecton table in `docs/engineering/component-mapping.md`.
 *
 * Generated so it cannot drift from the manifest it describes: one row per
 * Tecton component, what it is built on, whether it is designed or generated,
 * and how many examples it carries.
 */
function surfaceTable() {
  const rows = [...components].sort((a, b) => a.name.localeCompare(b.name));
  const lines = [
    `${rows.length} Tecton components. "Designed" means hand-written; "generated"`,
    'means emitted from the manifest and published with its behaviour unchanged.',
    '',
    '| Tecton | Built on | Kind | Category | Examples |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const entry of rows) {
    const upstream = entry.upstream?.export
      ? `\`${entry.upstream.export}\` (\`${entry.upstream.module}\`)`
      : '— (Tecton only)';
    lines.push(
      `| \`${entry.name}\` | ${upstream} | ${entry.handwritten ? 'designed' : 'generated'} | ${entry.category} | ${examplesOf(entry.name).length} |`,
    );
  }
  return lines.join('\n');
}

/* ------------------------------------------------------------- the run ---- */

/**
 * Everything is written through Prettier with the repository's own
 * configuration, so `--check` compares generated output against generated
 * output rather than against whatever `pnpm format` did to it afterwards.
 */
const prettierConfig = await prettier.resolveConfig(path.join(SRC, 'index.ts'));
async function formatted(file, contents) {
  const info = await prettier.getFileInfo(file);
  if (!info.inferredParser) return contents;
  return prettier.format(contents, {
    ...prettierConfig,
    parser: info.inferredParser,
  });
}

/** Files the run wants on disk, path → contents. */
const wanted = new Map();

for (const entry of generated) {
  const doc = await upstreamDoc(entry);
  const dir = path.join(COMPONENTS, entry.name);
  const wrapper = path.join(dir, `${entry.name}.tsx`);
  wanted.set(wrapper, await formatted(wrapper, wrapperSource(entry, doc)));
  const barrel = path.join(dir, 'index.ts');
  wanted.set(barrel, await formatted(barrel, indexSource(entry)));
  const test = path.join(dir, `${entry.name}.test.tsx`);
  wanted.set(test, await formatted(test, testSource(entry)));
}

// Pass 1: the wrappers have to exist before the compiler can read their props.
const pending = [];
for (const [file, contents] of wanted) {
  const current = fs.existsSync(file)
    ? fs.readFileSync(file, 'utf8')
    : undefined;
  if (current !== contents) pending.push([file, contents]);
}
if (!CHECK) {
  for (const [file, contents] of pending) {
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, contents);
  }
}

/** Every prop name on each generated component's props type. */
function readPropNames() {
  const configPath = path.join(PACKAGE, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, PACKAGE);
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const checker = program.getTypeChecker();
  const out = new Map();
  for (const entry of generated) {
    const file = path.join(COMPONENTS, entry.name, `${entry.name}.tsx`);
    const source = program.getSourceFile(file);
    const names = new Set();
    if (source) {
      const moduleSymbol = checker.getSymbolAtLocation(source);
      const exported = moduleSymbol
        ? checker.getExportsOfModule(moduleSymbol)
        : [];
      const symbol = exported.find(s => s.getName() === `${entry.name}Props`);
      const declaration = symbol?.declarations?.[0];
      if (declaration) {
        const type = checker.getTypeAtLocation(declaration);
        for (const property of checker.getPropertiesOfType(type)) {
          names.add(property.getName());
        }
      }
    }
    out.set(entry.name, names);
  }
  return out;
}

const propNames = readPropNames();

for (const entry of generated) {
  const doc = await upstreamDoc(entry);
  const file = path.join(COMPONENTS, entry.name, `${entry.name}.doc.mjs`);
  wanted.set(
    file,
    await formatted(
      file,
      docSource(entry, doc, propNames.get(entry.name) ?? new Set()),
    ),
  );
}

const mappingDoc = path.join(
  PACKAGE,
  '..',
  '..',
  'docs',
  'engineering',
  'component-mapping.md',
);
if (fs.existsSync(mappingDoc)) {
  const source = fs.readFileSync(mappingDoc, 'utf8');
  const open = '<!-- generated:surface-table -->';
  const close = '<!-- /generated:surface-table -->';
  const from = source.indexOf(open);
  const to = source.indexOf(close);
  if (from !== -1 && to !== -1) {
    const next =
      source.slice(0, from + open.length) +
      '\n\n' +
      surfaceTable() +
      '\n' +
      source.slice(to);
    wanted.set(mappingDoc, await formatted(mappingDoc, next));
  }
}

const exportsFile = path.join(SRC, 'generated', 'componentExports.ts');
wanted.set(exportsFile, await formatted(exportsFile, exportBlockSource()));

const pkgPath = path.join(PACKAGE, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.exports = exportsMap(pkg.exports);
wanted.set(
  pkgPath,
  await formatted(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`),
);

const drift = [];
for (const [file, contents] of wanted) {
  const current = fs.existsSync(file)
    ? fs.readFileSync(file, 'utf8')
    : undefined;
  if (current === contents) continue;
  drift.push(path.relative(PACKAGE, file));
  if (!CHECK) {
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, contents);
  }
}

// A component directory the manifest no longer names is a leftover. One this
// script wrote is removed; one somebody wrote by hand is reported, because
// deleting hand-written work on a rename is not this script's call.
const known = new Set(components.map(entry => entry.name));
for (const dir of fs.readdirSync(COMPONENTS)) {
  if (known.has(dir)) continue;
  const wrapper = path.join(COMPONENTS, dir, `${dir}.tsx`);
  const isGenerated =
    fs.existsSync(wrapper) &&
    fs
      .readFileSync(wrapper, 'utf8')
      .includes('@generated by packages/react/scripts/generate-wrappers.mjs');
  drift.push(
    `components/${dir} is not in the manifest${isGenerated ? ' (removed)' : ''}`,
  );
  if (isGenerated && !CHECK) {
    fs.rmSync(path.join(COMPONENTS, dir), {recursive: true, force: true});
  }
}

if (CHECK) {
  if (drift.length > 0) {
    console.error('\nWrapper generation check FAILED — these have drifted:\n');
    for (const file of drift) console.error(`  - ${file}`);
    console.error(
      '\nRun `pnpm --filter @tecton/react generate:wrappers` and commit the result.',
    );
    process.exit(1);
  }
  console.log(
    `Wrapper generation check passed: ${generated.length} generated wrappers, ${components.length} components in the manifest.`,
  );
} else {
  console.log(
    `Generated ${generated.length} wrappers (${components.length} components in the manifest); ${drift.length} files written.`,
  );
}
