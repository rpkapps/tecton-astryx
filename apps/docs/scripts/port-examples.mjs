#!/usr/bin/env node
/**
 * The example and page-template port.
 *
 * Upstream ships two bodies of example code: 646 *blocks* (one component doing
 * one thing) and 53 *page templates* (a whole screen). Both are documentation
 * content, so they are ported into the docs app rather than into the package:
 *
 *   apps/docs/examples/components/<Component>/<Name>.tsx  + <Name>.doc.mjs
 *   apps/docs/examples/pages/<slug>/page.tsx              + template.doc.mjs
 *
 * `@tecton/react` re-exports `@astryxdesign/core` one for one — same component
 * names, same props — so the port is **import rewriting**, not translation. No
 * prop is mapped and no component is renamed. What changes:
 *
 *   1. `'@astryxdesign/core/X'` becomes `'@tecton/react/X'`, and the bare root
 *      `'@astryxdesign/core'` becomes `'@tecton/react'`.
 *   2. `@heroicons/react/*` and `lucide-react` glyphs become Tecton glyph
 *      components from `'@tecton/react/icons'`, through the substitution table
 *      in `./port-examples.icons.mjs`. Tecton has one icon set, so a glyph with
 *      no counterpart falls back to a neutral mark; both the substitution and
 *      the fallback are written to the log. Lucide's `size={n}`, which a Tecton
 *      glyph does not take, becomes `width={n} height={n}`, so the icon still
 *      draws the size the example drew it.
 *   3. `export default function X` becomes `export function X`, named for the
 *      file it lives in, because a docs page imports examples by name.
 *   4. The upstream copyright line is dropped from every file — the notice for
 *      the whole ported corpus lives once, in THIRD-PARTY-NOTICES.md at the
 *      repository root. `'use client'` stays where it is.
 *   5. Prose names Tecton. An example is documentation, and a page that names
 *      the library underneath Tecton is a page about something else, so
 *      `@astryxdesign/core` -> `@tecton/react`, `Astryx` -> `Tecton` and
 *      `astryx` -> `tecton` are applied to comments, string and template
 *      literals and JSX text — and to nothing else. Identifiers, module
 *      specifiers and keys are left exactly as they are: a key that reads
 *      right and matches nothing is worse than one that names upstream.
 *   6. Doc objects are copied verbatim, with the same rewrite inside their
 *      strings and an `id` (blocks) or `slug` (pages) added so a page can find
 *      the file the doc describes.
 *
 * `react`, `recharts` and `@stylexjs/stylex` are left exactly as upstream wrote
 * them; they are dependencies of the docs app.
 *
 * Every substitution, rename, stripped prop and hand-written rule is recorded,
 * with its file, in `docs/engineering/ported-examples.log`.
 *
 *   node apps/docs/scripts/port-examples.mjs           # write the port
 *   node apps/docs/scripts/port-examples.mjs --check   # fail on drift
 *
 * `--check` re-runs the whole port in memory and compares it with what is
 * committed, so a hand edit to a generated file, or an upstream package bump
 * that changes an example, fails rather than passing unnoticed.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import prettier from 'prettier';
import ts from 'typescript';

import {
  ICON_SUBSTITUTIONS,
  SUBSTITUTE_FALLBACK,
} from './port-examples.icons.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(HERE, '..');
const ROOT = path.resolve(DOCS, '..', '..');
const CLI = path.join(
  ROOT,
  'packages',
  'react',
  'node_modules',
  '@astryxdesign',
  'cli',
);
const ASSETS = path.join(CLI, 'assets', 'templates');
const BLOCKS = path.join(ASSETS, 'blocks', 'components');
const PAGES = path.join(ASSETS, 'pages');
const OUT = path.join(DOCS, 'examples');
const LOG = path.join(ROOT, 'docs', 'engineering', 'ported-examples.log');
const NOTICES = path.join(ROOT, 'THIRD-PARTY-NOTICES.md');
const LICENSE = path.join(CLI, 'LICENSE');
const GLYPH_INDEX = path.join(
  ROOT,
  'packages',
  'react',
  'src',
  'icons',
  'generated',
  'index.ts',
);

const checkOnly = process.argv.includes('--check');

/* ----------------------------------------------------------- the tables --- */

/**
 * Tecton glyph name → the component that draws it.
 *
 * Read from the generated barrel rather than derived from the name, so a glyph
 * whose component is spelled unusually (`co-2-leaf` is `Co2LeafIcon`) is never
 * guessed at.
 */
const glyphComponents = new Map();
for (const match of fs
  .readFileSync(GLYPH_INDEX, 'utf8')
  .matchAll(/export \{(\w+)\} from '\.\/([a-z0-9-]+)\.js';/g)) {
  glyphComponents.set(match[2], match[1]);
}
if (glyphComponents.size === 0) {
  throw new Error(
    `No Tecton glyphs found in ${path.relative(ROOT, GLYPH_INDEX)}.`,
  );
}

