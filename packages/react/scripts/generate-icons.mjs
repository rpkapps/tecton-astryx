#!/usr/bin/env node
/**
 * Tecton icon generator.
 *
 * Reads the delivered glyph sources in `design/icons/tecton/*.ts` — the design
 * source of truth — and writes:
 *
 *   src/icons/generated/<name>.tsx   one React component per glyph
 *   src/icons/generated/index.ts     the barrel `@tecton/react/icons` re-exports
 *   src/icons/names.ts               the union of the delivered glyph names
 *   src/icons/registry.ts            name → component, for `<Icon name=… />`
 *   src/theme/icons.ts               the semantic registry the theme carries
 *
 * The sources are evaluated, not pattern-matched: their import of the (never
 * delivered) `defineTectonSvgIcon` helper is rewritten to
 * `scripts/icon-definition-shim.mjs` and the module is imported, so a change to
 * a glyph's shape is picked up exactly as the designer wrote it.
 *
 * Figma leaves two kinds of artefact in the export, both stripped here:
 *
 *   - `<clipPath>`/`<defs>` wrappers whose clip is the full 16×16 view box, and
 *     the `data-figma-*` attributes that carry Figma's own paint description;
 *   - for `strata` (the one `colored: true` glyph) a `<foreignObject>` holding
 *     an HTML `conic-gradient`, which is not SVG and does not render. Its top
 *     face is re-drawn with a real SVG `<linearGradient>` approximating the
 *     three stops (purple → red → orange); every other part of the glyph, and
 *     every other glyph, paints in `currentColor`.
 *
 * Output is formatted with the repository's Prettier configuration before it is
 * written or compared, so `pnpm format` and this generator never disagree about
 * a generated file.
 *
 * Run `node scripts/generate-icons.mjs` to write, `--check` to fail on drift.
 * The package build and `pnpm check` both run the check.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import prettier from 'prettier';

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '..', '..');
const SOURCE_DIR = path.join(REPO_ROOT, 'design', 'icons', 'tecton');
const ICONS_DIR = path.join(PACKAGE_ROOT, 'src', 'icons');
const GENERATED_DIR = path.join(ICONS_DIR, 'generated');
const THEME_ICONS = path.join(PACKAGE_ROOT, 'src', 'theme', 'icons.ts');
const SHIM = pathToFileURL(
  path.join(PACKAGE_ROOT, 'scripts', 'icon-definition-shim.mjs'),
).href;

const CHECK = process.argv.includes('--check');

/**
 * Astryx asks the active theme for a glyph by semantic name. These are the
 * names a Tecton glyph answers; everything else falls through to the default
 * set (`src/theme/icons.ts` names them at the top of the file).
 */
const SEMANTIC_ICONS = {
  close: 'close',
  check: 'check',
  chevronDown: 'chevron-down',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  success: 'check-circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
  search: 'search',
  menu: 'menu',
  moreHorizontal: 'more-vert',
  copy: 'copy',
  arrowUp: 'arrow-up',
  arrowDown: 'arrow-down',
  arrowsUpDown: 'caret-up-down',
  funnel: 'filter',
  eyeSlash: 'visibility-off',
  externalLink: 'open-in-new',
  viewColumns: 'view-column',
  wrench: 'settings',
  microphone: 'microphone',
};

/** Semantic names deliberately left on the default set — no Tecton glyph. */
const SEMANTIC_FALLTHROUGH = [
  'chevronsLeft',
  'chevronsRight',
  'calendar',
  'clock',
  'checkDouble',
  'stop',
];

/** The three stops Figma's conic gradient names, as SVG colours. */
const STRATA_STOPS = [
  {offset: '0', color: '#9957BE'},
  {offset: '0.5', color: '#C8102E'},
  {offset: '1', color: '#F68F1F'},
];

// --- reading the delivered sources ------------------------------------------

