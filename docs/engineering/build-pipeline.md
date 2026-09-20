# Build pipeline

How `@tecton/react` is built, what lands in `dist/`, and how the single
stylesheet is assembled. Later phases extend this pipeline rather than replace
it.

## The shape of the problem

Tecton is implemented on top of a third-party React component library that
ships pre-built CSS and compiled ESM. Two constraints follow from that:

1. **Consumers must never see the upstream system.** They install
   `@tecton/react`, import from it and from `@tecton/react/styles.css`, and
   nothing else. The upstream library is not a dependency of the published
   package at all: it is **vendored into `dist/vendor/core/`** at build time
   (step 8) and every import of it is rewritten to a relative path, so a
   consumer's `node_modules` has no `@astryxdesign` directory in it. The exact
   pins live in `devDependencies`, where they remain the single source of truth
   for which upstream version Tecton is built against. No exported identifier,
   type name or documented string names the upstream system;
   `scripts/check-consumer-surface.mjs` enforces that on every `pnpm check`.
2. **Consumers must not need a StyleX toolchain.** The upstream components are
   written in StyleX (`stylex.create`, `stylex.props`), which is a compile-time
   API: `stylex.create` throws if it is ever reached at runtime. So the package
   ships compiled JavaScript plus the extracted atomic CSS, exactly as the
   upstream library does. Tecton itself styles no component — every Tecton rule
   is a theme rule (step 5) — so its own StyleX extract is empty today. The
   transform and the extraction step stay in the pipeline anyway: the moment a
   Tecton module reaches for `stylex.create` its rules flow into the bundle
   with nothing to configure.

A third constraint now shapes both: several versions of `@tecton/react` may end
up on one page in a micro-frontend. Nothing in the package keeps mutable
module-level state, so no copy can stomp another, and the page-level state that
copies would otherwise fight over is arbitrated through a document-keyed
record (`src/runtime/rootRegistry.ts`, for the `<html>` attributes). The
build's share of that constraint is
three things: the **token-coverage manifest** (step 6), the **five stylesheet
entry points** (step 7) and the **vendoring** (step 8) — which is also what
carries the two upstream patches
(`docs/engineering/upstream-patches.md`) to consumers, since a `pnpm patch`
applies to this workspace's install and nobody else's. All three are explained
below, and the consumer rules are in
`docs/engineering/micro-frontends/README.md`.

## Commands

From the repository root:

```bash
pnpm install                       # install every workspace
pnpm build                         # packages → apps → fixtures
pnpm check                         # format:check, lint, palette:check, build, typecheck, test, surface check
pnpm --filter @tecton/react build  # just the package
pnpm --filter @tecton/react test   # just its tests
pnpm --filter @tecton/docs dev     # the documentation site
node scripts/check-consumer-surface.mjs
node scripts/capture-fidelity.mjs                # screenshot the theme gallery
pnpm upgrade-astryx --to <version>               # move to a new upstream release

pnpm --filter @tecton/react generate:palette     # regenerate the palette module
pnpm palette:check                               # fail if it has drifted

pnpm check:mfe                                   # build + run the micro-frontend harness
pnpm --filter @tecton/react build -- --update-manifest   # re-pin the theme's token set
```

`pnpm check` deliberately runs `build` **before** `typecheck`: the docs site and
the consumer fixture type-check against `@tecton/react`'s built declarations, so
those have to exist first.

## The package build

`packages/react/scripts/build.mjs` runs ten steps (0–9) in order. Every step is
verified — the script fails loudly rather than producing half a package.

Steps 0–0d are drift checks on generated files: the palette against the design
tokens, the icons against the design delivery, the subpath modules against the
upstream `exports` map, and the README's module list against the package's own.
They run first because a stale generated file is cheaper to report than to
build on.

### 0. Check the generated palette

```bash
node scripts/generate-palette.mjs --check
```

`src/theme/palette.generated.ts` is generated from `tokens/tecton.tokens.json`
— 1 600 colour values across the sixteen families, plus the `shades` alpha
ladders — and committed. The theme never writes a hex: it references a constant
from that module, so every colour in the system is traceable to a design token.

The `--check` mode re-generates the module in memory and compares; a token
export that changed without `pnpm --filter @tecton/react generate:palette`
being run fails the build here rather than shipping stale colours. The same
check runs from the repository root as `pnpm palette:check`, which `pnpm check`
calls before the build so drift is reported early.

