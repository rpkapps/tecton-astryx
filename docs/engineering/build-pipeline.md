# Build pipeline

How `@tecton/react` is built, what lands in `dist/`, and how the single
stylesheet is assembled. Later phases extend this pipeline rather than replace
it.

## The shape of the problem

Tecton is implemented on top of a third-party React component library that
ships pre-built CSS and compiled ESM. Two constraints follow from that:

1. **Consumers must never see the upstream system.** They install
   `@tecton/react`, import from it and from `@tecton/react/styles.css`, and
   nothing else. The upstream packages are therefore ordinary, exactly pinned
   `dependencies` of `@tecton/react` — not peer dependencies — and no exported
   identifier, type name or documented string names them.
   `scripts/check-consumer-surface.mjs` enforces that on every `pnpm check`.
2. **Consumers must not need a StyleX toolchain.** Tecton's own components are
   written in StyleX (`stylex.create`, `stylex.props`), which is a compile-time
   API: `stylex.create` throws if it is ever reached at runtime. So the package
   ships compiled JavaScript plus the extracted atomic CSS, exactly as the
   upstream library does.

A third constraint shapes the code rather than the build: several versions of
`@tecton/react` may end up on one page in a micro-frontend. Nothing in the
package keeps mutable module-level state, so no copy can stomp another. No MFE
machinery exists yet; the rule is simply not to introduce the problem.

## Commands

From the repository root:

```bash
pnpm install                       # install every workspace
pnpm build                         # packages → apps → fixtures
pnpm check                         # format:check, lint, build, typecheck, test, surface check
pnpm --filter @tecton/react build  # just the package
pnpm --filter @tecton/react test   # just its tests
pnpm --filter @tecton/docs dev     # the documentation site
node scripts/check-consumer-surface.mjs
node scripts/upgrade-astryx.mjs --to <version>   # stub, a later phase fills it in
```

`pnpm check` deliberately runs `build` **before** `typecheck`: the docs site and
the consumer fixture type-check against `@tecton/react`'s built declarations, so
those have to exist first.

## The package build

`packages/react/scripts/build.mjs` runs seven steps in order. Every step is
verified — the script fails loudly rather than producing half a package.

### 1. Clean

`dist/` is removed and recreated. The build is never incremental; the theme step
overwrites files the compile step produced, so a stale `dist/` would be
ambiguous.

### 2. Compile with Babel

Every `src/**/*.{ts,tsx}` except tests, `__tests__/`, `src/test/` and `*.d.ts`
is compiled with `@babel/core` and written to `dist/` with a `.js` extension:

- `@babel/preset-typescript` — strips the types.
- `@babel/preset-react` with the automatic runtime — no `React` import needed.
- `@stylexjs/babel-plugin`, configured once in `scripts/stylex-babel.mjs`:
  `dev: false`, `runtimeInjection: false`, `classNamePrefix: 'tecton'`,
  `treeshakeCompensation: true`, `enableInlinedConditionalMerge: true` and
  `unstable_moduleResolution: {type: 'commonJS', rootDir: <package root>}`. That
  last option is what lets the compiler follow
  `@astryxdesign/core/theme/tokens.stylex` and turn `colorVars['--color-…']`
  into a real `var(--color-…)` reference.

**Module specifiers.** Source files import each other with explicit `.js`
extensions (`./Button.js`), which TypeScript's `bundler` resolution maps back to
`.ts`/`.tsx` and Babel passes through untouched. The emitted ESM is therefore
fully specified and `node` can import `dist/index.js` with no bundler, no
loader and no `exports` gymnastics. This is the ESM strategy for the repository;
`rewriteImportExtensions` is not needed.

Each transform returns the StyleX rules for that file in
`result.metadata.stylex`; the script accumulates them all.

### 3. Extract the component CSS

The accumulated rules go through the plugin's `processStylexRules(rules, false)`
— `false` because Tecton wraps the output in its own cascade layer in step 6 —
and are written to `dist/css/tecton-components.css`. An empty result fails the
build, which is the cheap way to catch a mis-wired Babel plugin: without it,
components compile fine and render completely unstyled.

### 4. Emit declarations

`tsc -p tsconfig.build.json --emitDeclarationOnly` writes `dist/**/*.d.ts` and
`.d.ts.map` beside the compiled JavaScript. Nothing else about the emit comes
from TypeScript; Babel owns the JavaScript.

### 5. Compile the theme

```bash
astryx theme build src/theme/tectonTheme.ts -o dist/theme/theme.css --icons-specifier ./icons.js
```

This reads the `defineTheme(...)` call in `src/theme/tectonTheme.ts` and emits
three files:

| File                     | Contents                                                                   |
| ------------------------ | -------------------------------------------------------------------------- |
| `dist/theme/theme.css`   | Token overrides and prose styles, scoped to `[data-astryx-theme="tecton"]` |
| `dist/theme/tecton.js`   | The theme object with pre-resolved tokens and `__built: true`              |
| `dist/theme/tecton.d.ts` | Declarations for it                                                        |

The `__built: true` flag tells the theme provider to skip runtime `<style>`
injection: the CSS file already carries everything, so there is no flash of
unthemed component overrides on hydration.

Two details are easy to get wrong:

- **The icon registry is a separate module, imported by name.** The theme
  compiler emits an `import` for the registry but does not compile it; an inline
  registry is dropped entirely. `src/theme/icons.tsx` therefore exists as its
  own module, and `--icons-specifier ./icons.js` points the generated import at
  `dist/theme/icons.js` — which is exactly where step 2 put the compiled
  registry. Change one of those three names and the generated module resolves to
  nothing.