/** Evaluate one delivered glyph module and return its definition. */
async function readDefinition(file) {
  const source = await fsp.readFile(file, 'utf8');
  const rewritten = source.replace(
    /(from\s+)(['"])[^'"]*icon-definition\2/,
    (_match, from) => `${from}${JSON.stringify(SHIM)}`,
  );
  if (rewritten === source) {
    throw new Error(`${file} does not import the icon definition helper.`);
  }
  const url = `data:text/javascript;base64,${Buffer.from(rewritten).toString('base64')}`;
  const module = await import(url);
  const definition = Object.values(module)[0];
  if (!definition?.name || !definition.outline || !definition.filled) {
    throw new Error(`${file} did not export a complete glyph definition.`);
  }
  return definition;
}

// --- markup → JSX ------------------------------------------------------------

const TAG =
  /<(\/?)([a-zA-Z][\w-]*)((?:\s+[a-zA-Z_:][\w:.-]*\s*=\s*"[^"]*")*)\s*(\/?)>/g;
const ATTRIBUTE = /([a-zA-Z_:][\w:.-]*)\s*=\s*"([^"]*)"/g;

/** Tags Figma emits that carry no drawing: dropped with their subtrees. */
const DROPPED_TAGS = new Set(['foreignObject', 'div', 'defs', 'clipPath']);

/** React spells SVG presentation attributes in camelCase. */
function reactAttributeName(name) {
  if (name.startsWith('data-') || name.startsWith('aria-')) return name;
  return name.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
}

/**
 * Parse Figma's SVG markup into a node tree, dropping the Figma-only parts:
 * the `data-figma-*` attributes, the clip wrappers and the `<foreignObject>`
 * gradient hack. `<g>` elements left holding nothing are dropped with them.
 */
function parseMarkup(markup, file) {
  const root = {tag: null, attributes: {}, children: []};
  const stack = [root];
  let cursor = 0;
  let skipDepth = 0;

  for (const match of markup.matchAll(TAG)) {
    if (match.index > cursor) {
      const text = markup.slice(cursor, match.index).trim();
      if (text) throw new Error(`${file}: unexpected text in glyph markup.`);
    }
    cursor = match.index + match[0].length;
    const [, closing, tag, rawAttributes, selfClosing] = match;

    if (skipDepth > 0) {
      if (closing) skipDepth -= 1;
      else if (!selfClosing) skipDepth += 1;
      continue;
    }
    if (closing) {
      stack.pop();
      continue;
    }
    if (DROPPED_TAGS.has(tag)) {
      if (!selfClosing) skipDepth = 1;
      continue;
    }

    const attributes = {};
    for (const attribute of rawAttributes.matchAll(ATTRIBUTE)) {
      const [, name, value] = attribute;
      if (name.startsWith('data-figma')) continue;
      attributes[reactAttributeName(name)] = value;
    }
    // A clip that is the whole view box adds nothing once the wrapper is gone.
    delete attributes.clipPath;

    const node = {tag, attributes, children: []};
    stack.at(-1).children.push(node);
    if (!selfClosing) stack.push(node);
  }

  if (stack.length !== 1) throw new Error(`${file}: unbalanced glyph markup.`);
  return prune(root.children);
}

/** Drop wrapper elements that ended up empty, and unwrap bare groups. */
function prune(nodes) {
  const kept = [];
  for (const node of nodes) {
    const children = prune(node.children);
    if (node.tag === 'g') {
      if (Object.keys(node.attributes).length === 0) {
        kept.push(...children);
        continue;
      }
      if (children.length === 0) continue;
    }
    kept.push({...node, children});
  }
  return kept;
}

/** Serialise a parsed node tree as JSX source. */
function toJsx(nodes, indent) {
  const pad = ' '.repeat(indent);
  return nodes
    .map(node => {
      const attributes = Object.entries(node.attributes)
        .map(([name, value]) => ` ${name}=${JSON.stringify(value)}`)
        .join('');
      if (node.children.length === 0) {
        return `${pad}<${node.tag}${attributes} />`;
      }
      return [
        `${pad}<${node.tag}${attributes}>`,
        toJsx(node.children, indent + 2),
        `${pad}</${node.tag}>`,
      ].join('\n');
    })
    .join('\n');
}

// --- code generation ---------------------------------------------------------

function pascalCase(name) {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const BANNER = (source, extra = '') =>
  `/**
 * @generated by packages/react/scripts/generate-icons.mjs — do not edit.
 * Source: ${source}${extra}
 */`;

function renderGlyphComponent(definition) {
  const componentName = `${pascalCase(definition.name)}Icon`;
  const source = `design/icons/tecton/${definition.name}.ts`;
  const colored = definition.colored === true;

  const branch = variant => {
    const nodes = parseMarkup(definition[variant], source);
    if (colored) return toJsx(coloredNodes(nodes), 10);
    return toJsx(nodes, 10);
  };

  const body = `      {variant === 'filled' ? (
        <>
${branch('filled')}
        </>
      ) : (
        <>
${branch('outline')}
        </>
      )}`;

  const gradient = colored
    ? `      <defs>
        <linearGradient
          id={gradientId}
          x1="1"
          y1="1"
          x2="15.65"
          y2="8.83333"
          gradientUnits="userSpaceOnUse"
        >
${STRATA_STOPS.map(
  stop =>
    `          <stop offset="${stop.offset}" stopColor="${stop.color}" />`,
).join('\n')}
        </linearGradient>
      </defs>
`
    : '';

  const imports = colored
    ? `import {useId} from 'react';\nimport type {TectonIconGlyphProps} from '../glyph.js';`
    : `import type {TectonIconGlyphProps} from '../glyph.js';`;

  const gradientId = colored
    ? `  const gradientId = \`tecton-strata-\${useId().replace(/[^a-zA-Z0-9_-]/g, '')}\`;\n\n`
    : '';

  const note = colored
    ? `\n *\n * Figma painted the top face with an HTML conic gradient smuggled into the
 * SVG through a foreign-object wrapper, which no SVG renderer draws. It is
 * re-drawn here with a real SVG linear gradient across the same three stops;
 * the rest of the glyph takes currentColor like every other Tecton icon.`
    : '';

  return `${BANNER(source, note)}
${imports}

export function ${componentName}({
  variant = 'outline',
  ...props
}: TectonIconGlyphProps) {
${gradientId}  return (
    <svg
      viewBox=${JSON.stringify(definition.viewBox)}
      width="1em"
      height="1em"
      fill="currentColor"
      focusable="false"
      aria-hidden="true"
      {...props}
    >
${gradient}${body}
    </svg>
  );
}

${componentName}.displayName = '${componentName}';
${componentName}.glyphName = '${definition.name}';
`;
}

/**
 * Paint `strata`'s top face from the gradient. Figma emits the face twice —
 * once flat, once carrying the gradient description — so the duplicate is
 * dropped and the remaining face given the real paint server.
 */
function coloredNodes(nodes) {
  const faces = nodes.filter(node => node.tag === 'path');
  // Figma emits the gradient face twice, once flat and once carrying its own
  // paint description, and rounds the two copies differently. Compare shapes
  // at three decimals so the duplicate is recognised.
  const shape = d => d.replace(/-?\d*\.?\d+/g, n => Number(n).toFixed(3));
  const seen = new Set();
  const unique = [];
  for (const node of faces) {
    const key = shape(node.attributes.d);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(node);
  }
  return unique.map((node, index) =>
    index === unique.length - 1
      ? {...node, attributes: {...node.attributes, fill: '{gradientFill}'}}
      : node,
  );
}

// --- files -------------------------------------------------------------------

function renderNames(names) {
  return `${BANNER('design/icons/tecton/*.ts')}

/** Every glyph in the Tecton icon set, named as the design delivers it. */
export const tectonIconNames = [
${names.map(name => `  '${name}',`).join('\n')}
] as const;

/** The name of a Tecton glyph — the \`name\` an {@link Icon} renders. */
export type TectonIconName = (typeof tectonIconNames)[number];
`;
}

function renderRegistry(names) {
  return `${BANNER('design/icons/tecton/*.ts')}
import type {TectonIconGlyph} from './glyph.js';
import type {TectonIconName} from './names.js';
${names
  .map(
    name => `import {${pascalCase(name)}Icon} from './generated/${name}.js';`,
  )
  .join('\n')}

/**
 * Every Tecton glyph, by name. {@link Icon} looks a glyph up here; application
 * code that already knows which glyph it wants should import the component.
 */
export const tectonIconRegistry: Record<TectonIconName, TectonIconGlyph> = {
${names.map(name => `  '${name}': ${pascalCase(name)}Icon,`).join('\n')}
};
`;
}

function renderGeneratedIndex(names) {
  return `${BANNER('design/icons/tecton/*.ts')}
${names
  .map(name => `export {${pascalCase(name)}Icon} from './${name}.js';`)
  .join('\n')}
`;
}

/**
 * The semantic registry the theme carries.
 *
 * It has to stay a plain `.ts` module with no relative imports and no JSX: the
 * theme compiler loads it through a synchronous loader (see the repository
 * README). The glyph markup for the handful of semantic names is therefore
 * inlined here rather than imported from the generated components.
 */
function renderThemeIcons(definitions) {
  const byName = new Map(definitions.map(d => [d.name, d]));
  const entries = Object.entries(SEMANTIC_ICONS).map(([semantic, glyph]) => {
    const definition = byName.get(glyph);
    if (!definition) {
      throw new Error(`No Tecton glyph named "${glyph}" for "${semantic}".`);
    }
    const nodes = parseMarkup(definition.outline, `${glyph}.ts`);
    const paths = nodes.map(node => node.attributes.d).filter(Boolean);
    if (paths.length !== nodes.length) {
      throw new Error(`Glyph "${glyph}" is not a plain set of paths.`);
    }
    return {semantic, glyph, paths};
  });

  return `${BANNER('design/icons/tecton/*.ts')}
/**
 * Tecton icon registry.
 *
 * Components ask the active theme for a glyph by semantic role; this is the set
 * of roles a Tecton glyph answers to. Roles with no Tecton equivalent —
 * ${SEMANTIC_FALLTHROUGH.join(', ')} — are left out on
 * purpose and fall through to the default set.
 *
 * Two constraints shape the code, both from the theme compiler, which loads
 * this module through a synchronous loader:
 *
 * - **No JSX**, so the glyphs are built with \`createElement\`.
 * - **No relative imports**, so the path data is inlined rather than imported
 *   from \`src/icons/generated/\`. The generator writes both from the one
 *   source, and \`--check\` fails the build if they drift apart.
 */
import {createElement, type ReactNode} from 'react';

/** The semantic roles a Tecton glyph answers to. */
export type TectonSemanticIconName =
${entries.map(entry => `  | '${entry.semantic}'`).join('\n')};

/**
 * Semantic icon names Tecton components resolve through the active theme.
 *
 * Tecton declares the roles it draws itself; a role that is left out keeps the
 * glyph the component libraries's own default set provides.
 */
export type TectonIconRegistry = Partial<
  Record<TectonSemanticIconName, ReactNode>
>;

/** Tecton glyphs are filled shapes on a 16×16 box, drawn in \`currentColor\`. */
const svgProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 16 16',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
} as const;

/** One Tecton glyph from its path data. */
function glyph(...paths: readonly string[]): ReactNode {
  return createElement(
    'svg',
    svgProps,
    ...paths.map((d, index) => createElement('path', {d, key: index})),
  );
}

/** The icon set Tecton ships with its theme. */
export const tectonIcons: TectonIconRegistry = {
${entries
  .map(
    entry =>
      `  // ${entry.glyph}\n  ${entry.semantic}: glyph(\n${entry.paths
        .map(d => `    ${JSON.stringify(d)},`)
        .join('\n')}\n  ),`,
  )
  .join('\n')}
};
`;
}