The generator keeps only the families the theme draws from; the data-viz
palettes in the same file (`MPL`, `Colorcet`, `custom`) have no `onDark` /
`onLight` ramps and are deliberately left out. One stop name is normalised on
the way through (`hotPink.460 (focus outline)` → `460`), and the module header
records it.

### 0c. Check the generated subpath modules

```bash
node scripts/generate-modules.mjs --check
```

Every module the upstream `exports` map publishes is republished at the same
path under `@tecton/react/`, from a generated one-line file
(`src/modules/<Path>/index.ts`), together with the `exports` entry that points
at it. The generator owns both, so they cannot disagree; `--check` regenerates
in memory and fails on a missing module, a stale one, a module upstream no
longer has, or an `exports` map that has drifted from the files.

118 subpaths today, plus `./theme`, `./icons` and the two entries published
straight from the vendored files (`./theme/tokens.stylex`, `./locales/*.json`).
`docs/engineering/surface.md` says what is skipped and why.

### 0d. Check the README's module list

The README's `## Modules` section is generated from `package.json#exports` by
`scripts/generate-readme.mjs`, which is generated from the upstream map in
turn. It is the package's front page, so it fails the build rather than going
stale.

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
— `false` because Tecton wraps the output in its own cascade layer in step 7 —
and are written to `dist/css/tecton-components.css`.

**The extract is empty today, and that is correct.** Tecton publishes the
upstream components as they are and styles them from the theme, so it has no
StyleX of its own. The build records that in `hasComponentCss` and the
assertions in step 9 read it, rather than asserting a `.tecton` class that no
longer exists. (The old "no CSS means a mis-wired Babel plugin" check was a
check on hand-written Tecton components; there are none.)

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

| File                              | Contents                                                                   |
| --------------------------------- | -------------------------------------------------------------------------- |
| `dist/theme/theme.css`            | Token overrides and prose styles, scoped to `[data-astryx-theme="tecton"]` |
| `dist/theme/tecton.js`            | The theme object with pre-resolved tokens and `__built: true`              |
| `dist/theme/tecton.d.ts`          | Declarations for it                                                        |
| `dist/theme/tecton.variants.d.ts` | Module augmentations for the theme's custom prop values                    |

The `__built: true` flag tells the theme provider to skip runtime `<style>`
injection: the CSS file already carries everything, so there is no flash of
unthemed component overrides on hydration.

Three details are easy to get wrong:

- **The icon registry is a separate module, imported by name.** The theme
  compiler emits an `import` for the registry but does not compile it; an inline
  registry is dropped entirely. `src/theme/icons.ts` therefore exists as its
  own module, and `--icons-specifier ./icons.js` points the generated import at
  `dist/theme/icons.js` — which is exactly where step 2 put the compiled
  registry. Change one of those three names and the generated module resolves to
  nothing.
- **The registry is `.ts` and uses `createElement`, not JSX.** The theme
  compiler loads the theme file and everything it imports through a synchronous
  loader. That loader compiles JSX against the classic runtime, so a `.tsx`
  registry fails with `React is not defined`; and once the theme has more than
  one relative import, the loader stops resolving `./icons.js` to a `.tsx` file
  at all (`Cannot find module './icons.js'`). Both problems disappear if the
  registry is a plain `.ts` module. This is also why the placeholder theme
  appeared to build before the real one existed: with a single import the loader
  failed silently and the compiler fell back to a regex+eval path that only
  handles object literals. A theme built from variables and spreads does not
  survive that fallback, so the loader has to actually work.
- **`dist/theme/tecton.js` replaces a source placeholder.** `src/theme/tecton.ts`
  re-exports the _source_ theme, so tests and editors can resolve `./tecton.js`
  before any build has run. In `dist/` the generated built module overwrites it.
  That is why step 5 must run after steps 2 and 4, and why the build asserts the
  generated module is flagged as built.

### 6. Check the theme's token coverage

```bash
node scripts/build.mjs --update-manifest   # to re-pin it on purpose
```

`packages/react/theme-token-manifest.json` lists every custom property the
built `dist/theme/theme.css` sets — 260 of them today. The build compares the
manifest against the theme that was just compiled and fails on **any omission
or any unexpected extra**, naming them.

This exists because of a measured micro-frontend failure mode, not out of
tidiness. Every Tecton version names its theme `tecton`, so every version's
`theme.css` declares its tokens under the identical
`@scope ([data-astryx-theme="tecton"])` in the identical `@layer astryx-theme`.
Equal specificity, equal layer, equal scope proximity — which means:

