# The `@tecton/react` surface

What the package publishes, where each entry point comes from, and the two
mechanisms that keep the upstream name out of a consumer's editor.

There is no mapping table any more. There is nothing to map: Tecton publishes
`@astryxdesign/core` as it is — same component names, same props, same types,
same modules at the same paths — and Tecton is the **theme** applied to it.
A consumer writes `<Button label="Save" variant="primary" />`, and that is
upstream's `Button` with upstream's props, drawn in Tecton's palette, type
scale and radii.

The file this replaces described 48 hand-written components with invented APIs
and 132 renamed pass-through wrappers. Both are gone. What follows is the whole
of what the package decides.

## What is published

| Entry point                         | Source                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| `@tecton/react`                     | `src/index.ts`                                                |
| `@tecton/react/<Path>`              | `src/modules/<Path>/index.ts`, generated (118 of them)        |
| `@tecton/react/theme`               | `src/theme/public.ts`                                         |
| `@tecton/react/icons`               | `src/icons/index.ts`                                          |
| `@tecton/react/theme/tokens.stylex` | the vendored file, directly                                   |
| `@tecton/react/locales/*.json`      | the vendored catalogues, directly                             |
| five `*.css` entry points           | assembled by the build (`docs/engineering/build-pipeline.md`) |

### The root

```ts
export * from '@astryxdesign/core';
export {
  TectonProvider,
  configureTectonRoot,
} from './provider/TectonProvider.js';
export {tectonTheme, tectonIcons, tectonToken, tecton} from './theme/public.js';
```

That is all of it. Every one of upstream's 496 root exports is re-exported by
the **same reference**, and the six names Tecton adds are all prefixed
`tecton`/`Tecton`, so nothing is shadowed and nothing upstream is unreachable.
`src/__tests__/surface.test.ts` asserts both directions: no missing name, no
name whose value differs, and no added name that is not one of the six.

### The subpaths

`scripts/generate-modules.mjs` reads upstream's `package.json#exports` and
writes, for each entry it keeps:

```ts
// src/modules/Button/index.ts  — @generated
export * from '@astryxdesign/core/Button';
```

and the matching `exports` entry in `packages/react/package.json`
(`./Button` → `dist/modules/Button/index.{js,d.ts}`). `--check` regenerates in
memory and fails on any difference — a missing module, a stale one, a module
upstream no longer has, or an `exports` map that disagrees. It runs as step 0c
of the package build and as `pnpm modules:check`.

Skipped, and why:

| Upstream entry                              | Why                                                        |
| ------------------------------------------- | ---------------------------------------------------------- |
| `./reset.css`, `./astryx.css`               | assembled into Tecton's own stylesheet entry points        |
| `./tailwind-theme.css`                      | a Tailwind bridge Tecton does not publish                  |
| `./docs.mjs`, `./groups.doc.mjs`            | documentation data; the documentation site reads them      |
| `./theme`                                   | published, but hand-written — see below                    |
| `./theme/tokens.stylex`, `./locales/*.json` | published, but straight from the vendored file — see below |

### `@tecton/react/theme`

The one entry point that carries two things, because both belong at that path:

- **Tecton's theme** — `tectonTheme`, `tecton`, `tectonToken`, `tectonIcons`
  and the token maps.
- **The theme runtime** — `Theme`, `defineTheme`, `useTheme`, `useThemeName`,
  the token variable maps: everything `@astryxdesign/core/theme` exports,
  re-exported unchanged.

The two cannot collide, and that is checked rather than assumed: every Tecton
name at this path is prefixed `tecton`/`Tecton` and no runtime name is, so the
star export is total.

`src/theme/variants.ts` is published with it. It carries the module
augmentations for the values the theme adds to components' own vocabularies —
`Button` `outlined` and `text-only`, `Banner` `neutral`, `Badge` `lime`, and
the eight custom text types — so `variant="text-only"` type-checks in a
consumer's editor and not only inside this package. They are theme extensions
of upstream's API, declared through `defineTheme`; they are not components.

### `@tecton/react/icons`

The 131 Tecton glyph components (`SearchIcon`, `DrillBitIcon`, …),
`tectonIconNames`, `tectonIconRegistry` and the glyph types. Nothing else: the
name-based `<Icon name>` wrapper was an invented component and is gone, and
upstream's own `Icon` is reachable at `@tecton/react/Icon` like every other
module.

The same glyphs back `src/theme/icons.ts`, the theme's icon registry, which is
what puts Tecton's glyphs inside upstream's components without a consumer
importing anything.

### The two direct entries

