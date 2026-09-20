# tecton-astryx

The monorepo for **Tecton**, a React design system: one package for consumers,
one stylesheet, one provider.

## Layout

```
packages/react/              @tecton/react — the published package
apps/docs/                   @tecton/docs — documentation site (private)
fixtures/consumers/vite-app/ a minimal consumer, built in CI to prove the surface
fixtures/consumers/mfe-harness/ two Tecton versions on one page, driven by Playwright
scripts/                     repository-level tooling
docs/engineering/            how the pipeline works
design/, tokens/             design exploration (owned by the design phase)
```

## Line endings

The repository pins LF through `.gitattributes`. Generated-file drift checks and
the docs example rewriter compare text byte for byte, so on Windows run
`git config core.autocrlf false` (or re-checkout with
`git add --renormalize . && git checkout -- .`) if a clone was made before the
attributes file existed.

## Commands

Run from the repository root:

| Command             | What it does                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| `pnpm install`      | Install every workspace                                                 |
| `pnpm build`        | Build the packages, then the apps, then the consumer fixtures           |
| `pnpm test`         | Run the unit tests                                                      |
| `pnpm typecheck`    | Type-check every workspace (after a build — apps consume built types)   |
| `pnpm lint`         | ESLint across the repository                                            |
| `pnpm format:check` | Prettier, check only (`pnpm format` writes)                             |
| `pnpm check`        | Everything above, in the order CI runs it                               |
| `pnpm check:mfe`    | Build and run the micro-frontend harness (browser, not part of `check`) |
| `pnpm clean`        | Remove build output                                                     |

Upgrading the library Tecton is built on is one command:

| Command                                  | What it does                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm upgrade-astryx --to <version>`     | Move the whole repository to a new upstream release, end to end            |
| `pnpm upgrade-astryx --to <v> --dry-run` | Report what that release would change, touching nothing                    |
| `pnpm snapshot:astryx`                   | Re-pin `scripts/astryx-snapshot/` — the inventories a report diffs against |

It bumps every pin and the `pnpm patch` key, installs, runs the upstream
codemods, rebuilds the theme and the token manifest, writes
`docs/engineering/upgrades/<old>-to-<new>.md`, and runs both checks. It never
commits. A failed patch stops it, loudly, with the recovery procedure printed:
read `docs/engineering/upgrading-astryx.md` before running it.

Per workspace, for example:

```bash
pnpm --filter @tecton/react build
pnpm --filter @tecton/react test
pnpm --filter @tecton/docs dev
```

`pnpm check` also runs five guards:

| Guard                                                 | Fails when                                                                                                                                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `scripts/check-consumer-surface.mjs`                  | the upstream library's name reaches any published subpath's declarations — an exported name, a type alias's right-hand side, or a doc comment                                                    |
| `scripts/check-docs-drift.mjs`                        | a component has no doc, a documented prop does not exist, a declared prop is undocumented, or an example is missing or does not compile                                                          |
| `scripts/check-docs-site.mjs`                         | a component has no page on the docs site, an example is rendered by no page or by two, a guide is missing from the sidebar, a foundations source has moved, or a page is not in the search index |
| `packages/react/scripts/generate-palette.mjs --check` | the generated colour palette has drifted from `tokens/tecton.tokens.json`                                                                                                                        |
| `packages/react/scripts/generate-icons.mjs --check`   | the generated icon components have drifted from `design/icons/tecton/`                                                                                                                           |

`pnpm check:mfe` builds `fixtures/consumers/mfe-harness` — two independently
built versions of `@tecton/react` on one page — and asserts the multi-version
mitigations in Chromium. It is deliberately separate from `pnpm check`: it
rebuilds the package a second time and launches a browser. Read
`docs/engineering/micro-frontends/README.md` before shipping Tecton into a
micro-frontend.

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
page, the written guides, the foundations printed from the built theme, a page
per component with every example running and its source beside it, the icon
gallery, the page templates and the changelog — built on fumadocs and Next.js,
exported as static HTML, and generated from the package itself. See
`docs/engineering/docs-site.md`.

- `docs/engineering/component-mapping.md` — every component, what it is built
  on, how its props map, and where Tecton's design and the upstream model
  disagree.
- `docs/engineering/build-pipeline.md` — how the package is built.
- `docs/engineering/upgrading-astryx.md` — how the repository moves to a new
  upstream release, what the report says, and what to do when the patch stops
  applying. Two worked examples are in `docs/engineering/upgrades/`.
- `docs/engineering/micro-frontends/README.md` — what a host shell must do when
  several Tecton versions share a page, and what is unsupported.
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
- **A nested provider can publish a toast viewport after all.** The Phase 3
  design gave the page one viewport, owned by the first `scope="root"`
  provider — but the recommended host shape has no root provider anywhere, so
  toasts queued for ever in exactly the shape the documentation recommends. The
  toast bus now lets the first `scope="nested"` provider stand in, and hand
  over to a `scope="root"` provider if one mounts. The record gained one
  optional method (`requestStandIn`) and its version went to 2; version 1
  readers are unaffected, and a version 2 reader that finds a version 1 record
  simply never stands in.

### Phase 4

- **The `/preview/theme` gallery is gone, with the upstream dependency it
  needed.** `apps/docs` no longer depends on the component library underneath
  Tecton in any form; the site is built from `@tecton/react` alone.
- **The site is generated, not written.** `apps/docs/content` and
  `apps/docs/src/generated` are both build output and both gitignored; the only
  authored content is the nine guides under `apps/docs/guides`.
- **Examples run in the reader's browser, not during the build.** The export is
  static, so each example ships as its own dynamic import and mounts after
  hydration — which is why an example on the site is the running component
  rather than a picture of one.

### Phase 2

- **`tectonTheme` is exported as an opaque handle, not as the theme object.**
  The object's shape is an upstream type, so publishing it would have put the
  upstream name in `@tecton/react/theme`'s declarations. `@tecton/react/theme`
  is now `src/theme/public.ts`, which exports `tectonTheme: TectonTheme` — a
  Tecton interface with one member, `name`. `src/theme/index.ts` stays as the
  package-internal barrel `TectonProvider` reads the real object through.
- **Tecton's Badge is the standalone pill, not the overlay.** The design has
  both; the overlay (anchored to a child, count capped at "99+") is a different
  component and is not built. `Chip` is the interactive sibling.
- **Text fields ship the outlined appearance only.** The design's filled and
  text-only field appearances have no variant axis upstream. `Select` is the
  exception: its `appearance` prop offers `textOnly`, because the upstream
  selector has a borderless variant and the panel designs use it inline.
- **`Accordion` has no header action row.** The design puts icon buttons in the
  header; the trigger upstream is one button, and nesting buttons inside it is
  not something assistive technology handles. Recorded in the component's docs.
- **Four font weights are exposed, two exist.** `Text`, `Heading` and `Link`
  take `regular | medium | semibold | bold`. The Tecton foundation defines 400
  and 500, so `semibold` and `bold` resolve to the heaviest weights the theme
  carries — 500 and 600 today.
- **`src/theme/augmentations.d.ts` declares the theme's type augmentations.**
  The theme compiler emits four of them into `dist/`, but not the custom `Text`
  types, and `src/` has to type-check before a build has run. The file is
  internal and is not emitted.
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