- for a token **both** versions set, source order decides, and it decides for
  every container on the page, not just the one that shipped last;
- for a token only **one** version sets, that version wins outright, in either
  load order, because the other version's value is one layer down in
  `astryx-base` among the upstream defaults.

The second case is the dangerous one: coverage that differs between releases
makes a version silently inherit another version's colour, and a version that
_drops_ an override hands that token away. Keeping the token **set** identical
across versions removes it. The manifest is what makes that a build error
instead of a support ticket.

Token _values_ may change — but they are a cross-container contract too: change
one and every other version on the page changes with it. Treat it like a
wire-format change, land it in a coordinated release, and say so in the
changelog. `--update-manifest` is for a deliberate change to the set itself;
the diff it produces is the review.

The names include the component-local custom properties the theme's own
component overrides declare (`--_button-radius` and friends). They are part of
what the sheet sets, so they are part of the contract.

### 7. Assemble the stylesheets

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
API. (`dist/css/tecton-components.css` is the raw StyleX extract;
`dist/tecton-components.css`, one directory up, is the public entry point
below.)

**Four more entry points come out of the same bytes.** They are the bundle with
whole at-rule blocks removed — never re-generated content — so nothing can drift
between them. A brace matcher does the removal, because CSS comments and quoted
strings contain braces and the theme's blocks nest three deep.

| File                                  | Export                                  | Contents                                         |
| ------------------------------------- | --------------------------------------- | ------------------------------------------------ |
| `dist/tecton.css`                     | `@tecton/react/styles.css`              | everything                                       |
| `dist/tecton-no-reset.css`            | `@tecton/react/styles-no-reset.css`     | everything except the `@layer reset` blocks      |
| `dist/tecton-tokens.css`              | `@tecton/react/tokens.css`              | the theme layer only                             |
| `dist/tecton-components.css`          | `@tecton/react/components.css`          | reset + foundation + Tecton components, no theme |
| `dist/tecton-components-no-reset.css` | `@tecton/react/components-no-reset.css` | the same without the reset                       |

All five open with the same `@layer reset, astryx-base, astryx-theme;`
statement, so a page that mixes entry points — or Tecton versions — still gets
one correct layer order.

Why they exist:

- **No reset.** A global reset that arrives from a container restyles markup the
  container does not own: the host shell's `<h1>` measured 32px/700 bare and
  24px/500/Figtree with Tecton loaded. Removing the reset layer restores the
  host's markup exactly while leaving the container fully themed (measured, and
  asserted by the harness). Note that the theme's **prose** styles live in the
  same layer, so they go with it: `no-reset` hands raw `<h1>`/`<p>` markup back
  to the host, inside the container as well as outside it.
- **The token/component split.** In a micro-frontend the host provides the
  tokens: it loads exactly one `tokens.css` — the newest Tecton it knows about —
  and each container loads its own `components.css` and mounts with
  `scope="nested"`. One theme layer on the page means nothing is contested, and
  component CSS stays version-correct because a StyleX atomic class name is a
  hash of its declaration. `docs/engineering/micro-frontends/README.md` is the
  consumer-facing version of this.

`tokens.css` is the whole of `theme.css`, which includes the theme's own
component overrides (`.astryx-button` rules inside `@layer astryx-theme`). That
is what a theme is: those rules ship with the tokens, and they are all inside
the theme's `@scope`. The build asserts the honest form of "no component
styling" — no `.astryx`/`.tecton` rule _outside_ that scope.

### 8. Vendor the upstream library

```
dist/vendor/core/dist/      the upstream package's own dist/, verbatim
dist/vendor/core/locales/   its JSON message catalogues
```

The upstream `dist` and `locales` directories are copied into
`dist/vendor/core/`, every upstream import in Tecton's compiled JavaScript
**and** its emitted `.d.ts` is rewritten to a relative path into that copy, and
the vendored declarations are then scrubbed of the upstream name:

```js
import {Dialog} from '@astryxdesign/core/Dialog';
// becomes
import {Dialog} from '../../vendor/core/dist/Dialog/index.js';
```

Two reasons, and the second is the one that forced it:

1. **The install story.** One dependency, no upstream name in a consumer's
   lockfile, and no way for an application to reach past Tecton to the library
   underneath by importing it directly.