/** Modules whose named imports are glyphs. */
const ICON_MODULES = /^(@heroicons\/react\/|lucide-react$)/;

/**
 * Props the icon sets accept that a Tecton glyph does not.
 *
 * A Tecton glyph takes `SVGProps<SVGSVGElement>` plus `variant` (see
 * `packages/react/src/icons/glyph.ts`), so `className`, `width`, `height`,
 * `style`, `fill`, `aria-hidden` and a spread of SVG props all carry over
 * untouched. Lucide's `size` and heroicons' `title`/`titleId` do not exist
 * there.
 *
 * `size` is not dropped, though: a glyph drawn at 16px instead of 20px is a
 * changed example. Lucide's `size={n}` sets the SVG's width and height, and a
 * Tecton glyph takes both, so it is translated rather than stripped. The rest
 * have no equivalent at all and go; every translation and every strip is
 * logged.
 */
const GLYPH_UNSUPPORTED = new Set(['title', 'titleId', 'absoluteStrokeWidth']);

/**
 * The one example that reaches for a theme package.
 *
 * `pages/settings-dialog/page.tsx` renders a light and a dark preview of the
 * same canvas by nesting upstream's `<Theme theme={neutralTheme} mode>`.
 * Tecton does not publish a theme *object* — `@tecton/react/theme` exposes an
 * opaque handle on purpose — and does not depend on `@astryxdesign/theme-neutral`.
 * Its equivalent of "render this subtree in that mode" is a nested
 * `TectonProvider`, which is exactly what the block needs. Each replacement
 * must match, or the port fails loudly rather than emitting an import of a
 * package this repository does not have.
 */
const THEME_RULES = {
  'pages/settings-dialog/page.tsx': {
    reason:
      "`@astryxdesign/theme-neutral/built` has no Tecton equivalent: Tecton's " +
      'theme is applied by `TectonProvider`, and `@tecton/react/theme` exposes ' +
      'only an opaque handle on it. The nested `<Theme theme={neutralTheme} ' +
      'mode>` becomes a nested `<TectonProvider scope="nested" mode>`, which is ' +
      'how Tecton renders a subtree in its own colour mode.',
    replacements: [
      ["import {Theme} from '@tecton/react/theme';\n", ''],
      [
        "import {neutralTheme} from '@astryxdesign/theme-neutral/built';\n",
        "import {TectonProvider} from '@tecton/react';\n",
      ],
      [
        `    // Use the bundled theme directly rather than discovering the ambient theme
    // through registry hooks. Template previews run against the installed
    // package's runtime surface, which can lag this repository's source types;
    // \`Theme\` + \`neutralTheme\` is the stable public composition the docsite and
    // generated applications already use.
`,
        `    // A nested provider, not a nested theme object: Tecton's theme is
    // applied by \`TectonProvider\`, and \`scope="nested"\` renders this subtree
    // in its own colour mode without taking over the page's.
`,
      ],
      [
        '<Theme theme={neutralTheme} mode={mode}>',
        '<TectonProvider scope="nested" mode={mode}>',
      ],
      ['</Theme>', '</TectonProvider>'],
    ],
  },
};

/* ----------------------------------------------------------- the report --- */

/** @type {{section: string, line: string}[]} */
const entries = [];
/** Upstream glyph name → {glyph, component, uses, fallback}. */
const glyphTotals = new Map();
/** `@tecton/react` subpath → how many ported files import it. */
const subpaths = new Map();
/** @type {{file: string, reason: string}[]} */
const excluded = [];
const counts = {blocks: 0, blocksTotal: 0, pages: 0, pagesTotal: 0};

const record = (section, line) => entries.push({section, line});

/* ------------------------------------------------------------- helpers --- */

/** Upstream module specifier → Tecton module specifier, or undefined. */
function tectonModule(specifier) {
  if (specifier === '@astryxdesign/core') return '@tecton/react';
  if (specifier.startsWith('@astryxdesign/core/')) {
    return `@tecton/react/${specifier.slice('@astryxdesign/core/'.length)}`;
  }
  return undefined;
}

/** The Tecton glyph that stands in for an upstream glyph name. */
function glyphFor(upstream) {
  const glyph = ICON_SUBSTITUTIONS[upstream] ?? SUBSTITUTE_FALLBACK;
  const resolved = glyphComponents.has(glyph) ? glyph : SUBSTITUTE_FALLBACK;
  const component = glyphComponents.get(resolved);
  if (!component) {
    throw new Error(
      `The fallback glyph "${SUBSTITUTE_FALLBACK}" is not a Tecton glyph.`,
    );
  }
  return {
    glyph: resolved,
    component,
    fallback:
      resolved === SUBSTITUTE_FALLBACK &&
      ICON_SUBSTITUTIONS[upstream] !== SUBSTITUTE_FALLBACK,
  };
}

