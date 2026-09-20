#!/usr/bin/env node
/**
 * Documentation drift guard.
 *
 * The Tecton docs are authored beside the components they describe, which is
 * the only way they stay true — but authored docs rot the moment a prop is
 * renamed. This script reads the components with the TypeScript compiler and
 * fails the build when the docs and the code have drifted apart:
 *
 *   1. every component the package's barrel exports has a `.doc.mjs`;
 *   2. every prop a doc describes exists on the component's props type;
 *   3. every prop the props type declares is documented — except the ones it
 *      inherits from React, which belong to the platform rather than to Tecton,
 *      and the two plumbing props (`ref`, `data-testid`) no doc describes;
 *   4. every example a doc lists exists, as a component and as its own doc, and
 *      type-checks;
 *   5. every doc sets `displayName`, and every component assigns one.
 *
 * Run it from the repository root; `pnpm check` does.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE = path.join(ROOT, 'packages', 'react');
const SRC = path.join(PACKAGE, 'src');
const COMPONENTS = path.join(SRC, 'components');

/** Props every component carries as plumbing, which no doc describes. */
const PLUMBING = new Set(['ref', 'data-testid']);

/** @type {string[]} */
const failures = [];
const fail = message => failures.push(message);

// --- the TypeScript program --------------------------------------------------

const configPath = path.join(PACKAGE, 'tsconfig.json');
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) {
  throw new Error(
    ts.flattenDiagnosticMessageText(config.error.messageText, ' '),
  );
}
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, PACKAGE);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

/** True for a declaration that came from React or the DOM lib, not from us. */
function isInherited(declaration) {
  const file = declaration?.getSourceFile().fileName ?? '';
  return !file.startsWith(SRC.replace(/\\/g, '/')) && !file.startsWith(SRC);
}

/** The exported symbol named `name`, anywhere in `dir`'s own sources. */
function findExportedType(dir, name) {
  for (const file of fs.readdirSync(dir)) {
    if (!/\.tsx?$/.test(file) || file.endsWith('.test.tsx')) continue;
    const source = program.getSourceFile(path.join(dir, file));
    if (!source) continue;
    const moduleSymbol = checker.getSymbolAtLocation(source);
    const exported = moduleSymbol
      ? checker.getExportsOfModule(moduleSymbol)
      : [];
    const match = exported.find(symbol => symbol.getName() === name);
    if (match) return match;
  }
  return undefined;
}

/** The props a type declares, with where each one was declared. */
function propsOf(symbol) {
  const declaration = symbol.declarations?.[0];
  const type = declaration
    ? checker.getTypeAtLocation(declaration)
    : checker.getDeclaredTypeOfSymbol(symbol);
  const out = new Map();
  for (const property of checker.getPropertiesOfType(type)) {
    const declaredAt = property.declarations?.[0];
    const typeNode =
      declaredAt && ts.isPropertySignature(declaredAt) && declaredAt.type
        ? declaredAt.type.getText()
        : checker.typeToString(
            checker.getTypeOfSymbolAtLocation(
              property,
              declaredAt ?? declaration,
            ),
          );
    out.set(property.getName(), {
      inherited: isInherited(declaredAt),
      optional: Boolean(property.flags & ts.SymbolFlags.Optional),
      type: typeNode,
      docComment: ts.displayPartsToString(
        property.getDocumentationComment(checker),
      ),
      tags: property.getJsDocTags(),
    });
  }
  return out;
}

// --- what the barrel exports -------------------------------------------------

/**
 * The barrel is in two halves: the hand-written components are exported by
 * `src/index.ts` itself, and the generated pass-throughs by the module it
 * re-exports (`scripts/generate-wrappers.mjs` writes that one). Both are read
 * the same way, so a generated component is held to the same standard as a
 * designed one.
 */
const barrelFiles = [
  path.join(SRC, 'index.ts'),
  path.join(SRC, 'generated', 'componentExports.ts'),
];

/** @type {Map<string, string[]>} component directory → exported value names */
const directories = new Map();
for (const file of barrelFiles) {
  if (!fs.existsSync(file)) {
    fail(`${path.relative(ROOT, file)} is missing — has the barrel moved?`);
    continue;
  }
  const barrel = fs.readFileSync(file, 'utf8');
  for (const match of barrel.matchAll(
    /export\s+\{([^}]*)\}\s+from\s+'\.\.?\/components\/([A-Za-z]+)\/index\.js'/g,
  )) {
    const names = match[1]
      .split(',')
      .map(name => name.trim())
      .filter(Boolean);
    const existing = directories.get(match[2]) ?? [];
    directories.set(match[2], [...new Set([...existing, ...names])]);
  }
}

