# tecton-astryx

The monorepo for **Tecton**, a React design system: one package for consumers,
one stylesheet, one provider.

## Layout

```
packages/react/              @tecton/react — the published package
apps/docs/                   @tecton/docs — documentation site (private)
fixtures/consumers/vite-app/ a minimal consumer, built in CI to prove the surface
scripts/                     repository-level tooling
docs/engineering/            how the pipeline works
design/, tokens/             design exploration (owned by the design phase)
```

## Commands

Run from the repository root:

| Command             | What it does                                                          |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm install`      | Install every workspace                                               |
| `pnpm build`        | Build the packages, then the apps, then the consumer fixtures         |
| `pnpm test`         | Run the unit tests                                                    |
| `pnpm typecheck`    | Type-check every workspace (after a build — apps consume built types) |
| `pnpm lint`         | ESLint across the repository                                          |
| `pnpm format:check` | Prettier, check only (`pnpm format` writes)                           |
| `pnpm check`        | Everything above, in the order CI runs it                             |
| `pnpm clean`        | Remove build output                                                   |

Per workspace, for example:

```bash
pnpm --filter @tecton/react build
pnpm --filter @tecton/react test
pnpm --filter @tecton/docs dev
```

`pnpm check` also runs four guards:

| Guard                                                 | Fails when                                                                                                                                    |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/check-consumer-surface.mjs`                  | the upstream library's name reaches any published subpath's declarations — an exported name, a type alias's right-hand side, or a doc comment |
| `scripts/check-docs-drift.mjs`                        | a component has no doc, a documented prop does not exist, a declared prop is undocumented, or an example is missing or does not compile       |
| `packages/react/scripts/generate-palette.mjs --check` | the generated colour palette has drifted from `tokens/tecton.tokens.json`                                                                     |
| `packages/react/scripts/generate-icons.mjs --check`   | the generated icon components have drifted from `design/icons/tecton/`                                                                        |

`node scripts/capture-fidelity.mjs` screenshots the theme gallery at
`/preview/theme` in both colour modes into `docs/design/fidelity/`; the renders
are read alongside the design captures in `docs/design/fidelity-report.md`.

Requires Node >= 22 and pnpm 10.33.

## Status

Phase 2: the consumer-facing component surface. 47 components and the `useToast`
hook, each with its documentation, its examples and its tests; the 131 Tecton
glyphs generated from the design delivery; and two new drift guards. The
documentation site still renders from generated data rather than a real site —
Phase 4 builds that.

- `docs/engineering/component-mapping.md` — every component, what it is built
  on, how its props map, and where Tecton's design and the upstream model
  disagree.
- `docs/engineering/build-pipeline.md` — how the package is built.
- `docs/design/fidelity-report.md` — what survived the port from the design, what
  was approximated, and what could not be expressed. Read its open questions.
- `docs/design/light-mode.md` — Tecton is designed dark; this is how light mode
  is derived and where the derivation is weak.

## Deviations

Choices that differ from the briefs, and why.

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
- **The `/preview/theme` page declares those augmentations for itself.** It
  drives the upstream components directly, so it is not a consumer and cannot
  reach them through Tecton. Phase 4 removes the page.
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
- **`apps/docs` depends on the upstream component library as a devDependency.**
  The temporary `/preview/theme` gallery renders components Tecton does not wrap
  yet, so it imports them directly. That one route is the only place in the
  repository outside `packages/react/src` that does; Phase 4 removes it.
- **`src/theme/tecton.ts` is a placeholder** that re-exports the source theme;
  in `dist/` the generated built theme module replaces it. Tests therefore
  exercise the runtime theme, while consumers always get the built one.