/** Apply non-overlapping {start, end, text} edits to a string. */
function applyEdits(text, edits) {
  const sorted = [...edits].sort((a, b) => a.start - b.start || a.end - b.end);
  let out = '';
  let cursor = 0;
  for (const edit of sorted) {
    if (edit.start < cursor) {
      throw new Error(`Overlapping edits at offset ${edit.start}.`);
    }
    out += text.slice(cursor, edit.start) + edit.text;
    cursor = edit.end;
  }
  return out + text.slice(cursor);
}

/** Read a file as LF text, whatever the checkout did to its line endings. */
const readText = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

/**
 * The rewrite applied to prose: doc strings, and the comments, strings and JSX
 * text of a ported example.
 *
 * Longest first, because each rule would otherwise spoil the next:
 * `@astryxdesign/core` is the package Tecton re-exports, so it becomes
 * `@tecton/react`; any other `@astryxdesign/…` package named in a sample (the
 * theme package, the CLI) keeps its shape under Tecton's own scope rather than
 * turning into the nonsense `@tectondesign/…`.
 */
const PROSE_REWRITES = [
  // Upstream tells you to import a reset and a component stylesheet; Tecton
  // ships both as one entry point, so the pair collapses into it.
  [
    /import '@astryxdesign\/core\/reset\.css';\nimport '@astryxdesign\/core\/astryx\.css';/g,
    "import '@tecton/react/styles.css';",
  ],
  [/@astryxdesign\/core\/(?:reset|astryx)\.css/g, '@tecton/react/styles.css'],
  // The cascade layer the components are in is upstream's, and Tecton's own
  // stylesheet keeps its name (see packages/react/scripts/build.mjs). A
  // comment naming it would be either wrong or upstream's name on the page, so
  // it says what the layer is instead.
  [/@layer astryx-base/g, 'the base layer'],
  [/@astryxdesign\/core/g, '@tecton/react'],
  [/@astryxdesign\//g, '@tecton/'],
  [/Astryx/g, 'Tecton'],
  [/astryx/g, 'tecton'],
];

const rewriteText = text =>
  PROSE_REWRITES.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    text,
  );

/**
 * Is this string literal a key rather than prose?
 *
 * `overrides={{en: {'@astryx.selector.placeholder': 'Choose…'}}}` overrides one
 * of the library's own message ids. The id is an identifier that happens to be
 * spelled as a string: rewriting it would leave an example that reads right and
 * does nothing, because the override would no longer match any message. Keys
 * are left alone and reported; the value beside them is prose and is rewritten.
 */
function isKeyLiteral(node) {
  const parent = node.parent;
  if (!parent) return false;
  if (
    (ts.isPropertyAssignment(parent) ||
      ts.isPropertySignature(parent) ||
      ts.isMethodSignature(parent) ||
      ts.isEnumMember(parent)) &&
    parent.name === node
  ) {
    return true;
  }
  return (
    ts.isElementAccessExpression(parent) && parent.argumentExpression === node
  );
}

const prettierConfig = await prettier.resolveConfig(path.join(OUT, 'x.tsx'));

async function format(file, code) {
  const info = await prettier.getFileInfo(file);
  const formatted = await prettier.format(code, {
    ...prettierConfig,
    parser: info.inferredParser ?? 'typescript',
  });
  return formatted.replace(/\r\n/g, '\n');
}

/* ------------------------------------------------------- the .tsx port --- */

/**
 * Port one example or page template.
 *
 * @param {string} raw the upstream file
 * @param {{label: string, exportName: string}} options
 * @returns {string} the ported source, before formatting
 */
