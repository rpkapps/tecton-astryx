#!/usr/bin/env node
/**
 * Example and template port.
 *
 * Upstream ships two bodies of example code: ~650 *blocks* (one component,
 * shown doing one thing) and 53 *page templates* (a whole screen). Tecton wants
 * all of it, in Tecton's own vocabulary — because an example is the first thing
 * anyone reads, and an example that names a component Tecton does not have is
 * worse than no example.
 *
 * This script is a **one-shot** port, not a build step. It reads each file with
 * the TypeScript parser, rewrites it, and writes it beside the Tecton component
 * it is an example of:
 *
 *   src/components/<Component>/examples/<Name>.tsx  + <Name>.doc.mjs
 *   src/templates/<slug>/Template.tsx               + template.doc.mjs
 *
 * What it rewrites:
 *
 *   - imports: upstream modules become relative imports of Tecton components
 *     and of `src/support`; third-party icon sets and charting libraries are
 *     resolved or refused (see below); `react` and StyleX are left alone;
 *   - component names, through the same manifest the wrappers are generated
 *     from — `Banner` is `Alert`, `TextInput` is `TextField`, `Token` is `Chip`;
 *   - props, through `port-examples.mapping.mjs`, for the components Tecton has
 *     designed itself; a pass-through needs no translation;
 *   - icons: an upstream glyph becomes the closest Tecton glyph, by name;
 *   - `export default function X` becomes `export function X`, which is what
 *     the examples test and the documentation site read.
 *
 * Nothing is dropped quietly. Every substituted glyph, every prop Tecton does
 * not have, and every file that could not be ported at all is written to
 * `docs/engineering/ported-examples.log` with the reason.
 *
 *   node scripts/port-examples.mjs             # port everything
 *   node scripts/port-examples.mjs --only Kbd  # one component family
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';
import {ICON_SUBSTITUTIONS, SUBSTITUTE_FALLBACK} from './port-examples.icons.mjs';
import {FOLDED, PROP_RULES, SUPPORT} from './port-examples.mapping.mjs';

const PACKAGE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(PACKAGE, '..', '..');
const SRC = path.join(PACKAGE, 'src');
const COMPONENTS = path.join(SRC, 'components');
const TEMPLATES = path.join(SRC, 'templates');
const ASSETS = path.join(
  PACKAGE,
  'node_modules',
  '@astryxdesign',
  'cli',
  'assets',
  'templates',
);
const BLOCKS = path.join(ASSETS, 'blocks', 'components');
const PAGES = path.join(ASSETS, 'pages');
const LOG = path.join(ROOT, 'docs', 'engineering', 'ported-examples.log');

const only = (() => {
  const index = process.argv.indexOf('--only');
  return index === -1 ? undefined : process.argv[index + 1];
})();

/* --------------------------------------------------------------- tables ---- */

const manifest = JSON.parse(
  fs.readFileSync(path.join(PACKAGE, 'wrappers.manifest.json'), 'utf8'),
);

/** Upstream export name → Tecton component name. */
const COMPONENT_MAP = new Map(Object.entries(FOLDED));
for (const entry of manifest.components) {
  if (!entry.upstream?.export) continue;
  if (!COMPONENT_MAP.has(entry.upstream.export)) {
    COMPONENT_MAP.set(entry.upstream.export, entry.name);
  }
}
// Upstream publishes some layout primitives from more than one module.
COMPONENT_MAP.set('HStack', 'HStack');
COMPONENT_MAP.set('VStack', 'VStack');
COMPONENT_MAP.set('Stack', 'Stack');
COMPONENT_MAP.set('Card', 'Card');
COMPONENT_MAP.set('Section', 'Section');
COMPONENT_MAP.set('Icon', 'Icon');
COMPONENT_MAP.set('Spinner', 'Progress');

/** Every Tecton glyph name, for checking a substitution really exists. */
const glyphNames = new Set(
  (await import(pathToFileURL(path.join(SRC, 'icons', 'names.ts')).href.replace(/\.ts$/, '.ts')).catch(() => ({})))
    .tectonIconNames ?? [],
);
if (glyphNames.size === 0) {
  // names.ts is TypeScript; read the literal list out of it instead.
  const source = fs.readFileSync(path.join(SRC, 'icons', 'names.ts'), 'utf8');
  for (const match of source.matchAll(/^\s*'([a-z0-9-]+)',$/gm)) {
    glyphNames.add(match[1]);
  }
}