- **`dist/theme/tecton.js` replaces a source placeholder.** `src/theme/tecton.ts`
  re-exports the _source_ theme, so tests and editors can resolve `./tecton.js`
  before any build has run. In `dist/` the generated built module overwrites it.
  That is why step 5 must run after steps 2 and 4, and why the build asserts the
  generated module is flagged as built.

### 6. Assemble the stylesheet

`dist/tecton.css` is one self-contained file, concatenated at build time from
files read out of `node_modules` (never hand-copied):

```
/*! Tecton <version>, built on <upstream>@<version> */
@layer reset, astryx-base, astryx-theme;      ← explicit, so order never depends on arrival
<upstream>/reset.css                          ← @layer reset
<upstream>/astryx.css                         ← @layer astryx-base (foundation components)
@layer astryx-base { <tecton-components.css> } ← Tecton's own components, last in the layer
dist/theme/theme.css                          ← @layer astryx-theme (Tecton tokens)
```

The layer order is the whole point: the reset sits underneath everything, the
foundation and Tecton components share `astryx-base` (Tecton's rules come last,
so equal-specificity conflicts resolve in Tecton's favour), and the theme's
token overrides land in `astryx-theme` above both. Unlayered application CSS
still beats all of it, which is what an application expects.

The same pieces are also written separately to `dist/css/` — `reset.css`,
`foundation.css`, `tecton-components.css`, `tecton-theme.css` — for debugging a
cascade problem without bisecting a 190 kB file. They are not part of the public
API.

### 7. Verify

The build refuses to finish unless:

- `node --input-type=module -e "await import('<abs>/dist/index.js')"` succeeds —
  the real proof that the emitted ESM is fully specified and loads outside a
  bundler;
- `dist/tecton.css` contains `@layer reset`, `@layer astryx-base` and
  `[data-astryx-theme="tecton"]`;
- `dist/css/tecton-components.css` contains at least one `.tecton` class, i.e.
  StyleX really ran.

## dist layout

```
dist/
  index.js / index.d.ts            entry point (the barrel)
  tecton.css                       @tecton/react/styles.css
  components/Button/…              Button, compiled + declarations
  components/Panel/…               Panel, compiled + declarations
  provider/TectonProvider.js       the provider
  theme/
    index.js                       @tecton/react/theme
    tecton.js / tecton.d.ts        GENERATED built theme (overwrites the placeholder)
    theme.css                      GENERATED theme CSS (also copied into css/)
    icons.js                       compiled icon registry, imported by tecton.js
    tectonTheme.js                 the source theme (build input; nothing imports it)
    tokens.js                      token helpers
  css/
    reset.css, foundation.css, tecton-components.css, tecton-theme.css
```

`package.json#exports` maps `.`, `./styles.css`, `./theme`, `./Button`,
`./Panel` and `./package.json`. Adding a component means adding a directory
under `src/components/`, exporting it from `src/index.ts`, and adding an
`exports` entry — the build picks it up with no further configuration.

## Tests

Vitest runs against `src/`, in jsdom, with Testing Library. Because
`stylex.create` throws at runtime, `vitest.config.ts` installs
`scripts/vite-stylex-plugin.mjs`, a pre-enforced transform that runs the _same_
Babel configuration the production build uses. The CSS it extracts is discarded;
only the class names matter in jsdom. Testing Library's automatic cleanup does
not register itself when Vitest globals are off, so `src/test/setup.ts` calls
`cleanup` in an explicit `afterEach`.

Tests resolve the theme through the source placeholder, so they exercise the
runtime theme rather than the built one. That is the one place where source and
`dist` behave differently, and it is deliberate: tests should not depend on a
build having run.

## Documentation data

Component documentation lives beside each component as `*.doc.mjs`, in the
upstream `ComponentDoc` shape (`name`, `displayName`, `group`, `category`,
`keywords`, `usage.{description,bestPractices,anatomy}`, `props[]`) but written
in Tecton's own terms. `apps/docs/scripts/generate-data.mjs` loads every
`packages/react/src/**/*.doc.mjs` and every `apps/docs/content/docs/*.doc.mjs`
and writes sorted, typed modules into `apps/docs/src/generated/`, which is the
only place the site reads documentation from. That directory is generated and
git-ignored; `dev`, `build` and `typecheck` all regenerate it first.

## Extending this

- **A new component**: `src/components/<Name>/{<Name>.tsx, <Name>.doc.mjs, <Name>.test.tsx, index.ts}`,
  export it from `src/index.ts`, add an `exports` entry. Style it with
  `stylex.create` against the token vars; the CSS flows into `dist/tecton.css`
  automatically.
- **A real theme**: edit `src/theme/tectonTheme.ts`. Everything downstream —
  `theme.css`, the built module, the bundled stylesheet — regenerates. If the
  theme gains component overrides with custom variant values, the compiler also
  emits `tecton.variants.d.ts`; ship it alongside the rest.
- **New icons**: add them to `src/theme/icons.tsx`. Keep it a named export in
  its own module or the theme build will silently lose the registry.
- **Upgrading the upstream library**: bump the exact pins in
  `packages/react/package.json`, reinstall, and rebuild — the theme must be
  recompiled against the new version because built CSS is not repaired at
  runtime. `scripts/upgrade-astryx.mjs` is the stub where that flow will live.
