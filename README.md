# tecton-astryx

The monorepo for **Tecton**, a React design system: one package for consumers,
one stylesheet, one provider.

Tecton is a **theme**, not a second component library. `@tecton/react`
publishes the component system it is built on exactly as it is — its component
names, its props, its types, its 118 modules at the same subpaths — and Tecton
supplies the palette, the type scale, the radii, the per-component overrides
and the 131 icons. There is no Tecton wrapper in front of anything, so there is
nothing to learn twice and nothing that can fall behind an upstream release.

## Run it locally

Three commands, from a fresh clone (Node 22+, `corepack enable` gives you the
pinned pnpm):

```bash
pnpm setup      # install every workspace and build @tecton/react once
pnpm dev        # docs site with live examples at http://localhost:3000
pnpm check      # everything CI runs
```

`pnpm doctor` tells you which of those you still need to run and why. Nothing
else is required: the docs site generates its own content when it starts, and
every generated file inside `packages/react` (palette, icons, subpath modules,
README module list) is committed, so you never run a generator by hand — the
build only checks that they are current.

After editing anything under `packages/react/src`, run `pnpm build:package`
(or `pnpm dev` again): the docs site and the fixtures consume the built
package, not the source.

### If `git status` shows generated files after a build

That is a line-ending checkout, not a real change. The repository pins LF in
`.gitattributes`; a clone made with `core.autocrlf=true` before that file
existed has CRLF in the working tree, and the generators write LF. Fix it once:

```bash
git config core.autocrlf false
git add --renormalize . && git checkout -- .
```

`pnpm doctor` reports this condition.

## Layout

```
packages/react/              @tecton/react — the published package
apps/docs/                   @tecton/docs — documentation site (private)
fixtures/consumers/vite-app/ a minimal consumer, built in CI to prove the surface
fixtures/consumers/mfe-harness/ two Tecton versions on one page, driven by Playwright
fixtures/consumers/registry-*/ consumers that install @tecton/react from a real registry
scripts/                     repository-level tooling
docs/engineering/            how the pipeline works
design/, tokens/             design exploration (owned by the design phase)
```

## Commands

Run from the repository root:

| Command                | What it does                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `pnpm setup`           | `pnpm install` plus one build of `@tecton/react`                                     |
| `pnpm dev`             | Build the package, then start the docs site (Next.js dev server)                     |
| `pnpm doctor`          | Check Node, pnpm, line endings, install state and the built package                  |
| `pnpm build:package`   | Build `@tecton/react` only (do this after editing its source)                        |
| `pnpm install`         | Install every workspace                                                              |
| `pnpm build`           | Build the packages, then the apps, then the consumer fixtures                        |
| `pnpm test`            | Run the unit tests                                                                   |
| `pnpm typecheck`       | Type-check every workspace (after a build — apps consume built types)                |
| `pnpm lint`            | ESLint across the repository                                                         |
| `pnpm format:check`    | Prettier, check only (`pnpm format` writes)                                          |
| `pnpm check`           | Everything above, in the order CI runs it                                            |
| `pnpm check:mfe`       | Build and run the micro-frontend harness (browser, not part of `check`)              |
| `pnpm verify:registry` | Publish to a local registry and install it as a consumer would (not part of `check`) |
| `pnpm clean`           | Remove build output                                                                  |

Upgrading the library Tecton is built on is one command:

| Command                                  | What it does                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm upgrade-astryx --to <version>`     | Move the whole repository to a new upstream release, end to end            |
| `pnpm upgrade-astryx --to <v> --dry-run` | Report what that release would change, touching nothing                    |
| `pnpm snapshot:astryx`                   | Re-pin `scripts/astryx-snapshot/` — the inventories a report diffs against |

It bumps every pin and the `pnpm patch` key, installs, runs the upstream
codemods, regenerates the subpath modules and the README from the new release's
exports map, rebuilds the theme and the token manifest, re-ports the
documentation examples, writes `docs/engineering/upgrades/<old>-to-<new>.md`,
and runs both checks. It never commits. A failed patch stops it, loudly, with the recovery procedure printed:
read `docs/engineering/upgrading-astryx.md` before running it.

Per workspace, for example:

```bash
pnpm --filter @tecton/react build
pnpm --filter @tecton/react test
pnpm --filter @tecton/docs dev
```

`pnpm check` also runs six guards:

| Guard                                                 | Fails when                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/check-consumer-surface.mjs`                  | the upstream library's name reaches any published subpath's declarations — an exported name, a type alias's right-hand side, or a doc comment                                                                                                                                                                     |
| `scripts/check-docs-site.mjs`                         | a module with a doc has no page on the docs site, a page names a subpath the package does not export, an example is rendered by no page or by two, a page is missing from the grouped sidebar, a foundations source has moved, a page is not in the search index, or the exported HTML names the upstream library |
| `packages/react/scripts/generate-palette.mjs --check` | the generated colour palette has drifted from `tokens/tecton.tokens.json`                                                                                                                                                                                                                                         |
| `packages/react/scripts/generate-icons.mjs --check`   | the generated icon components have drifted from `design/icons/tecton/`                                                                                                                                                                                                                                            |
| `packages/react/scripts/generate-modules.mjs --check` | the subpath modules or `package.json#exports` have drifted from the upstream exports map                                                                                                                                                                                                                          |
| `packages/react/scripts/generate-readme.mjs --check`  | the package README's module list has drifted from `package.json#exports`                                                                                                                                                                                                                                          |

`pnpm check:mfe` builds `fixtures/consumers/mfe-harness` — two independently
built versions of `@tecton/react` on one page — and asserts the multi-version
mitigations in Chromium. It is deliberately separate from `pnpm check`: it
rebuilds the package a second time and launches a browser. Read
`docs/engineering/micro-frontends/README.md` before shipping Tecton into a
micro-frontend.

`pnpm verify:registry` starts a local Verdaccio, publishes `@tecton/react` into
it twice — the current version and a derived next one — and installs both with
plain `npm` into two applications that are not workspace members: one ordinary
Vite consumer, and one page running both published versions side by side. It is
what proves `files`, `exports` and the vendored upstream library survive a real
publish, which a workspace symlink cannot. Read
`docs/engineering/registry-verification.md`; run it before a release.

`pnpm docs:site:e2e` runs the documentation site's Playwright suite against its
static export — live examples, the icon and colour pages, and search. Like
`check:mfe` it launches a browser, so it is deliberately outside `pnpm check`.

`node scripts/capture-fidelity.mjs` screenshotted the Phase 1 theme gallery at
`/preview/theme`; Phase 4 removed that page along with the upstream dependency
it needed, so the script needs a new source before it can run again. The renders
it produced are read alongside the design captures in
`docs/design/fidelity-report.md`.

Requires Node >= 22 and pnpm 10.33.

## Status

Phase 4: the documentation site. `apps/docs` is the Tecton docsite — a landing
page, nine written guides, the foundations printed from the built theme, a page
for each of the 144 modules the package publishes with every one of the 646
examples running and its source beside it, the icon gallery, 53 page templates
and the changelog — built on fumadocs and Next.js, exported as static HTML. Its
component pages are printed from the documentation objects the component system
ships, and its shape is ported from that system's own documentation site. See
`docs/engineering/docs-site.md`.

- `docs/engineering/surface.md` — what `@tecton/react` publishes, how the
  subpaths are generated, how the vendored declarations are scrubbed, and the
  five mentions the surface guard allows with the reason for each.
- `docs/engineering/build-pipeline.md` — how the package is built.
- `docs/engineering/upgrading-astryx.md` — how the repository moves to a new
  upstream release, what the report says, and what to do when the patch stops
  applying. Two worked examples are in `docs/engineering/upgrades/`.