/** Modules an example may keep importing untouched. */
const KEEP_MODULES = new Set(['react', 'react-dom', '@stylexjs/stylex']);
/** Modules whose bindings are glyphs. */
const ICON_MODULES = /^(@heroicons\/react\/|lucide-react$)/;

/* ----------------------------------------------------------- the report ---- */

/** @type {{file: string, target: string, notes: string[]}[]} */
const ported = [];
/** @type {{file: string, reason: string}[]} */
const refused = [];
/** Glyph substitutions, upstream name → Tecton glyph, with a count. */
const substitutions = new Map();

function substitute(name) {
  const glyph =
    ICON_SUBSTITUTIONS[name] ??
    (glyphNames.has(kebab(name)) ? kebab(name) : SUBSTITUTE_FALLBACK);
  const resolved = glyphNames.has(glyph) ? glyph : SUBSTITUTE_FALLBACK;
  const key = `${name} → ${resolved}`;
  substitutions.set(key, (substitutions.get(key) ?? 0) + 1);
  return resolved;
}

function kebab(name) {
  return name
    .replace(/Icon$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/* ------------------------------------------------------------ the port ----- */

/** Is this JSX element the whole value of an icon-shaped prop? */
function isIconPropValue(node) {
  const expression = node.parent;
  if (!expression || !ts.isJsxExpression(expression)) return false;
  const attribute = expression.parent;
  return (
    attribute &&
    ts.isJsxAttribute(attribute) &&
    ts.isIdentifier(attribute.name) &&
    ICON_PROP.test(attribute.name.text)
  );
}

/** Is this identifier used as the tag of a JSX element? */
function isJsxTag(node) {
  const parent = node.parent;
  return (
    parent &&
    (ts.isJsxOpeningElement(parent) ||
      ts.isJsxSelfClosingElement(parent) ||
      ts.isJsxClosingElement(parent)) &&
    parent.tagName === node
  );
}

/** The text of a JSX attribute's value, if it is a plain string. */
function attributeString(attribute) {
  const value = attribute.initializer;
  if (!value) return undefined;
  if (ts.isStringLiteral(value)) return value.text;
  if (
    ts.isJsxExpression(value) &&
    value.expression &&
    ts.isStringLiteral(value.expression)
  ) {
    return value.expression.text;
  }
  return undefined;
}

const ICON_PROP =
  /^(icon|selectedIcon|startIcon|endIcon|leadingIcon|trailingIcon|pressedIcon|avatarIcon)$|Icon$/;

/** Tecton components that take their text as `label` rather than children. */
const LABELLED = new Set(['Button', 'Fab']);

/**
 * Port one source file.
 *
 * @returns {{code: string, notes: string[]} | {error: string}}
 */
function port(source, fileName, targetDir) {
  const notes = [];
  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX,
  );

  /** local name → Tecton component name */
  const componentBindings = new Map();
  /** local name → Tecton glyph name */
  const iconBindings = new Map();
  /** local name → {name, type, component} */
  const supportBindings = new Map();
  /** local names that are rewritten at the call site rather than imported */
  const inlineBindings = new Set();
  /** import statements to keep, verbatim */
  const keptImports = [];
  /** ranges of the import statements that go away */
  const removed = [];

  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const module = statement.moduleSpecifier.text;
    const range = {start: statement.getFullStart(), end: statement.end};

    if (KEEP_MODULES.has(module)) {
      keptImports.push(statement.getText(file));
      removed.push(range);
      continue;
    }

    const clause = statement.importClause;
    const named =
      clause?.namedBindings && ts.isNamedImports(clause.namedBindings)
        ? clause.namedBindings.elements
        : [];

    if (ICON_MODULES.test(module)) {
      for (const element of named) {
        const upstream = (element.propertyName ?? element.name).text;
        iconBindings.set(element.name.text, substitute(upstream));
      }
      removed.push(range);
      continue;
    }

    if (module.startsWith('@astryxdesign/core')) {
      for (const element of named) {
        const upstream = (element.propertyName ?? element.name).text;
        const local = element.name.text;
        if (COMPONENT_MAP.has(upstream)) {
          componentBindings.set(local, COMPONENT_MAP.get(upstream));
          continue;
        }
        const support = SUPPORT[upstream];
        if (support?.inline) {
          inlineBindings.add(local);
          continue;
        }
        if (support) {
          supportBindings.set(local, support);
          continue;
        }
        return {
          error: `needs \`${upstream}\`, which Tecton does not publish`,
        };
      }
      if (named.length === 0) {
        return {error: `imports all of \`${module}\`, which Tecton cannot map`};
      }
      removed.push(range);
      continue;
    }

    return {error: `depends on \`${module}\`, which Tecton does not ship`};
  }

  /** @type {{start: number, end: number, text: string}[]} */
  const edits = [];
  const inRemoved = position =>
    removed.some(range => position >= range.start && position < range.end);

  const visit = node => {
    // An icon used as a JSX tag becomes a Tecton Icon with a glyph name.
    if (
      (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      iconBindings.has(node.tagName.text)
    ) {
      // `icon={<Search />}` is handled by the attribute below, which replaces
      // the whole value with a glyph name; editing the element too would
      // produce two overlapping edits and lose one of them.
      if (isIconPropValue(node)) {
        ts.forEachChild(node, visit);
        return;
      }
      edits.push({
        start: node.tagName.getStart(file),
        end: node.attributes.end,
        text: `Icon name="${iconBindings.get(node.tagName.text)}"`,
      });
      componentBindings.set('__icon__', 'Icon');
      ts.forEachChild(node, visit);
      return;
    }
    if (
      ts.isJsxClosingElement(node) &&
      ts.isIdentifier(node.tagName) &&
      iconBindings.has(node.tagName.text)
    ) {
      edits.push({
        start: node.tagName.getStart(file),
        end: node.tagName.end,
        text: 'Icon',
      });
      return;
    }

    // A JSX tag that names a component Tecton renamed.
    if (
      ts.isIdentifier(node) &&
      isJsxTag(node) &&
      componentBindings.has(node.text) &&
      componentBindings.get(node.text) !== node.text
    ) {
      edits.push({
        start: node.getStart(file),
        end: node.end,
        text: componentBindings.get(node.text),
      });
    }

    // A glyph referenced as a value is a Tecton glyph *name*.
    if (
      ts.isIdentifier(node) &&
      !isJsxTag(node) &&
      iconBindings.has(node.text) &&
      !inRemoved(node.getStart(file)) &&
      !(node.parent && ts.isPropertyAssignment(node.parent) && node.parent.name === node) &&
      !(node.parent && ts.isImportSpecifier(node.parent))
    ) {
      edits.push({
        start: node.getStart(file),
        end: node.end,
        text: `'${iconBindings.get(node.text)}'`,
      });
    }

    // Column widths are data in Tecton, not builders.
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      inlineBindings.has(node.expression.text)
    ) {
      const builder = node.expression.text;
      const args = node.arguments.map(argument => argument.getText(file));
      if (builder === 'pixel') {
        edits.push({start: node.getStart(file), end: node.end, text: args[0] ?? '0'});
      } else if (builder === 'proportional') {
        const extra = args[1] ? `, ...${args[1]}` : '';
        edits.push({
          start: node.getStart(file),
          end: node.end,
          text: `{share: ${args[0] ?? '1'}${extra}}`,
        });
      }
    }

    // Props, for the components Tecton designed itself.
    if (ts.isJsxAttributes(node)) {
      const owner = node.parent;
      const tag = owner.tagName;
      const component = ts.isIdentifier(tag)
        ? componentBindings.get(tag.text)
        : undefined;
      const rule = component ? PROP_RULES[component] : undefined;
      for (const attribute of node.properties) {
        if (!ts.isJsxAttribute(attribute) || !ts.isIdentifier(attribute.name)) {
          continue;
        }
        const name = attribute.name.text;

        // A glyph handed to an icon prop as an expression becomes a name.
        const iconElement =
          ICON_PROP.test(name) &&
          attribute.initializer &&
          ts.isJsxExpression(attribute.initializer) &&
          attribute.initializer.expression &&
          (ts.isJsxSelfClosingElement(attribute.initializer.expression) ||
            ts.isJsxElement(attribute.initializer.expression))
            ? (ts.isJsxElement(attribute.initializer.expression)
                ? attribute.initializer.expression.openingElement
                : attribute.initializer.expression)
            : undefined;
        if (
          iconElement &&
          ts.isIdentifier(iconElement.tagName) &&
          iconBindings.has(iconElement.tagName.text)
        ) {
          edits.push({
            start: attribute.initializer.getStart(file),
            end: attribute.initializer.end,
            text: `"${iconBindings.get(iconElement.tagName.text)}"`,
          });
        } else if (
          ICON_PROP.test(name) &&
          attribute.initializer &&
          ts.isJsxExpression(attribute.initializer) &&
          attribute.initializer.expression &&
          ts.isIdentifier(attribute.initializer.expression) &&
          iconBindings.has(attribute.initializer.expression.text)
        ) {
          edits.push({
            start: attribute.initializer.getStart(file),
            end: attribute.initializer.end,
            text: `"${iconBindings.get(attribute.initializer.expression.text)}"`,
          });
        } else if (ICON_PROP.test(name)) {
          const value = attributeString(attribute);
          if (value !== undefined && !glyphNames.has(value)) {
            const glyph = substitute(value);
            notes.push(`glyph \`${value}\` → \`${glyph}\``);
            edits.push({
              start: attribute.initializer.getStart(file),
              end: attribute.initializer.end,
              text: `"${glyph}"`,
            });
          }
        }

        if (!rule) continue;

        const value = attributeString(attribute);
        if (
          rule.drop?.includes(name) ||
          (value !== undefined && rule.dropIfValue?.[rule.rename?.[name] ?? name]?.includes(value))
        ) {
          notes.push(`<${component}> dropped \`${name}\``);
          edits.push({
            start: attribute.getFullStart(),
            end: attribute.end,
            text: '',
          });
          continue;
        }

        const renamed = rule.rename?.[name];
        if (renamed) {
          edits.push({
            start: attribute.name.getStart(file),
            end: attribute.name.end,
            text: renamed,
          });
        }
        const effective = renamed ?? name;
        const mapped = value !== undefined ? rule.values?.[effective]?.[value] : undefined;
        if (mapped !== undefined && attribute.initializer) {
          const numeric = rule.numeric?.includes(effective);
          edits.push({
            start: attribute.initializer.getStart(file),
            end: attribute.initializer.end,
            text: numeric ? `{${mapped}}` : `"${mapped}"`,
          });
        }
      }
    }

    // A Tecton Button names itself with `label`, not with children.
    if (
      ts.isJsxElement(node) &&
      ts.isIdentifier(node.openingElement.tagName) &&
      LABELLED.has(componentBindings.get(node.openingElement.tagName.text)) &&
      node.children.length > 0 &&
      node.children.every(child => ts.isJsxText(child))
    ) {
      const text = node.children
        .map(child => child.getText(file))
        .join('')
        .trim()
        .replace(/\s+/g, ' ');
      if (text) {
        edits.push({
          start: node.openingElement.attributes.end,
          end: node.end,
          text: ` label="${text.replace(/"/g, '&quot;')}" />`,
        });
      }
    }

    ts.forEachChild(node, visit);
  };
  ts.forEachChild(file, visit);

  // `export default function X()` is `export function X()` here.
  for (const statement of file.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)
    ) {
      const defaultKeyword = statement.modifiers.find(
        m => m.kind === ts.SyntaxKind.DefaultKeyword,
      );
      edits.push({
        start: defaultKeyword.getStart(file),
        end: defaultKeyword.end + 1,
        text: '',
      });
    }
  }

  for (const range of removed) {
    edits.push({start: range.start, end: range.end, text: ''});
  }

  // Apply back to front so earlier offsets stay valid, and refuse overlaps
  // rather than producing something that only looks like code.
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  let out = source;
  let lastStart = Infinity;
  for (const edit of edits) {
    if (edit.end > lastStart) continue;
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
    lastStart = edit.start;
  }

  // The import block, rebuilt.
  const relative = to => {
    const rel = path.relative(targetDir, to).replace(/\\/g, '/');
    return rel.startsWith('.') ? rel : `./${rel}`;
  };
  const imports = [...keptImports];
  const usedComponents = new Set(
    [...componentBindings.values()].filter(name => {
      if (name === 'Icon') return true;
      return new RegExp(`<${name}[\\s/>]`).test(out);
    }),
  );
  if (iconBindings.size > 0 && /(<Icon[\s/>])/.test(out)) usedComponents.add('Icon');
  for (const name of [...usedComponents].sort()) {
    imports.push(
      `import {${name}} from '${relative(path.join(COMPONENTS, name, `${name}.js`))}';`,
    );
  }
  const supportValues = [];
  const supportTypes = [];
  const componentTypes = new Map();
  for (const [local, entry] of supportBindings) {
    const spec = entry.name === local ? local : `${entry.name} as ${local}`;
    if (entry.component) {
      const list = componentTypes.get(entry.component) ?? {values: [], types: []};
      (entry.type ? list.types : list.values).push(spec);
      componentTypes.set(entry.component, list);
    } else if (entry.type) {
      supportTypes.push(spec);
    } else {
      supportValues.push(spec);
    }
  }
  for (const [component, list] of [...componentTypes].sort()) {
    const from = relative(path.join(COMPONENTS, component, `${component}.js`));
    if (list.values.length > 0) {
      imports.push(`import {${list.values.sort().join(', ')}} from '${from}';`);
    }
    if (list.types.length > 0) {
      imports.push(`import type {${list.types.sort().join(', ')}} from '${from}';`);
    }
  }
  const supportFrom = relative(path.join(SRC, 'support', 'index.js'));
  if (supportValues.length > 0) {
    imports.push(`import {${supportValues.sort().join(', ')}} from '${supportFrom}';`);
  }
  if (supportTypes.length > 0) {
    imports.push(
      `import type {${supportTypes.sort().join(', ')}} from '${supportFrom}';`,
    );
  }

  out = `${imports.join('\n')}\n\n${out.replace(/^\s*\n+/, '')}`;
  return {code: out, notes};
}

