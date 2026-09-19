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

`pnpm check` also runs `scripts/check-consumer-surface.mjs`, which fails if the
name of the upstream component library leaks into the consumer-facing surface.

Requires Node >= 22 and pnpm 10.33.

## Status

Phase 1: repository skeleton and a verified build pipeline. The theme, the
component set and the documentation site are placeholders that later phases
replace. See `docs/engineering/build-pipeline.md`.

## Deviations

Choices that differ from the phase-1 brief, and why.

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
- **`src/theme/tecton.ts` is a placeholder** that re-exports the source theme;
  in `dist/` the generated built theme module replaces it. Tests therefore
  exercise the runtime theme, while consumers always get the built one.