// --- run ---------------------------------------------------------------------

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter(name => name.endsWith('.ts'))
  .sort();

const definitions = [];
for (const file of files) {
  definitions.push(await readDefinition(path.join(SOURCE_DIR, file)));
}
definitions.sort((a, b) => a.name.localeCompare(b.name));
const names = definitions.map(definition => definition.name);

/** @type {Map<string, string>} absolute path → contents */
const outputs = new Map();
for (const definition of definitions) {
  outputs.set(
    path.join(GENERATED_DIR, `${definition.name}.tsx`),
    // The gradient fill is an expression, not a string literal.
    renderGlyphComponent(definition).replaceAll(
      'fill="{gradientFill}"',
      'fill={`url(#${gradientId})`}',
    ),
  );
}
outputs.set(path.join(GENERATED_DIR, 'index.ts'), renderGeneratedIndex(names));
outputs.set(path.join(ICONS_DIR, 'names.ts'), renderNames(names));
outputs.set(path.join(ICONS_DIR, 'registry.ts'), renderRegistry(names));
outputs.set(THEME_ICONS, renderThemeIcons(definitions));

/** Format a generated file exactly as `pnpm format` would. */
async function format(file, contents) {
  const config = await prettier.resolveConfig(file);
  return prettier.format(contents, {
    ...config,
    filepath: file,
  });
}