function portSource(raw, {label, exportName}) {
  let source = raw.replace(/\r\n/g, '\n');
  const copyright = /^\/\/ Copyright \([cC]\)[^\n]*\n\n?/;
  if (copyright.test(source)) {
    source = source.replace(copyright, '');
  } else {
    record('notes', `${label}: no upstream copyright line to drop`);
  }

  const file = ts.createSourceFile(
    path.basename(label),
    source,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX,
  );

  /** @type {{start: number, end: number, text: string}[]} */
  const edits = [];
  /** @type {import('typescript').ImportDeclaration[]} */
  const iconImports = [];
  /** local name → {upstream, glyph, component, fallback} */
  const bindings = new Map();
  /** Every module specifier, which the prose rewrite must not touch. */
  const moduleSpecifiers = new Set();

  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const specifier = statement.moduleSpecifier;
    if (!ts.isStringLiteral(specifier)) continue;
    moduleSpecifiers.add(specifier);
    if (ICON_MODULES.test(specifier.text)) {
      iconImports.push(statement);
      continue;
    }
    const tecton = tectonModule(specifier.text);
    if (tecton) {
      edits.push({
        start: specifier.getStart(file),
        end: specifier.end,
        text: `'${tecton}'`,
      });
      subpaths.set(tecton, (subpaths.get(tecton) ?? 0) + 1);
    }
  }

  for (const statement of iconImports) {
    const clause = statement.importClause;
    const named = clause?.namedBindings;
    if (clause?.name || !named || !ts.isNamedImports(named)) {
      throw new Error(
        `imports ${statement.moduleSpecifier.text} in a shape the port does not handle`,
      );
    }
    for (const element of named.elements) {
      const upstream = (element.propertyName ?? element.name).text;
      bindings.set(element.name.text, {upstream, ...glyphFor(upstream)});
    }
  }

  const inIconImport = position =>
    iconImports.some(
      statement =>
        position >= statement.getStart(file) && position < statement.end,
    );

  /** Every identifier in the file that is not one of the glyph bindings. */
  const taken = new Set();
  /** Glyph bindings used where a rename would change meaning. */
  const pinned = new Set();
  /** @type {import('typescript').Identifier[]} */
  const references = [];
  /** @type {(import('typescript').JsxOpeningElement | import('typescript').JsxSelfClosingElement)[]} */
  const iconElements = [];

  const visit = node => {
    if (ts.isIdentifier(node) && !inIconImport(node.getStart(file))) {
      if (bindings.has(node.text)) {
        references.push(node);
        // `{PlusIcon}` means `{PlusIcon: PlusIcon}`: renaming the identifier
        // would rename the property too.
        if (ts.isShorthandPropertyAssignment(node.parent))
          pinned.add(node.text);
      } else {
        taken.add(node.text);
      }
    }
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      bindings.has(node.tagName.text)
    ) {
      iconElements.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);

  /* --- the glyph import ---------------------------------------------- */

  if (bindings.size > 0) {
    /** local name → the name it is known by after the port */
    const renames = new Map();
    /** name in the ported file → the Tecton glyph component behind it */
    const specifiers = new Map();

    for (const [local, info] of bindings) {
      let target = info.component;
      let kept;
      if (pinned.has(local) && target !== local) {
        target = local;
        kept = 'it is used as a shorthand property name';
      } else if (target !== local && taken.has(target)) {
        target = local;
        kept = `\`${info.component}\` already names something else in this file`;
      }
      renames.set(local, target);
      const already = specifiers.get(target);
      if (already && already !== info.component) {
        throw new Error(
          `two glyphs want the name \`${target}\`: ${already} and ${info.component}`,
        );
      }
      specifiers.set(target, info.component);

      const totals = glyphTotals.get(info.upstream) ?? {
        ...info,
        uses: 0,
      };
      totals.uses += 1;
      glyphTotals.set(info.upstream, totals);
      record(
        'substitutions',
        `${label}: ${info.upstream} -> ${info.component} ('${info.glyph}')` +
          (info.fallback ? '  [FALLBACK: no Tecton glyph for it]' : '') +
          (kept ? `  [imported as \`${target}\`: ${kept}]` : ''),
      );
    }

    const list = [...specifiers.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([target, component]) =>
        target === component ? component : `${component} as ${target}`,
      );
    const text = `import {${list.join(', ')}} from '@tecton/react/icons';`;

    iconImports.forEach((statement, index) => {
      if (index === 0) {
        edits.push({
          start: statement.getStart(file),
          end: statement.end,
          text,
        });
        return;
      }
      // Take the newline in front of the statement with it, unless a comment
      // is sitting in that whitespace.
      const full = statement.getFullStart();
      const comments = ts.getLeadingCommentRanges(source, full) ?? [];
      edits.push({
        start: comments.length > 0 ? statement.getStart(file) : full,
        end: statement.end,
        text: '',
      });
    });

    for (const node of references) {
      const target = renames.get(node.text);
      if (target !== node.text) {
        edits.push({start: node.getStart(file), end: node.end, text: target});
      }
    }

    for (const element of iconElements) {
      for (const attribute of element.attributes.properties) {
        if (!ts.isJsxAttribute(attribute) || !ts.isIdentifier(attribute.name)) {
          continue;
        }
        const shown = `<${element.tagName.getText(file)} ${attribute
          .getText(file)
          .replace(/\s+/g, ' ')}>`;

        // `size={n}` is lucide's way of setting width and height together,
        // which a Tecton glyph takes one at a time.
        if (attribute.name.text === 'size' && attribute.initializer) {
          const value = attribute.initializer.getText(file);
          edits.push({
            start: attribute.getStart(file),
            end: attribute.end,
            text: `width=${value} height=${value}`,
          });
          record(
            'props',
            `${label}: ${shown} -> width=${value} height=${value} - a Tecton ` +
              'glyph has no `size`; setting both keeps the icon the size the ' +
              'example drew it',
          );
          continue;
        }

        if (
          attribute.name.text !== 'size' &&
          !GLYPH_UNSUPPORTED.has(attribute.name.text)
        ) {
          continue;
        }
        edits.push({
          start: attribute.getFullStart(),
          end: attribute.end,
          text: '',
        });
        record(
          'props',
          `${label}: ${shown} - stripped: a Tecton glyph takes SVG props and ` +
            '`variant`, so this prop does not exist on it',
        );
      }
    }
  }

  /* --- the export ----------------------------------------------------- */

  const declaration = file.statements.find(
    statement =>
      ts.isFunctionDeclaration(statement) &&
      statement.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword),
  );
  if (!declaration || !declaration.name) {
    throw new Error('has no named default-exported function to publish');
  }
  const exportKeyword = declaration.modifiers.find(
    m => m.kind === ts.SyntaxKind.ExportKeyword,
  );
  const defaultKeyword = declaration.modifiers.find(
    m => m.kind === ts.SyntaxKind.DefaultKeyword,
  );
  edits.push({
    start: exportKeyword.getStart(file),
    end: defaultKeyword.end,
    text: 'export',
  });

  const upstreamName = declaration.name.text;
  let name = exportName;
  let keptBecause;
  if (!/^[A-Z]/.test(exportName)) {
    // `useThemeHookUsage.tsx` holds a component, not a hook. A lower-case name
    // would read as one, to a person and to the React lint rules alike.
    name = upstreamName;
    keptBecause = 'the file stem does not start with a capital';
  } else if (exportName !== upstreamName && taken.has(exportName)) {
    // `Avatar/AvatarGroup.tsx` imports `AvatarGroup`; that is why upstream
    // called the block `AvatarGroupBlock`.
    name = upstreamName;
    keptBecause = `\`${exportName}\` already names something else in this file`;
  }
  if (name !== upstreamName) {
    edits.push({
      start: declaration.name.getStart(file),
      end: declaration.name.end,
      text: name,
    });
    record(
      'renames',
      `${label}: export default function ${upstreamName} -> export function ${name}` +
        ' - a named export has to match the file it is in',
    );
  } else if (keptBecause) {
    record(
      'renames',
      `${label}: kept \`export function ${upstreamName}\` rather than ` +
        `\`${exportName}\` - ${keptBecause}`,
    );
  }

  /* --- the prose ------------------------------------------------------ */

  // An example is documentation: a comment, a caption or a sample that names
  // the library underneath Tecton is a page telling the reader they are
  // reading about something else. Only prose is rewritten — comments, string
  // and template literals, JSX text — never an identifier, never a module
  // specifier (those are rewritten above, by the module map, or deliberately
  // left alone), never a key.
  const claimed = edits.map(edit => ({start: edit.start, end: edit.end}));
  const isClaimed = (start, end) =>
    claimed.some(range => start < range.end && end > range.start) ||
    inIconImport(start);

  const proseEdits = [];
  const rewriteRange = (start, end) => {
    if (isClaimed(start, end)) return;
    const text = source.slice(start, end);
    const rewritten = rewriteText(text);
    if (rewritten !== text) proseEdits.push({start, end, text: rewritten});
  };

  const comments = new Map();
  const collectComments = node => {
    for (const range of ts.getLeadingCommentRanges(
      source,
      node.getFullStart(),
    ) ?? []) {
      comments.set(range.pos, range.end);
    }
    for (const range of ts.getTrailingCommentRanges(source, node.end) ?? []) {
      comments.set(range.pos, range.end);
    }
    for (const child of node.getChildren(file)) collectComments(child);
  };
  collectComments(file);
  for (const [start, end] of comments) rewriteRange(start, end);

  const prose = node => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      node.kind === ts.SyntaxKind.TemplateHead ||
      node.kind === ts.SyntaxKind.TemplateMiddle ||
      node.kind === ts.SyntaxKind.TemplateTail ||
      ts.isJsxText(node)
    ) {
      if (!moduleSpecifiers.has(node) && !isKeyLiteral(node)) {
        rewriteRange(node.getStart(file), node.end);
      }
      if (isKeyLiteral(node) && /astryx/i.test(node.getText(file))) {
        record(
          'prose',
          `${label}: kept ${node.getText(file)} - it is one of the library's ` +
            'own message ids, not prose; rewriting it would leave an override ' +
            'that matches nothing',
        );
      }
    }
    ts.forEachChild(node, prose);
  };
  prose(file);

  if (proseEdits.length > 0) {
    record(
      'prose',
      `${label}: ${proseEdits.length} rewrite` +
        `${proseEdits.length === 1 ? '' : 's'} in comments, strings or JSX text`,
    );
    edits.push(...proseEdits);
  }

  let code = applyEdits(source, edits);

  const rules = THEME_RULES[label];
  if (rules) {
    for (const [from, to] of rules.replacements) {
      if (!code.includes(from)) {
        throw new Error(
          `the hand-written rule for this file expected to find ${JSON.stringify(from)}`,
        );
      }
      code = code.split(from).join(to);
    }
    record('rules', `${label}: ${rules.reason}`);
  }

  return {code, exportName: name};
}