- `docs/engineering/micro-frontends/README.md` — what a host shell must do when
  several Tecton versions share a page, and what is unsupported.
- `docs/engineering/registry-verification.md` — how `pnpm verify:registry`
  publishes the package to a local registry and installs it as a consumer
  would, including two versions on one page.
- `docs/design/fidelity-report.md` — what survived the port from the design, what
  was approximated, and what could not be expressed. Read its open questions.
- `docs/design/light-mode.md` — Tecton is designed dark; this is how light mode
  is derived and where the derivation is weak.

## Deviations

Choices that differ from the briefs, and why.

### Phase 5

- **The upgrade script runs the codemods once per workspace, not once.** The
  upstream runner refuses a `--path` outside its own project root and finds the
  release by resolving from its working directory, so `packages/react` and
  `apps/docs` are each scanned from their own directory. A consumer fixture
  that does not depend on the upstream package at all makes the runner abort;
  that is reported as a skipped tree in the report rather than treated as a
  failure, because a fixture that only imports `@tecton/react` has no upstream
  API to migrate.
- **`--dry-run` installs the target into `node_modules/.cache/` to report from.**
  Nothing else can say what a release contains — the component list, the theme
  targets and the token surface all come from the installed package. The
  repository is untouched; what a dry run cannot do is compile the theme, so
  the report's theme sections say "not run" instead of "no change".
- **A dry run's codemod preview is for the range up to the _installed_
  release, and says so.** The runner takes its target from what is installed,
  and a dry run installs nothing into the workspace. What it reports instead is
  the codemod catalogue the target ships that the current release does not.
- **The pins are bumped as a text edit, not a JSON round-trip**, so an
  upgrade's diff is the versions it changed and nothing else (a round-trip
  re-prints escapes and would show up as unrelated noise).
- **The toast bus is gone, and with it cross-copy toast merging.** It existed
  to route Tecton's own data-only toast payloads to one viewport on a page
  running several copies of the package. v2 publishes the component system's
  `useToast`, whose toast body is a `ReactNode` — an element built by one
  copy's React, which another copy cannot render — so there is nothing left to
  route. Each copy shows its own toasts in its own viewport, which is what the
  component system does. The root registry, which owns the page's colour mode
  and theme name, is unchanged and still the larger half of the
  multi-version story.

### Phase 4

- **The site renders `@tecton/react` and reads the component system's docs.**
  Nothing on a page imports the library underneath Tecton — every example and
  every preview goes through `@tecton/react` — but the generator reads that
  library's own `.doc.mjs` files for the prose, props, anatomy, best practices,
  accessibility and theming of every page, rewriting their strings to say
  Tecton.
- **The site is generated, not written.** `apps/docs/content` and
  `apps/docs/src/generated` are both build output and both gitignored; the only
  authored content is the nine guides under `apps/docs/guides`.
- **Examples run in the reader's browser, not during the build.** The export is
  static, so each example ships as its own dynamic import and mounts after
  hydration — which is why an example on the site is the running component
  rather than a picture of one.

### v2 — Tecton is a theme

- **No Tecton component exists.** The 48 hand-written components and the 132
  generated wrappers were removed: the owner's brief was to pull in the
  component system as it is and map the tokens, and a wrapper is neither. A
  consumer writes the component's own API and reads its own documentation.
- **Upstream names win every conflict.** `useToast`, `Icon`, `Badge`,
  `Selector` and everything else keep the names and props the component system
  gives them. The only names Tecton adds at the root are `TectonProvider`,
  `configureTectonRoot` and four theme values, all prefixed `tecton`.
- **The theme's custom variants stayed.** `Button` `outlined` and `text-only`,
  `Banner` `neutral`, `Badge` `lime` and eight Tecton text types are declared
  through `defineTheme`: extra values for props the components already have,
  which is a sanctioned theme extension rather than a new component.