if (directories.size === 0) {
  fail('The barrel exports no components — has src/index.ts moved?');
}

// Every component directory has to be reachable from the barrel; one that is
// not is a component a consumer cannot import, documented or otherwise.
for (const dir of fs.readdirSync(COMPONENTS)) {
  if (!directories.has(dir)) {
    fail(`components/${dir} is not exported from the barrel.`);
  }
}

// --- the checks --------------------------------------------------------------

const exampleFiles = new Set();
let checkedProps = 0;
let checkedExamples = 0;

for (const [dir, exported] of [...directories].sort()) {
  const folder = path.join(COMPONENTS, dir);
  const docFile = path.join(folder, `${dir}.doc.mjs`);
  const label = `components/${dir}`;

  if (!fs.existsSync(docFile)) {
    fail(`${label} exports ${exported.join(', ')} but has no ${dir}.doc.mjs.`);
    continue;
  }

  const module = await import(pathToFileURL(docFile).href);
  const doc = module.docs ?? module.default;
  if (!doc?.name) {
    fail(`${label}/${dir}.doc.mjs does not export a named \`docs\` object.`);
    continue;
  }
  if (!doc.displayName) {
    fail(`${label}/${dir}.doc.mjs sets no displayName.`);
  }
  if (!doc.usage?.description) {
    fail(`${label}/${dir}.doc.mjs has no usage description.`);
  }

  // 5b. the component assigns a displayName of its own.
  for (const name of exported) {
    if (!/^[A-Z]/.test(name)) continue;
    const componentSource = fs.readFileSync(
      path.join(folder, `${name === dir ? dir : name}.tsx`),
      'utf8',
    );
    if (!componentSource.includes(`${name}.displayName = '${name}'`)) {
      fail(`${label}/${name}.tsx does not set ${name}.displayName.`);
    }
  }

  // 2 and 3. the props table against the props type.
  const typeName = doc.propsType ?? `${doc.name}Props`;
  const symbol = findExportedType(folder, typeName);
  if (!symbol) {
    fail(`${label} declares no exported type \`${typeName}\` for its docs.`);
  } else {
    const props = propsOf(symbol);
    const documented = new Set((doc.props ?? []).map(prop => prop.name));

    for (const prop of doc.props ?? []) {
      if (!props.has(prop.name)) {
        fail(
          `${label}/${dir}.doc.mjs documents "${prop.name}", which is not on ${typeName}.`,
        );
      }
      if (!prop.description) {
        fail(
          `${label}/${dir}.doc.mjs documents "${prop.name}" with no description.`,
        );
      }
    }
    for (const [name, prop] of props) {
      if (prop.inherited || PLUMBING.has(name)) continue;
      if (!documented.has(name)) {
        fail(
          `${typeName} declares "${name}", which ${dir}.doc.mjs does not document.`,
        );
      }
    }
    checkedProps += props.size;
  }

  // 4. the examples.
  for (const id of doc.examples ?? []) {
    const component = path.join(folder, 'examples', `${id}.tsx`);
    const exampleDoc = path.join(folder, 'examples', `${id}.doc.mjs`);
    if (!fs.existsSync(component)) {
      fail(
        `${label}/${dir}.doc.mjs lists example "${id}", which does not exist.`,
      );
      continue;
    }
    if (!fs.existsSync(exampleDoc)) {
      fail(`${label}/examples/${id}.tsx has no ${id}.doc.mjs beside it.`);
    }
    exampleFiles.add(component);
    checkedExamples += 1;
  }
}

// 4b. every example type-checks, and none is orphaned.
for (const dir of directories.keys()) {
  const folder = path.join(COMPONENTS, dir, 'examples');
  if (!fs.existsSync(folder)) continue;
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith('.tsx')) continue;
    const full = path.join(folder, file);
    if (!exampleFiles.has(full)) {
      fail(
        `components/${dir}/examples/${file} is not listed by ${dir}.doc.mjs.`,
      );
    }
  }
}

for (const file of exampleFiles) {
  const source = program.getSourceFile(file);
  if (!source) {
    fail(`${path.relative(ROOT, file)} is not part of the TypeScript program.`);
    continue;
  }
  const diagnostics = [
    ...program.getSemanticDiagnostics(source),
    ...program.getSyntacticDiagnostics(source),
  ];
  for (const diagnostic of diagnostics) {
    fail(
      `${path.relative(ROOT, file)}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`,
    );
  }
}

console.log(
  `Checked ${directories.size} documented components, ${checkedProps} props and ${checkedExamples} examples.`,
);

if (failures.length > 0) {
  console.error('\nDocumentation drift check FAILED:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('Documentation drift check passed.');