/* ---------------------------------------------------------- the sources ---- */

/** Strip the upstream file header and the directive the package does not use. */
function clean(source) {
  return source
    .replace(/^\/\/ Copyright \(c\)[^\n]*\n/, '')
    .replace(/^\s*'use client';\n/m, '')
    .replace(/^\s*\n+/, '');
}

async function loadDoc(file) {
  const module = await import(pathToFileURL(file).href);
  return module.doc ?? module.docs ?? module.default;
}

/** `BannerInline` for component `Alert` is `AlertInline`. */
function targetName(blockName, upstreamComponent, tectonComponent) {
  if (upstreamComponent === tectonComponent) return blockName;
  if (blockName.startsWith(upstreamComponent)) {
    return `${tectonComponent}${blockName.slice(upstreamComponent.length)}`;
  }
  return `${tectonComponent}${blockName}`;
}

function exampleDocSource(id, component, doc) {
  const name = String(doc?.name ?? id)
    .replace(/^[^—]*—\s*/, '')
    .trim();
  return `/** @type {import('@tecton/docs').ExampleDoc} */
export const docs = ${JSON.stringify(
    {
      id,
      name: name || id,
      component,
      description: String(doc?.description ?? `${component} example.`),
      // Provenance, and the marker a re-run uses to clear its own output.
      origin: 'ported',
    },
    null,
    2,
  )};
`;
}