/* ------------------------------------------------------- the doc port ---- */

const DOC_MARK =
  '/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */';

/**
 * Copy a doc object across, with `@astryxdesign/core`, `Astryx` and `astryx`
 * rewritten inside its strings and one field added so a page can find the file
 * the doc is about.
 *
 * The object's own source text is carried over rather than re-serialised, so
 * `aspectRatio: 16 / 9` stays the expression upstream wrote. The upstream
 * `@type {import('@astryxdesign/cli/authoring').TemplateDoc}` annotation is
 * dropped: that package is not a dependency of the docs app, so the annotation
 * would point at nothing.
 */
function portDoc(raw, extra) {
  const source = raw.replace(/\r\n/g, '\n');
  const file = ts.createSourceFile(
    'doc.mjs',
    source,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.JS,
  );

  let object;
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    if (
      !statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === 'doc' &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        object = declaration.initializer;
      }
    }
  }
  if (!object) throw new Error('has no `export const doc = {...}` to copy');

  const edits = [];
  const visit = node => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      // Rewriting the literal's *source* rather than its value keeps the
      // quoting and every escape exactly as upstream wrote them.
      const text = node.getText(file);
      const rewritten = rewriteText(text);
      if (rewritten !== text) {
        edits.push({
          start: node.getStart(file),
          end: node.end,
          text: rewritten,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(object);

  const [field, value] = Object.entries(extra)[0];
  edits.push({
    start: object.getStart(file) + 1,
    end: object.getStart(file) + 1,
    text: `\n  ${field}: ${JSON.stringify(value)},`,
  });

  const text = applyEdits(
    source.slice(object.getStart(file), object.end),
    edits.map(edit => ({
      ...edit,
      start: edit.start - object.getStart(file),
      end: edit.end - object.getStart(file),
    })),
  );
  return `${DOC_MARK}\nexport const doc = ${text};\n`;
}

/* ---------------------------------------------------------- the corpus --- */

/** Everything the port produces: repository-relative path → contents. */
const produced = new Map();

const directories = name =>
  fs
    .readdirSync(name, {withFileTypes: true})
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

for (const component of directories(BLOCKS)) {
  const dir = path.join(BLOCKS, component);
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.tsx')) continue;
    counts.blocksTotal += 1;
    const stem = file.slice(0, -'.tsx'.length);
    const label = `blocks/components/${component}/${file}`;
    const target = path.posix.join(
      'apps/docs/examples/components',
      component,
      file,
    );
    try {
      const {code} = portSource(readText(path.join(dir, file)), {
        label,
        exportName: stem,
      });
      produced.set(target, await format(target, code));
      const docFile = path.join(dir, `${stem}.doc.mjs`);
      if (!fs.existsSync(docFile)) {
        throw new Error('has no doc file beside it');
      }
      produced.set(
        target.replace(/\.tsx$/, '.doc.mjs'),
        await format(
          target.replace(/\.tsx$/, '.doc.mjs'),
          portDoc(readText(docFile), {id: stem}),
        ),
      );
      counts.blocks += 1;
    } catch (error) {
      excluded.push({file: label, reason: String(error?.message ?? error)});
    }
  }
}

for (const slug of directories(PAGES)) {
  const dir = path.join(PAGES, slug);
  const page = path.join(dir, 'page.tsx');
  if (!fs.existsSync(page)) continue;
  counts.pagesTotal += 1;
  const label = `pages/${slug}/page.tsx`;
  const target = path.posix.join('apps/docs/examples/pages', slug, 'page.tsx');
  try {
    const {code} = portSource(readText(page), {label, exportName: 'Page'});
    produced.set(target, await format(target, code));
    const docFile = path.join(dir, 'template.doc.mjs');
    if (!fs.existsSync(docFile)) throw new Error('has no template.doc.mjs');
    produced.set(
      path.posix.join('apps/docs/examples/pages', slug, 'template.doc.mjs'),
      await format('template.doc.mjs', portDoc(readText(docFile), {slug})),
    );
    counts.pages += 1;
  } catch (error) {
    excluded.push({file: label, reason: String(error?.message ?? error)});
  }
}

/* ------------------------------------------------- the notices and log --- */

produced.set(
  'THIRD-PARTY-NOTICES.md',
  await format(
    'THIRD-PARTY-NOTICES.md',
    `# Third-party notices

The examples and page templates under \`apps/docs/examples\` are derived from
the example blocks and page templates that ship with
[\`@astryxdesign/cli\`](https://www.npmjs.com/package/@astryxdesign/cli), the
tooling for the Astryx design system that \`@tecton/react\` is built on. They are
used here under the licence below, with their imports rewritten onto
\`@tecton/react\` by \`apps/docs/scripts/port-examples.mjs\`; the per-file
copyright line was replaced by this single notice for the whole corpus. What
each file changed on its way in is listed in
\`docs/engineering/ported-examples.log\`.

The same licence covers \`@astryxdesign/core\`, which \`@tecton/react\` re-exports
and which the package vendors the types of.

## Astryx (\`@astryxdesign/cli\`, \`@astryxdesign/core\`)

\`\`\`
${readText(LICENSE).trim()}
\`\`\`
`,
  ),
);

const section = name =>
  entries.filter(entry => entry.section === name).map(entry => entry.line);

const fallbacks = [...glyphTotals.values()].filter(total => total.fallback);
const substitutions = section('substitutions');
const renames = section('renames');
const props = section('props');
const prose = section('prose');
const rules = section('rules');
const notes = section('notes');

/**
 * The subpaths that are not a component module.
 *
 * `@tecton/react/Button` is a component and will exist by construction. These
 * are the rest — the root, the hook and utility barrels, the theme, a locale
 * file — and each one has to be in the package's exports map by name, so this
 * list is what the package's generator can be checked against.
 */
const beyondComponents = [...subpaths.entries()]
  .filter(([subpath]) => {
    const tail = subpath.slice('@tecton/react'.length).replace(/^\//, '');
    return tail === '' || !/^[A-Z][A-Za-z0-9]*$/.test(tail);
  })
  .sort((a, b) => a[0].localeCompare(b[0]));

const log = [
  'Ported examples and page templates',
  '==================================',
  '',
  'What apps/docs/scripts/port-examples.mjs did the last time it ran. Every',
  'line below names the file it happened to and why it happened. `@tecton/react`',
  're-exports `@astryxdesign/core` one for one, so an example needs no',
  'translation: the import lines change, the icons change, and nothing else',
  'does.',
  '',
  `Blocks ported: ${counts.blocks}/${counts.blocksTotal}`,
  `Pages ported:  ${counts.pages}/${counts.pagesTotal}`,
  `Excluded:      ${excluded.length}`,
  '',
  `Glyph substitutions: ${substitutions.length} imports, ` +
    `${glyphTotals.size} distinct upstream glyphs, ` +
    `${fallbacks.length} of them with no Tecton counterpart.`,
  `Exports renamed:     ${renames.length}`,
  `Icon props rewritten: ${props.length}`,
  `Files with prose rewritten: ${
    prose.filter(line => !line.includes(': kept ')).length
  }`,
  `Hand-written rules:  ${rules.length}`,
  '',
  'Excluded',
  '--------',
  'A file here is one the port could not carry over. There should be none.',
  '',
  ...(excluded.length === 0
    ? ['  (none)']
    : excluded.map(entry => `  ${entry.file}: ${entry.reason}`)),
  '',
  'Glyph substitutions, by upstream glyph',
  '--------------------------------------',
  'Tecton has one icon set — the 131 glyphs the design delivered — so every',
  'icon an upstream example imported is drawn by the nearest Tecton glyph.',
  'A glyph marked FALLBACK had no counterpart at all and is drawn by',
  `\`${SUBSTITUTE_FALLBACK}\`; improving one of those means adding a row to`,
  'apps/docs/scripts/port-examples.icons.mjs.',
  '',
  ...[...glyphTotals.entries()]
    .sort((a, b) => b[1].uses - a[1].uses || a[0].localeCompare(b[0]))
    .map(
      ([upstream, total]) =>
        `  ${upstream} -> ${total.component} ('${total.glyph}')  ` +
        `(${total.uses} file${total.uses === 1 ? '' : 's'})` +
        (total.fallback ? '  [FALLBACK]' : ''),
    ),
  '',
  'Glyph substitutions, by file',
  '----------------------------',
  '',
  ...substitutions.map(line => `  ${line}`),
  '',
  'Renamed exports',
  '---------------',
  'A docs page imports an example by name, so the export is named for the file',
  'it lives in. Where that name was already taken inside the file, or would not',
  'read as a component, the upstream name was kept instead.',
  '',
  ...(renames.length === 0 ? ['  (none)'] : renames.map(line => `  ${line}`)),
  '',
  'Icon props translated and stripped',
  '----------------------------------',
  "A Tecton glyph takes the SVG props plus `variant`. Lucide's `size` sets the",
  'SVG width and height together, so it becomes both rather than being dropped',
  'and changing how big the icon draws.',
  '',
  ...(props.length === 0 ? ['  (none)'] : props.map(line => `  ${line}`)),
  '',
  'Prose rewritten',
  '---------------',
  'An example is documentation, so a comment, a caption, a label or a sample',
  'that named the library underneath Tecton now names Tecton. Only prose is',
  'rewritten — comments, strings, template literals and JSX text — never an',
  'identifier, a module specifier or a key.',
  '',
  ...(prose.length === 0 ? ['  (none)'] : prose.map(line => `  ${line}`)),
  '',
  'Hand-written rules',
  '------------------',
  'One file needed more than an import rewrite. Each is spelled out here.',
  '',
  ...(rules.length === 0 ? ['  (none)'] : rules.map(line => `  ${line}`)),
  '',
  'Subpaths the ported examples import',
  '-----------------------------------',
  'Every one of these has to exist under `@tecton/react` for the examples to',
  'compile. Two of them are entries the package surface calls build-time or',
  'skipped — `@tecton/react/theme/tokens.stylex` and `@tecton/react/locales/*` —',
  'and the examples below need them at the same path upstream published them.',
  '',
  ...[...subpaths.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(
      ([subpath, uses]) =>
        `  ${subpath}  (${uses} file${uses === 1 ? '' : 's'})`,
    ),
  '',
  'Notes',
  '-----',
  '',
  ...(notes.length === 0 ? [] : notes.map(line => `  ${line}`)),
  '  What the examples import beyond a component module — every entry here has',
  "  to be in the package's exports map by name, so this is the list the",
  "  package's generator can be checked against:",
  '',
  ...beyondComponents.map(
    ([subpath, uses]) =>
      `    ${subpath}  (${uses} file${uses === 1 ? '' : 's'})`,
  ),
  '',
  '  Two prose rewrites are more than a name swap, because the plain swap',
  '  would have produced something untrue:',
  '    `@astryxdesign/core/reset.css` + `@astryxdesign/core/astryx.css` ->',
  '      `@tecton/react/styles.css`: Tecton ships the pair as one entry point,',
  '      so a sample that imported both now imports the one.',
  "    `@layer astryx-base` -> `the base layer`: Tecton's own stylesheet keeps",
  "      upstream's layer name, so naming it would put upstream on the page and",
  '      renaming it would be wrong. The comment says what the layer is.',
  '',
  "  The bodies of the ported files are otherwise upstream's own prose and",
  '  sample data, carried over as written.',
  '  Examples reference images under `/template-assets/`, which upstream does',
  '  not ship; the docs site has to provide or stub them.',
  '',
].join('\n');

produced.set('docs/engineering/ported-examples.log', log);

/* ----------------------------------------------------------- write out --- */

const relative = file => path.relative(ROOT, file).split(path.sep).join('/');

if (checkOnly) {
  const drift = [];
  const onDisk = new Set();
  const walk = dir => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else onDisk.add(relative(full));
    }
  };
  walk(OUT);
  onDisk.add(relative(LOG));
  onDisk.add(relative(NOTICES));

  for (const [file, contents] of produced) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      drift.push(`missing: ${file}`);
      continue;
    }
    if (readText(full) !== contents) drift.push(`differs: ${file}`);
  }
  for (const file of onDisk) {
    if (!produced.has(file)) drift.push(`not produced by the port: ${file}`);
  }

  if (drift.length > 0) {
    console.error(
      `The ported examples have drifted from what the port produces (${drift.length}):`,
    );
    for (const line of drift.slice(0, 40)) console.error(`  ${line}`);
    if (drift.length > 40) console.error(`  ... and ${drift.length - 40} more`);
    console.error('\nRun `pnpm examples:port` and commit the result.');
    process.exit(1);
  }
  console.log(
    `No drift: ${counts.blocks} blocks and ${counts.pages} page templates match the port.`,
  );
} else {
  fs.rmSync(OUT, {recursive: true, force: true});
  for (const [file, contents] of produced) {
    const full = path.join(ROOT, file);
    fs.mkdirSync(path.dirname(full), {recursive: true});
    fs.writeFileSync(full, contents);
  }
  console.log(
    `Ported ${counts.blocks}/${counts.blocksTotal} blocks and ` +
      `${counts.pages}/${counts.pagesTotal} page templates into ` +
      `${relative(OUT)}. Log: ${relative(LOG)}`,
  );
}

if (excluded.length > 0) {
  console.error(`${excluded.length} file(s) could not be ported:`);
  for (const entry of excluded)
    console.error(`  ${entry.file}: ${entry.reason}`);
  process.exit(1);
}