2. **The patches.** `patches/@astryxdesign__core@0.6.2.patch` fixes the
   scroll lock and the layer stack (`docs/engineering/upstream-patches.md`).
   pnpm applies patches to _this_ workspace's install; a consumer resolving
   their own copy would get the unpatched one, and the S1 frozen-page defect
   with it. Shipping the code is what makes the fix reach them.

Details that matter:

- **The mapping is the upstream `exports` map**, read from its `package.json`
  rather than guessed. `@astryxdesign/core/Dialog` is `dist/Dialog/index.js`
  only because the map says so, and subpaths like `./theme/tokens.stylex`,
  `./naming` and the `./locales/*.json` pattern do not follow the
  directory-plus-index shape at all. A specifier the map does not cover fails
  the build rather than shipping a broken import.
- **`.d.ts` files are rewritten too**, including the `declare module '…'` of the
  generated `theme/tecton.variants.d.ts`. The rewritten paths keep the `.js`
  spelling, which is how TypeScript resolves the neighbouring `.d.ts`.
- **A module position, not a string match.** The vendored code's own prose is
  full of `import … from '@astryxdesign/core/Layout'` examples and one runtime
  warning builds such a specifier inside a template literal. The build reads
  each file as code — comments and string bodies blanked, offsets preserved —
  and only rewrites specifiers in module positions.
- **Bare imports stay bare.** The upstream code imports `react`,
  `react-dom`, `react/jsx-runtime`, `@stylexjs/stylex` and
  `intl-messageformat`, and those keep resolving from the consumer's own tree.
  So `@stylexjs/stylex` and `intl-messageformat` (the range upstream declares)
  are `dependencies` of `@tecton/react`, and React stays a peer dependency.
- **`*.d.ts.map` is the one thing not copied.** Those maps point at upstream
  `src/` files the package does not ship; the dangling
  `//# sourceMappingURL=` comments are stripped with them.
- **Step 7 still reads the stylesheets from `node_modules`.** The CSS is
  assembled, not referenced, so it has no import to rewrite.
- **Two public subpaths point into the vendored directory.**
  `@tecton/react/theme/tokens.stylex` and `@tecton/react/locales/*.json` are
  published as the vendored file itself, because StyleX's compiler has to see
  the real `defineVars()` call site and JSON has no module to wrap it in. They
  are the only exceptions, and step 9 checks that they resolve.

#### The declaration scrub

A `.d.ts` carries no implementation, so everything in one is surface: an editor
shows its prose, its `@example` blocks and the specifiers it imports from.
After the import rewrite, the build therefore rewrites two — and only two —
kinds of span in every vendored `.d.ts`:

- **comments**, where the upstream name appears as prose, in `@example` imports
  and in `@file`/`SYNC` headers;
- **import specifiers in module positions**, which name a package.

with three substitutions, in order: `@astryxdesign/core` → `@tecton/react`,
`Astryx` → `Tecton`, `astryx` → `tecton`. 182 spans across 122 files today.

Everything else is left alone, because everything else is meaning rather than
prose: a string-literal type or exported constant (`'data-astryx-theme'`,
`NAMESPACE = "astryx"`) is a value the runtime compares against and the CSS is
scoped by; an identifier is a name the emitted JavaScript imports and exports;
and `.js` files are never touched at all, because they are the program.

The scrub reuses the build's own tokenizer, so it works on positions rather
than on patterns: a specifier quoted inside a template literal is never
mistaken for an import. What survives it is real, and
`scripts/check-consumer-surface.mjs` lists the five surviving mentions with the
reason each one has to stay — see `docs/engineering/surface.md`.

### 9. Verify

The build refuses to finish unless:

- `node --input-type=module -e "await import('<abs>/dist/index.js')"` succeeds —
  the real proof that the emitted ESM is fully specified and loads outside a
  bundler;
- `dist/tecton.css` contains `@layer reset`, `@layer astryx-base` and
  `[data-astryx-theme="tecton"]`;
- `dist/css/tecton-components.css` contains at least one `.tecton` class **if
  Tecton produced any StyleX at all** — it produces none today, so this
  assertion is skipped rather than failed;
- every entry point declares the layer order;
- the two reset-free entry points contain no `@layer reset` block, and
  `tecton-no-reset.css` is still themed and still carries Tecton's components;
- `tecton-tokens.css` has no `.astryx`/`.tecton` rule outside the theme
  `@scope`, and does contain that scope;
- `tecton-components.css` and `tecton-components-no-reset.css` contain no
  `[data-astryx-theme=` scope at all, and do contain Tecton's components;