`./theme/tokens.stylex` and `./locales/*.json` point straight into
`dist/vendor/core/`, with no module in between. They have to:

- StyleX's compiler resolves a token to a `var(--…)` by following the import
  back to the real `defineVars()` call site. A module that re-exported it would
  hide that call and every token reference in a consumer's StyleX would break.
- JSON has nothing to wrap it in.

They are the only public paths into the vendored directory, they are generated
and drift-checked with the rest, and the build verifies that every export
target resolves.

## The two mechanisms

### Vendoring, and the scrub

The build copies upstream's `dist/` and `locales/` into `dist/vendor/core/` and
rewrites every import of it to a relative path (step 8 in
`docs/engineering/build-pipeline.md`). A consumer's `node_modules` therefore has
no `@astryxdesign` directory in it, and the two upstream patches travel with the
package.

Vendoring the declarations means vendoring their prose, and a `.d.ts` is
surface: an editor shows its doc comments and its `@example` blocks. So after
the import rewrite, the build **scrubs the vendored `.d.ts` files**, in exactly
two kinds of span:

- **comments** — prose, `@example` imports, `@file`/`SYNC` headers;
- **import specifiers in module positions** — which name a package.

with three substitutions, in order: `@astryxdesign/core` → `@tecton/react`,
`Astryx` → `Tecton`, `astryx` → `tecton`.

Everything else is left exactly as it is, because everything else is meaning
rather than prose:

- a **string-literal type or constant** (`'data-astryx-theme'`,
  `NAMESPACE = "astryx"`) is a value the runtime compares against and the CSS is
  scoped by. Rewriting it would make the declarations describe a program that
  does not exist.
- an **identifier** is a name the emitted JavaScript imports and exports.
- **`.js` files are never touched at all**: they are the program.

The scrub is position-based, not textual: the build reads each file as code,
with comments and string bodies located rather than pattern-matched, so a
quoted specifier inside a template literal is never mistaken for an import.

### The guard, and its five exceptions

`scripts/check-consumer-surface.mjs` fails the build if the upstream name
appears in a fixture consumer's source, in an exported name, or anywhere in the
text of a declaration file reachable from a published subpath. It walks 122
subpaths and 734 declaration files.

Five mentions survive the scrub, all of them exported string constants the
stylesheet and the runtime are built on. They are listed in the guard's
`ALLOWED` array, each matched by file and by the exact text of its line, each
with its reason:

| File                                  | Constant                                   | Why it has to stay                                                                      |
| ------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `Layout/edgeCompensation.stylex.d.ts` | `EDGE_COMP_ATTR = "data-astryx-edge-comp"` | the DOM attribute layout edge compensation sets and its CSS selects on                  |
| `naming.d.ts`                         | `NAMESPACE = "astryx"`                     | the namespace every class name, data attribute and custom property is built from        |
| `naming.d.ts`                         | `classPrefix = "astryx"`                   | the class-name prefix in the shipped CSS (`.astryx-button`)                             |
| `naming.d.ts`                         | `dataAttrNamespace = "astryx"`             | the data-attribute namespace (`data-astryx-theme`), which the theme CSS is `@scope`d by |
| `naming.d.ts`                         | `cssVarNamespace = "astryx"`               | the custom-property namespace the token variables are named with                        |

An entry that stops matching fails the check rather than lingering: a stale
exception is a hole. Nothing else is excused, and the guard is otherwise
unchanged.

## What Tecton still decides

One file: `packages/react/src/theme/components.ts`, plus the token, typography
and icon modules beside it. That is the whole of Tecton's own styling, and
every rule in it lands in `@layer astryx-theme` under
`[data-astryx-theme="tecton"]`.

One consequence is worth knowing, because the micro-frontend harness measures
it: a per-component decision Tecton makes is a **cross-version contract**, in
exactly the way a token is. Every Tecton version names its theme `tecton`, so
two versions on one page put their card banner's corner in the same scope in
the same layer at the same specificity, and source order decides — for both
containers.
Tecton v1 had a second layer of its own component CSS, where a StyleX class
name hashed the declaration and each version kept its own; v2 has none, because
v2 has no components. `docs/engineering/micro-frontends/README.md` and
`docs/design/fidelity-report.md` carry the rest of it.

## Extending this

- **Upstream added a module**: `pnpm --filter @tecton/react generate:modules`
  and commit. Nothing else.
- **A Tecton styling change**: edit the theme module that owns it
  (`docs/engineering/build-pipeline.md` has the table) and rebuild.
- **A new Tecton component**: there isn't one. If Tecton needs behaviour the
  component system does not have, the honest move is upstream, not a wrapper.