- **Two subpaths point straight into the vendored directory.**
  `@tecton/react/theme/tokens.stylex` has to be the real `defineVars()` module
  or StyleX cannot resolve a token to a `var(--…)`, and `./locales/*.json` has
  no module to wrap it in.
- **The vendored declarations are scrubbed in comments and import specifiers
  only.** A string-literal type, an exported constant and an identifier all
  carry meaning the runtime and the stylesheet depend on, so they are left
  alone and the five that remain are listed in the surface guard with a reason
  each.
- **Tecton's per-component styling is now a cross-version contract.** Every
  Tecton rule is in the theme layer under one theme name, so two versions on a
  page resolve a card's padding by source order exactly as they resolve a
  token. The old second layer of Tecton StyleX, where each version kept its own
  hashed class, does not exist because Tecton has no components.

### Phase 2

- **`tectonTheme` is exported as an opaque handle, not as the theme object.**
  The object's shape is an upstream type, so publishing it would have put the
  upstream name in `@tecton/react/theme`'s declarations. `@tecton/react/theme`
  is now `src/theme/public.ts`, which exports `tectonTheme: TectonTheme` — a
  Tecton interface with one member, `name`. `src/theme/index.ts` stays as the
  package-internal barrel `TectonProvider` reads the real object through.
- **Four font weights are exposed, two exist.** The Tecton foundation defines
  400 and 500, so `semibold` and `bold` resolve to the heaviest weights the
  theme carries — 500 and 600 today.
- **`src/theme/variants.ts` declares the theme's type augmentations, and is
  published.** The theme compiler emits declarations for the component variants
  but not for the custom `Text` types, and a consumer writing
  `type="mediumData"` needs them, so one module carries all of them and
  `src/theme/public.ts` imports it for the side effect.
- **Generated files are formatted with Prettier by their generator**, so
  `pnpm format` and `--check` never disagree about one.
- **`packages/react` type-checks with `vite/client` types.** The test that
  renders every example finds them with `import.meta.glob`.

### Phase 1

- **Token vars are imported from the `theme/tokens.stylex` subpath**, not the
  `theme` barrel. StyleX has to resolve the vars module statically at compile
  time, and a barrel re-export is opaque to it. Same tokens, same values.
- **The code font is declared as `IBM Plex Mono`, unquoted.** The theme compiler
  quotes multi-word families itself; passing `'"IBM Plex Mono"'` produced
  `font-family: ""IBM Plex Mono""`, which browsers drop.
- **`pnpm check` runs `build` before `typecheck`.** The docs site and the
  consumer fixture type-check against `@tecton/react`'s built declarations, so
  the package has to be built first.
- **Vite 7.3 with `@vitejs/plugin-react` 5.2.** The current plugin release (6.x)
  requires Vite 8; the brief asked for Vite 7.
- **Babel 7 (`@babel/core` ^7.29).** `@stylexjs/babel-plugin` 0.19 peer-depends
  on Babel 7, so the Babel 8 line is not usable here yet.
- **`@eslint/js` 10.0.1.** ESLint itself is 10.11, but its `js` config package
  versions separately and 10.0.1 is its latest.
- **Tests compile StyleX through a small inline Vite plugin**
  (`packages/react/scripts/vite-stylex-plugin.mjs`) that reuses the production
  Babel configuration, because `stylex.create` throws if it is reached
  uncompiled at runtime.
- **The icon registry is `src/theme/icons.ts`, not `.tsx`, and builds its SVG
  with `createElement`.** The theme compiler loads the theme through a
  synchronous loader that compiles JSX against the classic runtime and that
  stops resolving `./icons.js` to a `.tsx` file once the theme has more than one
  relative import. A plain `.ts` module avoids both.
- **`src/theme/tecton.ts` is a placeholder** that re-exports the source theme;
  in `dist/` the generated built theme module replaces it. Tests therefore
  exercise the runtime theme, while consumers always get the built one.