- **every** path in `package.json#exports` resolves to something that was just
  written — 250 targets, not only the stylesheets, because the two entries that
  point into `dist/vendor/core` would otherwise have nothing watching them — and
  there are exactly as many `.css` entries as the build produced stylesheets;
- **no module position anywhere in `dist/` names `@astryxdesign/*`** — compiled
  JS and emitted `.d.ts`, the vendored code included. One surviving specifier
  means a consumer's bundler tries to resolve a package that is not in their
  tree;
- **the vendored code carries both patches**, checked by the `Symbol.for` keys
  in `dist/vendor/core/dist/hooks/useScrollLock.js` and
  `dist/vendor/core/dist/Layer/layerStack.js`. An install that skipped the
  patch would silently vendor upstream's own modules and ship the failures back.

Finally the build prints what the package weighs — `npm pack --dry-run`, the
unpacked size and the vendored share of it — because vendoring makes the
upstream release a visible part of Tecton's own download size:

```
tecton-react-0.1.0.tgz: 2.2 MB packed, 9.2 MB unpacked, 2205 files
of which dist/vendor/core: 7.0 MB unpacked
```

## dist layout

```
dist/
  index.js / index.d.ts            entry point (the barrel)
  tecton.css                       @tecton/react/styles.css
  tecton-no-reset.css              @tecton/react/styles-no-reset.css
  tecton-tokens.css                @tecton/react/tokens.css
  tecton-components.css            @tecton/react/components.css
  tecton-components-no-reset.css   @tecton/react/components-no-reset.css
  modules/Button/index.js          @tecton/react/Button — generated re-export
  modules/…                        one per upstream module (118 of them)
  provider/TectonProvider.js       the provider
  runtime/rootRegistry.js          the document-keyed root-ownership registry
  theme/
    index.js                       @tecton/react/theme
    tecton.js / tecton.d.ts        GENERATED built theme (overwrites the placeholder)
    theme.css                      GENERATED theme CSS (also copied into css/)
    icons.js                       compiled icon registry, imported by tecton.js
    tectonTheme.js                 the source theme (build input; nothing imports it)
    palette.generated.js           the generated foundational palette
    semantic.js                    the Tecton semantic colour map
    localTokens.js                 theme-local tokens for roles with no token
    typography.js                  the Tecton type scale
    components.js                  the component override map
    variants.js                    the theme's custom variants, as declarations
    tokens.js                      token helpers and the `tecton` token map
  css/
    reset.css, foundation.css, tecton-components.css, tecton-theme.css
  vendor/core/                     THE UPSTREAM LIBRARY, PATCHED (step 8)
    dist/                            its compiled ESM + declarations, verbatim
    locales/                         its JSON message catalogues
```

`dist/vendor/` is internal apart from the two entries named above. Nothing
public re-exports from it, and the only other references to it are the
rewritten import paths inside Tecton's own modules and declarations.

`package.json#exports` is generated: `.`, the five `*.css` entry points,
`./theme`, `./icons`, `./package.json`, the two direct entries and one per
upstream module. Nothing is added to it by hand — `generate-modules.mjs` writes
it, and the build fails if it has drifted.

## Fidelity capture

`node scripts/capture-fidelity.mjs` builds the documentation site, serves it,
and screenshots the temporary `/preview/theme` gallery in both colour modes at
1600 CSS px and 2× device pixels — the same width and density as the design
captures in `screenshots/`. Output goes to `docs/design/fidelity/`: one full
page per mode plus ten cropped sections, which `docs/design/fidelity-report.md`
pairs with the design source.

Hover, pressed and focus cannot be reached from a static render, so the script
forces them through the Chrome DevTools Protocol (`CSS.forcePseudoState`) on
the elements the gallery marks with `data-force-pseudo`. That is what makes the
button matrix a real state matrix rather than five enabled buttons.

The script never downloads a browser; Chromium is expected to be installed
already (`PLAYWRIGHT_BROWSERS_PATH`), and `@playwright/test` is pinned to the
version whose browser revision matches it. `--no-build` reuses `apps/docs/dist`.

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
build having run. `src/theme/__tests__/builtTheme.test.ts` is the exception that
proves it: it reads `dist/theme/tecton.js` and `theme.css` when they exist and
skips itself when they do not, so the built artefact is still checked against
the source theme on every `pnpm check` (which builds first).

The theme tests read `design/foundations/colors.json` and
`tokens/tecton.tokens.json` at run time and re-implement the light-mode
derivation from the rule, so they compare the theme against the _design_ rather
than against a second copy of itself. `src/**/__tests__/**` is excluded from the
declaration build so those helpers never reach `dist/`.