for (const [file, contents] of outputs) {
  outputs.set(file, await format(file, contents));
}

if (CHECK) {
  const drifted = [];
  const stale = fs.existsSync(GENERATED_DIR)
    ? fs
        .readdirSync(GENERATED_DIR)
        .map(name => path.join(GENERATED_DIR, name))
        .filter(file => !outputs.has(file))
    : [];
  for (const [file, contents] of outputs) {
    if (
      !fs.existsSync(file) ||
      fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') !== contents
    ) {
      drifted.push(path.relative(REPO_ROOT, file));
    }
  }
  for (const file of stale)
    drifted.push(`${path.relative(REPO_ROOT, file)} (stale)`);
  if (drifted.length > 0) {
    console.error(
      `\nIcon drift: ${drifted.length} file(s) differ from design/icons/tecton/.\n`,
    );
    for (const file of drifted) console.error(`  - ${file}`);
    console.error(
      '\nRun `pnpm --filter @tecton/react generate:icons` and commit the result.\n',
    );
    process.exit(1);
  }
  console.log(
    `Icons in sync: ${names.length} glyphs, ${outputs.size} generated files.`,
  );
} else {
  await fsp.rm(GENERATED_DIR, {recursive: true, force: true});
  for (const [file, contents] of outputs) {
    await fsp.mkdir(path.dirname(file), {recursive: true});
    await fsp.writeFile(file, contents, 'utf8');
  }
  console.log(
    `Generated ${names.length} Tecton glyphs into src/icons/ and the semantic registry into src/theme/icons.ts.`,
  );
}