const prettierConfig = await prettier.resolveConfig(path.join(SRC, 'index.ts'));

/**
 * Format, or report that the port produced something that is not code.
 *
 * A rewrite that lands mid-expression parses as nothing, and the parser's
 * complaint is the honest reason the file could not be ported — so it is
 * returned rather than thrown, and ends up in the log beside the others.
 */
async function format(file, code) {
  const info = await prettier.getFileInfo(file);
  if (!info.inferredParser) return {code};
  try {
    return {
      code: await prettier.format(code, {
        ...prettierConfig,
        parser: info.inferredParser,
      }),
    };
  } catch (error) {
    const message = String(error?.message ?? error)
      .split('\n')[0]
      .slice(0, 160);
    return {error: `the port produced code that does not parse: ${message}`};
  }
}

/* ------------------------------------------------------------- blocks ----- */

/**
 * Clear what a previous run wrote, and remember what it did not.
 *
 * A ported example says so in its own documentation (`origin: 'ported'`), so a
 * re-run can take back exactly its own output — an upstream rename leaves no
 * orphan — while the examples that were written by hand for the designed
 * components stay untouched and are never overwritten.
 */
const handWritten = new Set();
for (const dir of fs.readdirSync(COMPONENTS)) {
  const examples = path.join(COMPONENTS, dir, 'examples');
  if (!fs.existsSync(examples)) continue;
  for (const file of fs.readdirSync(examples)) {
    if (!file.endsWith('.doc.mjs')) continue;
    const id = file.replace(/\.doc\.mjs$/, '');
    const wasPorted = fs
      .readFileSync(path.join(examples, file), 'utf8')
      .includes("origin: 'ported'");
    if (wasPorted) {
      fs.rmSync(path.join(examples, file), {force: true});
      fs.rmSync(path.join(examples, `${id}.tsx`), {force: true});
    } else {
      handWritten.add(`${dir}/${id}.tsx`);
    }
  }
}