Two files cover the surface itself rather than the theme:

- `src/__tests__/surface.test.ts` — every named export of the upstream root is
  exported by `@tecton/react` with the **same reference**; every generated
  subpath re-exports its module's names, again by reference; `@tecton/react/theme`
  carries both halves with no name in common; and the only names Tecton adds
  are the provider, `configureTectonRoot` and the theme's four values. It reads
  the `exports` map the package actually publishes, so it tests the contract a
  consumer is handed rather than a copy of it.
- `src/__tests__/smoke.test.tsx` — Button (including both of the theme's custom
  variants), TextInput, an open Dialog, Table, TabList and Selector rendered
  inside `TectonProvider`, each asserted to sit under the Tecton theme
  attribute. That is the theme exercised at runtime rather than read.

## Documentation data

> The documentation site's data pipeline is being rebuilt against the upstream
> doc objects. What follows describes the previous shape and will be replaced
> with it; `docs/engineering/docs-site.md` is the site's own document.

Component documentation lives beside each component as `*.doc.mjs`, in the
upstream `ComponentDoc` shape (`name`, `displayName`, `group`, `category`,
`keywords`, `usage.{description,bestPractices,anatomy}`, `props[]`) but written
in Tecton's own terms. `apps/docs/scripts/generate-data.mjs` loads every
`packages/react/src/**/*.doc.mjs` and every `apps/docs/content/docs/*.doc.mjs`
and writes sorted, typed modules into `apps/docs/src/generated/`, which is the
only place the site reads documentation from. That directory is generated and
git-ignored; `dev`, `build` and `typecheck` all regenerate it first.

## The micro-frontend harness

`fixtures/consumers/mfe-harness` builds the package, derives a second "released
version" from the built `dist/` (three retuned tokens and a card whose padding
moved one step up the scale), bundles both into separate
IIFEs with their own React, and drives a two-container page in Chromium.

`pnpm check:mfe` builds and runs it. It is **not** part of `pnpm check`: it
rebuilds the package a second time and launches a browser, and neither is worth
adding to every check. The fixture's own README lists what the spec asserts.

## Extending this

- **Upstream added a module**: `pnpm --filter @tecton/react generate:modules`
  and commit the result. The subpath, the file and the `exports` entry all come
  out of that one command.
- **A theme change**: edit the module that owns it.

  | File                             | Owns                                                                    |
  | -------------------------------- | ----------------------------------------------------------------------- |
  | `src/theme/palette.generated.ts` | nothing by hand — regenerate it                                         |
  | `src/theme/semantic.ts`          | which palette stop each Tecton role uses, and the light-mode derivation |
  | `src/theme/localTokens.ts`       | Tecton roles with no portable token                                     |
  | `src/theme/typography.ts`        | the 16-variant type scale and the custom `Text` types                   |
  | `src/theme/components.ts`        | per-component overrides and custom variants                             |
  | `src/theme/tectonTheme.ts`       | the token map itself, and the `defineTheme` call                        |
  | `src/theme/tokens.ts`            | the public `tecton` token map                                           |

  Everything downstream — `theme.css`, the built module, the bundled stylesheet
  — regenerates. If the theme gains component overrides with custom variant
  values, the compiler also emits `tecton.variants.d.ts`; ship it alongside the
  rest. Two things to know when editing `components.ts`: a pseudo-class key
  (`':hover'`) must sit _inside_ a style block, not beside `base`, or the
  compiler reads it as a state name and emits `[data-=""]`; and an unknown
  state key compiles without complaint into a selector that never matches, so
  a rule that builds is not proof that it lands.

- **New icons**: add them to `src/theme/icons.ts`. Keep it a named export in
  its own module, and keep it JSX-free, or the theme build will fail to load the
  theme (see step 5).
- **Upgrading the upstream library**: bump the exact pins in
  `packages/react/package.json` (they live in `devDependencies` now), re-point
  `pnpm.patchedDependencies` at a patch file for the new version, reinstall, and
  rebuild — the theme must be recompiled against the new version because built
  CSS is not repaired at runtime, and the vendored copy must be re-taken because
  that is what consumers run. A patch that no longer applies fails the install,
  which is deliberate; `docs/engineering/upstream-patches.md` has the procedure.
  `scripts/upgrade-astryx.mjs` is the stub where that flow will live, and the
  same document lists what it must do.
