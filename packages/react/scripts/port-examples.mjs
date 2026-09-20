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
import {
  ICON_SUBSTITUTIONS,
  SUBSTITUTE_FALLBACK,
} from './port-examples.icons.mjs';
import {
  EXCLUDED,
  FOLDED,
  PROP_RULES,
  SUPPORT,
} from './port-examples.mapping.mjs';

const PACKAGE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
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
// Some example folders are named for a family rather than for an export.
COMPONENT_MAP.set('Toast', 'Toast');
COMPONENT_MAP.set('ChatDictation', 'ChatDictationButton');
COMPONENT_MAP.set('Hooks', 'Toast');

/** Every Tecton glyph name, for checking a substitution really exists. */
const glyphNames = new Set(
  (
    await import(
      pathToFileURL(path.join(SRC, 'icons', 'names.ts')).href.replace(
        /\.ts$/,
        '.ts',
      )
    ).catch(() => ({}))
  ).tectonIconNames ?? [],
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

/**
 * The words inside a JSX value, if it has any.
 *
 * Upstream lets a header be a slot; Tecton takes a string. Losing the slot is
 * unavoidable, losing the words in it is not — so a `<Text>Billing</Text>`
 * header becomes `title="Billing"` rather than nothing.
 */
function plainText(node, file) {
  if (!node) return undefined;
  const parts = [];
  const walk = child => {
    if (ts.isJsxText(child)) parts.push(child.getText(file));
    ts.forEachChild(child, walk);
  };
  walk(node);
  const text = parts.join(' ').replace(/\s+/g, ' ').trim();
  return text || undefined;
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

/** Props every component carries that no documentation lists. */
const PLUMBING = new Set(['key', 'ref', 'children', 'data-testid']);

/**
 * The props each designed Tecton component actually has.
 *
 * Read from the components' own documentation, which the drift guard keeps
 * equal to their props types — so this is the real surface, not a second copy
 * of it. Pass-through components are absent on purpose: they publish whatever
 * is underneath them, so nothing about them needs dropping.
 */
const ALLOWED_PROPS = new Map();
for (const entry of manifest.components) {
  if (!entry.handwritten) continue;
  const docFile = path.join(
    SRC,
    'components',
    entry.name,
    `${entry.name}.doc.mjs`,
  );
  if (!fs.existsSync(docFile)) continue;
  const module = await import(pathToFileURL(docFile).href);
  const doc = module.docs ?? module.default;
  ALLOWED_PROPS.set(
    entry.name,
    new Set((doc?.props ?? []).map(prop => prop.name)),
  );
}

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
        const support = SUPPORT[upstream];
        // A name in both tables is a helper, not a component: Tecton's Toast
        // *is* `useToast`, so the manifest maps the hook to the component and
        // the support table has to win here.
        if (!support && COMPONENT_MAP.has(upstream)) {
          componentBindings.set(local, COMPONENT_MAP.get(upstream));
          continue;
        }
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
      !(
        node.parent &&
        ts.isPropertyAssignment(node.parent) &&
        node.parent.name === node
      ) &&
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
        edits.push({
          start: node.getStart(file),
          end: node.end,
          text: args[0] ?? '0',
        });
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
            ? ts.isJsxElement(attribute.initializer.expression)
              ? attribute.initializer.expression.openingElement
              : attribute.initializer.expression
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
          iconElement &&
          ts.isIdentifier(iconElement.tagName) &&
          componentBindings.get(iconElement.tagName.text) === 'Icon'
        ) {
          // `icon={<Icon icon="check" />}` is `icon="check"` in Tecton: the
          // prop takes the glyph, and the component draws it at its own size.
          const inner = iconElement.attributes.properties.find(
            property =>
              ts.isJsxAttribute(property) &&
              ts.isIdentifier(property.name) &&
              (property.name.text === 'icon' || property.name.text === 'name'),
          );
          // The inner glyph is either a name upstream spelled, or one of the
          // third-party glyphs this port is substituting for.
          const innerValue = inner?.initializer;
          const innerIdentifier =
            innerValue &&
            ts.isJsxExpression(innerValue) &&
            innerValue.expression &&
            ts.isIdentifier(innerValue.expression)
              ? innerValue.expression.text
              : undefined;
          const glyphName = inner
            ? (attributeString(inner) ??
              (innerIdentifier && iconBindings.has(innerIdentifier)
                ? iconBindings.get(innerIdentifier)
                : undefined))
            : undefined;
          if (glyphName !== undefined) {
            const glyph = glyphNames.has(glyphName)
              ? glyphName
              : substitute(glyphName);
            edits.push({
              start: attribute.initializer.getStart(file),
              end: attribute.initializer.end,
              text: `"${glyph}"`,
            });
          }
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
        } else if (
          ICON_PROP.test(name) &&
          ALLOWED_PROPS.has(component) &&
          attribute.initializer &&
          ts.isJsxExpression(attribute.initializer) &&
          attribute.initializer.expression &&
          !ts.isStringLiteral(attribute.initializer.expression)
        ) {
          // A designed Tecton component's icon prop takes a glyph, not a slot.
          // Where the port cannot reduce what was passed to a glyph name —
          // an arbitrary element, a value computed at runtime — the prop goes,
          // because leaving it would only produce an example that does not
          // compile.
          notes.push(
            `<${component}> dropped \`${name}\`, which Tecton takes as a glyph name`,
          );
          edits.push({
            start: attribute.getFullStart(),
            end: attribute.end,
            text: '',
          });
          continue;
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

        const value = attributeString(attribute);
        const allowed = component ? ALLOWED_PROPS.get(component) : undefined;
        if (!rule && !allowed) continue;
        if (
          rule?.drop?.includes(name) ||
          (value !== undefined &&
            rule?.dropIfValue?.[rule.rename?.[name] ?? name]?.includes(value))
        ) {
          notes.push(`<${component}> dropped \`${name}\``);
          edits.push({
            start: attribute.getFullStart(),
            end: attribute.end,
            text: '',
          });
          continue;
        }

        // A rename that is only right when the value is a plain string: the
        // Tecton prop takes text where the upstream one took a slot.
        const stringRename = rule?.renameString?.[name];
        if (stringRename !== undefined) {
          // A slot that held markup still usually held *words*; keep them.
          const text = value ?? plainText(attribute.initializer, file);
          if (text === undefined) {
            notes.push(
              `<${component}> dropped \`${name}\`, which Tecton takes as text`,
            );
            edits.push({
              start: attribute.getFullStart(),
              end: attribute.end,
              text: '',
            });
            continue;
          }
          edits.push({
            start: attribute.name.getStart(file),
            end: attribute.name.end,
            text: stringRename,
          });
          edits.push({
            start: attribute.initializer.getStart(file),
            end: attribute.initializer.end,
            text: `"${text.replace(/"/g, '&quot;')}"`,
          });
          continue;
        }

        // A prop the Tecton component simply does not have. Tecton's designed
        // components are narrower than the ones underneath them, and an
        // example that sets a prop Tecton dropped is an example that does not
        // compile — so the prop goes, and the log says which.
        if (
          allowed &&
          !allowed.has(name) &&
          !rule?.rename?.[name] &&
          !PLUMBING.has(name)
        ) {
          notes.push(
            `<${component}> dropped \`${name}\`, which Tecton has no prop for`,
          );
          edits.push({
            start: attribute.getFullStart(),
            end: attribute.end,
            text: '',
          });
          continue;
        }

        // Renaming onto a prop the element already sets would produce two
        // attributes with one name, which is not valid JSX.
        const proposed = rule?.rename?.[name];
        const collides =
          proposed !== undefined &&
          node.properties.some(
            other =>
              other !== attribute &&
              ts.isJsxAttribute(other) &&
              ts.isIdentifier(other.name) &&
              other.name.text === proposed,
          );
        const renamed = collides ? undefined : proposed;
        if (collides) {
          notes.push(
            `<${component}> dropped \`${name}\`, already set as \`${proposed}\``,
          );
          edits.push({
            start: attribute.getFullStart(),
            end: attribute.end,
            text: '',
          });
          continue;
        }
        if (renamed) {
          edits.push({
            start: attribute.name.getStart(file),
            end: attribute.name.end,
            text: renamed,
          });
        }
        const effective = renamed ?? name;
        const mapped =
          value !== undefined ? rule?.values?.[effective]?.[value] : undefined;
        if (mapped !== undefined && attribute.initializer) {
          const numeric = rule?.numeric?.includes(effective);
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
      const alreadyLabelled = node.openingElement.attributes.properties.some(
        property =>
          ts.isJsxAttribute(property) &&
          ts.isIdentifier(property.name) &&
          property.name.text === 'label',
      );
      const text = node.children
        .map(child => child.getText(file))
        .join('')
        .trim()
        .replace(/\s+/g, ' ');
      if (text) {
        // The element already names itself; the children were the same text
        // twice, which upstream allowed and Tecton does not.
        edits.push({
          start: node.openingElement.attributes.end,
          end: node.end,
          text: alreadyLabelled
            ? ' />'
            : ` label="${text.replace(/"/g, '&quot;')}" />`,
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

  // An edit that rewrites a whole expression wins over the edits inside it:
  // `icon={<Icon icon={Clipboard} />}` becomes `icon="copy"`, so the rewrites
  // of the inner element and of the glyph identifier have nothing left to say.
  // Widest-first ordering, then drop anything contained in what was kept.
  edits.sort((a, b) => a.start - b.start || b.end - a.end);
  const applied = [];
  for (const edit of edits) {
    const covering = applied[applied.length - 1];
    if (covering && edit.start < covering.end) continue;
    applied.push(edit);
  }

  // Apply back to front so the offsets ahead of each edit stay valid.
  let out = source;
  for (const edit of applied.reverse()) {
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
  }

  // The import block, rebuilt.
  const relative = to => {
    const rel = path.relative(targetDir, to).replace(/\\/g, '/');
    return rel.startsWith('.') ? rel : `./${rel}`;
  };
  const imports = [...keptImports];
  // Only what the rewritten file still names: an `icon={<Icon …/>}` that
  // collapsed to `icon="copy"` leaves no Icon behind to import.
  const usedComponents = new Set(
    [...componentBindings.values()].filter(name =>
      new RegExp(`<${name}[\\s/>]`).test(out),
    ),
  );
  if (/<Icon[\s/>]/.test(out)) usedComponents.add('Icon');
  for (const name of [...usedComponents].sort()) {
    imports.push(
      `import {${name}} from '${relative(path.join(COMPONENTS, name, `${name}.js`))}';`,
    );
  }
  const supportValues = [];
  const supportTypes = [];
  const iconTypes = [];
  const componentTypes = new Map();
  const componentFiles = new Map();
  for (const [local, entry] of supportBindings) {
    const spec = entry.name === local ? local : `${entry.name} as ${local}`;
    if (entry.icons) {
      iconTypes.push(spec);
    } else if (entry.component) {
      if (entry.file) componentFiles.set(entry.component, entry.file);
      const list = componentTypes.get(entry.component) ?? {
        values: [],
        types: [],
      };
      (entry.type ? list.types : list.values).push(spec);
      componentTypes.set(entry.component, list);
    } else if (entry.type) {
      supportTypes.push(spec);
    } else {
      supportValues.push(spec);
    }
  }
  for (const [component, list] of [...componentTypes].sort()) {
    const from = relative(
      path.join(
        COMPONENTS,
        component,
        `${componentFiles.get(component) ?? component}.js`,
      ),
    );
    if (list.values.length > 0) {
      imports.push(`import {${list.values.sort().join(', ')}} from '${from}';`);
    }
    if (list.types.length > 0) {
      imports.push(
        `import type {${list.types.sort().join(', ')}} from '${from}';`,
      );
    }
  }
  if (iconTypes.length > 0) {
    imports.push(
      `import type {${iconTypes.sort().join(', ')}} from '${relative(path.join(SRC, 'icons', 'renderIcon.js'))}';`,
    );
  }
  const supportFrom = relative(path.join(SRC, 'support', 'index.js'));
  if (supportValues.length > 0) {
    imports.push(
      `import {${supportValues.sort().join(', ')}} from '${supportFrom}';`,
    );
  }
  if (supportTypes.length > 0) {
    imports.push(
      `import type {${supportTypes.sort().join(', ')}} from '${supportFrom}';`,
    );
  }

  out = `${imports.join('\n')}\n\n${out.replace(/^\s*\n+/, '')}`;
  out = dropOrphanedConstants(out, notes);
  return {code: out, notes};
}

/**
 * Remove the constants the translation orphaned.
 *
 * Dropping a StyleX `xstyle` prop — Tecton has no such prop — leaves the
 * `stylex.create` block it referred to with nothing pointing at it, and the
 * package compiles with `noUnusedLocals`. The same goes for a lookup table
 * that only fed a prop Tecton does not have. Only declarations whose
 * initializer cannot have a side effect are removed, and only while they are
 * referenced nowhere else; removing one can orphan the next, so this runs to a
 * fixed point.
 */
function dropOrphanedConstants(code, notes) {
  for (let pass = 0; pass < 6; pass += 1) {
    const file = ts.createSourceFile(
      'ported.tsx',
      code,
      ts.ScriptTarget.ESNext,
      true,
      ts.ScriptKind.TSX,
    );
    let removedOne = false;
    const statements = [];
    const collect = node => {
      if (ts.isVariableStatement(node)) statements.push(node);
      ts.forEachChild(node, collect);
    };
    ts.forEachChild(file, collect);
    for (const statement of statements.reverse()) {
      if (
        statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        continue;
      }
      const declarations = statement.declarationList.declarations;
      if (declarations.length !== 1) continue;
      const [declaration] = declarations;
      if (!ts.isIdentifier(declaration.name)) continue;
      if (!isInert(declaration.initializer)) continue;
      const name = declaration.name.text;
      // Counted through the syntax tree: a name that only survives in a
      // comment or inside a string is not a use.
      if (countIdentifier(file, name) !== 1) continue;
      code =
        code.slice(0, statement.getFullStart()) + code.slice(statement.end);
      notes.push(`dropped the now-unreferenced constant \`${name}\``);
      removedOne = true;
    }
    // An unused StyleX import is the last thing to go.
    if (!/stylex\./.test(code.replace(/^import .*stylex.*$/m, ''))) {
      const without = code.replace(
        /^import \* as stylex from '@stylexjs\/stylex';\n/m,
        '',
      );
      if (without !== code) {
        code = without;
        removedOne = true;
      }
    }
    const trimmed = dropUnusedImports(code);
    if (trimmed !== code) {
      code = trimmed;
      removedOne = true;
    }
    if (!removedOne) break;
  }
  return code;
}

/**
 * Drop the import specifiers nothing in the file names any more.
 *
 * A `CSSProperties` that only typed a `style` prop Tecton does not have, a
 * `useState` whose state fed a dropped control — the package compiles with
 * `noUnusedLocals`, so an orphaned specifier is an error rather than lint.
 */
function dropUnusedImports(code) {
  const file = ts.createSourceFile(
    'ported.tsx',
    code,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX,
  );
  const edits = [];
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    const kept = bindings.elements.filter(
      element => countIdentifier(file, element.name.text) > 1,
    );
    if (kept.length === bindings.elements.length) continue;
    if (kept.length === 0) {
      edits.push({
        start: statement.getFullStart(),
        end: statement.end,
        text: '',
      });
      continue;
    }
    edits.push({
      start: bindings.getStart(file),
      end: bindings.end,
      text: `{${kept.map(element => element.getText(file)).join(', ')}}`,
    });
  }
  let out = code;
  for (const edit of edits.reverse()) {
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
  }
  return out;
}

/** How many times `name` appears as an identifier in `file`. */
function countIdentifier(file, name) {
  let count = 0;
  const walk = node => {
    if (ts.isIdentifier(node) && node.text === name) count += 1;
    ts.forEachChild(node, walk);
  };
  ts.forEachChild(file, walk);
  return count;
}

/** True for an initializer that cannot do anything when it is removed. */
function isInert(node) {
  if (!node) return false;
  if (
    ts.isObjectLiteralExpression(node) ||
    ts.isArrayLiteralExpression(node) ||
    ts.isStringLiteral(node) ||
    ts.isNumericLiteral(node)
  ) {
    return true;
  }
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return true;
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    return isInert(node.expression);
  }
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === 'stylex'
  ) {
    return true;
  }
  return false;
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

/**
 * The line that says an example was ported.
 *
 * It is a comment rather than a field on the doc, because the documentation
 * site reads these files into a typed registry and provenance is not part of
 * what an example *is*. A re-run of the port looks for this line to know which
 * examples are its own to replace.
 */
const PORTED_MARK =
  '/* Ported from the upstream example blocks by scripts/port-examples.mjs. */';

function exampleDocSource(id, component, doc) {
  const name = String(doc?.name ?? id)
    .replace(/^[^—]*—\s*/, '')
    .trim();
  return `${PORTED_MARK}
/** @type {import('@tecton/docs').ExampleDoc} */
export const docs = ${JSON.stringify(
    {
      id,
      name: name || id,
      component,
      description: String(doc?.description ?? `${component} example.`),
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
      .includes(PORTED_MARK);
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
    if (EXCLUDED[`${folder}/${file}`]) {
      refused.push({file: label, reason: EXCLUDED[`${folder}/${file}`]});
      continue;
    }
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
    const result = port(
      clean(fs.readFileSync(path.join(dir, file), 'utf8')),
      file,
      targetDir,
    );
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
    const result = port(
      clean(fs.readFileSync(pageFile, 'utf8')),
      'page.tsx',
      targetDir,
    );
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
    fs.writeFileSync(
      path.join(targetDir, 'template.doc.mjs'),
      formattedDoc.code,
    );
    templates.push({
      slug,
      name: String(doc?.name ?? slug),
      description: String(doc?.description ?? ''),
      category: String(doc?.category ?? 'Page'),
    });
    ported.push({
      file: label,
      target: `templates/${slug}/Template.tsx`,
      notes: result.notes,
    });
  }

  fs.writeFileSync(path.join(TEMPLATES, 'index.ts'), await templatesBarrel());
}

/** The `@tecton/react/templates` barrel, from whatever survived the port. */
async function templatesBarrel() {
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
  return (await format(path.join(TEMPLATES, 'index.ts'), lines.join('\n')))
    .code;
}

function pascal(slug) {
  return slug
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}

/* ------------------------------------------------------------- the prune ---- */

/**
 * Compile what was ported, and take back what does not compile.
 *
 * A mechanical translation gets a long way, but not all the way: where Tecton
 * redesigned a component — a menu that takes data instead of children, a
 * select that takes options instead of `<SelectChoice>`s — the upstream
 * example is written against a shape Tecton does not have, and no rename
 * rescues it. Rather than ship an example that does not compile, the port
 * removes it and writes down the compiler's own first complaint as the reason.
 * That list is the honest inventory of where the two models disagree.
 */
const pruned = [];
{
  const configPath = path.join(PACKAGE, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, PACKAGE);
  const program = ts.createProgram(parsed.fileNames, parsed.options);

  const portedFiles = new Map();
  for (const entry of ported) {
    const full = entry.target.startsWith('templates/')
      ? path.join(SRC, entry.target)
      : path.join(COMPONENTS, entry.target);
    portedFiles.set(path.normalize(full), entry);
  }

  for (const [full, entry] of portedFiles) {
    const source = program.getSourceFile(full);
    if (!source) continue;
    const diagnostics = [
      ...program.getSemanticDiagnostics(source),
      ...program.getSyntacticDiagnostics(source),
    ];
    if (diagnostics.length === 0) continue;
    const first = diagnostics[0];
    const {line} = source.getLineAndCharacterOfPosition(first.start ?? 0);
    const message = ts
      .flattenDiagnosticMessageText(first.messageText, ' ')
      .slice(0, 200);
    pruned.push({
      file: entry.file,
      target: entry.target,
      reason: `line ${line + 1}: ${message}`,
    });
  }

  for (const entry of pruned) {
    const full = entry.target.startsWith('templates/')
      ? path.join(SRC, entry.target)
      : path.join(COMPONENTS, entry.target);
    if (entry.target.startsWith('templates/')) {
      fs.rmSync(path.dirname(full), {recursive: true, force: true});
    } else {
      fs.rmSync(full, {force: true});
      fs.rmSync(full.replace(/\.tsx$/, '.doc.mjs'), {force: true});
    }
  }

  const removed = new Set(pruned.map(entry => entry.target));
  for (let i = ported.length - 1; i >= 0; i -= 1) {
    if (removed.has(ported[i].target)) ported.splice(i, 1);
  }
  for (let i = templates.length - 1; i >= 0; i -= 1) {
    if (removed.has(`templates/${templates[i].slug}/Template.tsx`)) {
      templates.splice(i, 1);
    }
  }
  if (!only)
    fs.writeFileSync(path.join(TEMPLATES, 'index.ts'), await templatesBarrel());
}

/* -------------------------------------------------- the documentation ---- */

/**
 * Point each designed component's documentation at the examples it now has.
 *
 * A generated component's documentation is rewritten from its examples
 * directory every time the wrappers are generated; the hand-written ones keep
 * their `examples` list in the file, so the port updates it here. The drift
 * guard insists the two agree in both directions, which is what makes this a
 * step rather than an afterthought.
 */
for (const entry of manifest.components) {
  if (!entry.handwritten) continue;
  const docFile = path.join(COMPONENTS, entry.name, `${entry.name}.doc.mjs`);
  if (!fs.existsSync(docFile)) continue;
  const dir = path.join(COMPONENTS, entry.name, 'examples');
  const ids = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter(file => file.endsWith('.tsx'))
        .map(file => file.replace(/\.tsx$/, ''))
        .sort()
    : [];
  const list = `examples: ${JSON.stringify(ids)},`;
  const source = fs.readFileSync(docFile, 'utf8');
  let updated;
  if (/\n\s*examples:\s*\[[^\]]*\],/.test(source)) {
    updated = source.replace(/\n(\s*)examples:\s*\[[^\]]*\],/, `\n$1${list}`);
  } else {
    updated = source.replace(/\n(\s*)notes:/, `\n$1${list}\n\n$1notes:`);
  }
  if (updated === source) continue;
  const formatted = await format(docFile, updated);
  if ('error' in formatted) continue;
  fs.writeFileSync(docFile, formatted.code);
}

/* ----------------------------------------------------------- the report ---- */

const report = [
  'Ported examples and templates',
  '=============================',
  '',
  `Run of scripts/port-examples.mjs: ${ported.length} files ported ` +
    `(${templates.length} of them page templates), ${refused.length} refused ` +
    `before translation and ${pruned.length} removed after it.`,
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
    .flatMap(entry => [
      `  ${entry.target}`,
      ...entry.notes.map(note => `    - ${note}`),
    ]),
  '',
  'Refused before translation',
  '--------------------------',
  'These reach for something Tecton does not publish at all. Each reason is a',
  'real gap, not a shortcut.',
  '',
  ...refused
    .sort((a, b) => a.file.localeCompare(b.file))
    .map(entry => `  ${entry.file}: ${entry.reason}`),
  '',
  'Removed after translation',
  '-------------------------',
  'These translated cleanly but do not compile against the Tecton API: almost',
  'always a component Tecton redesigned to take data where upstream took',
  "children. The line is the compiler's own first complaint.",
  '',
  ...pruned
    .sort((a, b) => a.file.localeCompare(b.file))
    .map(entry => `  ${entry.file}: ${entry.reason}`),
  '',
];
fs.mkdirSync(path.dirname(LOG), {recursive: true});
fs.writeFileSync(LOG, report.join('\n'));

console.log(
  `Ported ${ported.length} files (${templates.length} templates); ` +
    `refused ${refused.length}, pruned ${pruned.length}. ` +
    `Log: ${path.relative(ROOT, LOG)}`,
);