if (!only) {
  fs.rmSync(TEMPLATES, {recursive: true, force: true});
  fs.mkdirSync(TEMPLATES, {recursive: true});
}

for (const folder of fs.readdirSync(BLOCKS).sort()) {
  if (only && folder !== only) continue;
  const dir = path.join(BLOCKS, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.tsx')) continue;
    const blockName = file.replace(/\.tsx$/, '');
    const docFile = path.join(dir, `${blockName}.doc.mjs`);
    const label = `blocks/${folder}/${file}`;
    const doc = fs.existsSync(docFile) ? await loadDoc(docFile) : undefined;
    const upstream = doc?.exampleFor ?? folder;
    const component = COMPONENT_MAP.get(upstream);
    if (!component) {
      refused.push({
        file: label,
        reason: `is an example for \`${upstream}\`, which is not a Tecton component`,
      });
      continue;
    }
    const id = targetName(blockName, upstream, component);
    const targetDir = path.join(COMPONENTS, component, 'examples');
    if (handWritten.has(`${component}/${id}.tsx`)) {
      refused.push({
        file: label,
        reason: `would overwrite the hand-written example ${component}/${id}.tsx`,
      });
      continue;
    }
    const result = port(clean(fs.readFileSync(path.join(dir, file), 'utf8')), file, targetDir);
    if ('error' in result) {
      refused.push({file: label, reason: result.error});
      continue;
    }
    // The exported function has to be named for the file it lives in.
    const code = result.code.replace(
      new RegExp(`export function ${blockName}\\b`),
      `export function ${id}`,
    );
    const formatted = await format(path.join(targetDir, `${id}.tsx`), code);
    if ('error' in formatted) {
      refused.push({file: label, reason: formatted.error});
      continue;
    }
    const formattedDoc = await format(
      path.join(targetDir, `${id}.doc.mjs`),
      exampleDocSource(id, component, doc),
    );
    fs.mkdirSync(targetDir, {recursive: true});
    fs.writeFileSync(path.join(targetDir, `${id}.tsx`), formatted.code);
    fs.writeFileSync(path.join(targetDir, `${id}.doc.mjs`), formattedDoc.code);
    ported.push({
      file: label,
      target: `${component}/examples/${id}.tsx`,
      notes: result.notes,
    });
  }
}

/* ----------------------------------------------------------- templates ---- */

const templates = [];
if (!only) {
  for (const slug of fs.readdirSync(PAGES).sort()) {
    const dir = path.join(PAGES, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    const pageFile = path.join(dir, 'page.tsx');
    if (!fs.existsSync(pageFile)) continue;
    const label = `pages/${slug}/page.tsx`;
    const doc = await loadDoc(path.join(dir, 'template.doc.mjs'));
    const targetDir = path.join(TEMPLATES, slug);
    const result = port(clean(fs.readFileSync(pageFile, 'utf8')), 'page.tsx', targetDir);
    if ('error' in result) {
      refused.push({file: label, reason: result.error});
      continue;
    }
    const exportName = 'Template';
    const code = result.code.replace(
      /export function ([A-Za-z0-9_]+)/,
      `export function ${exportName}`,
    );
    const formatted = await format(path.join(targetDir, 'Template.tsx'), code);
    if ('error' in formatted) {
      refused.push({file: label, reason: formatted.error});
      continue;
    }
    const formattedDoc = await format(
      path.join(targetDir, 'template.doc.mjs'),
      `/** @type {import('@tecton/docs').TemplateDoc} */
export const docs = ${JSON.stringify(
        {
          slug,
          name: String(doc?.name ?? slug),
          description: String(doc?.description ?? ''),
          category: String(doc?.category ?? 'Page'),
        },
        null,
        2,
      )};
`,
    );
    fs.mkdirSync(targetDir, {recursive: true});
    fs.writeFileSync(path.join(targetDir, 'Template.tsx'), formatted.code);
    fs.writeFileSync(path.join(targetDir, 'template.doc.mjs'), formattedDoc.code);
    templates.push({slug, name: String(doc?.name ?? slug), description: String(doc?.description ?? ''), category: String(doc?.category ?? 'Page')});
    ported.push({file: label, target: `templates/${slug}/Template.tsx`, notes: result.notes});
  }

  // The templates barrel.
  const lines = [
    '/**',
    ' * @generated by packages/react/scripts/port-examples.mjs — do not edit.',
    ' *',
    ' * Tecton page templates: whole screens, assembled from Tecton components,',
    ' * that a team copies and edits rather than imports. Published from',
    ' * `@tecton/react/templates` so the documentation site can render the',
    ' * gallery from the same code a consumer would paste.',
    ' */',
    '',
    '/** A page template, as the gallery lists it. */',
    'export interface TectonTemplateEntry {',
    '  /** URL-safe identifier, and the directory the template lives in. */',
    '  slug: string;',
    "  /** The template's name, as the gallery shows it. */",
    '  name: string;',
    '  /** One sentence on what the page is for. */',
    '  description: string;',
    '  /** The gallery grouping. */',
    '  category: string;',
    '}',
    '',
  ];
  for (const template of templates) {
    lines.push(
      `export {Template as ${pascal(template.slug)}Template} from './${template.slug}/Template.js';`,
    );
  }
  lines.push('');
  lines.push('/** Every page template Tecton publishes. */');
  lines.push(
    `export const tectonTemplates: readonly TectonTemplateEntry[] = ${JSON.stringify(templates, null, 2)};`,
  );
  fs.writeFileSync(
    path.join(TEMPLATES, 'index.ts'),
    (await format(path.join(TEMPLATES, 'index.ts'), lines.join('\n'))).code,
  );
}

function pascal(slug) {
  return slug
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}

/* ----------------------------------------------------------- the report ---- */

const report = [
  'Ported examples and templates',
  '=============================',
  '',
  `Run of scripts/port-examples.mjs. ${ported.length} files ported, ${refused.length} refused.`,
  '',
  'Substituted glyphs',
  '------------------',
  'Tecton has one icon set; every glyph an upstream example used was replaced',
  'by the closest Tecton glyph. Left is what the example asked for, right is',
  'what it draws now.',
  '',
  ...[...substitutions.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => `  ${key}  (${count}×)`),
  '',
  'Props dropped in translation',
  '----------------------------',
  'A Tecton component is narrower than the one underneath it on purpose. These',
  'props had no Tecton equivalent and were removed from the ported example.',
  '',
  ...ported
    .filter(entry => entry.notes.length > 0)
    .flatMap(entry => [`  ${entry.target}`, ...entry.notes.map(note => `    - ${note}`)]),
  '',
  'Refused',
  '-------',
  'These could not be ported. Each reason is a real gap, not a shortcut.',
  '',
  ...refused
    .sort((a, b) => a.file.localeCompare(b.file))
    .map(entry => `  ${entry.file}: ${entry.reason}`),
  '',
];
fs.mkdirSync(path.dirname(LOG), {recursive: true});
fs.writeFileSync(LOG, report.join('\n'));

console.log(
  `Ported ${ported.length} files (${templates.length} templates), refused ${refused.length}. Log: ${path.relative(ROOT, LOG)}`,
);
