# `@tecton-fixture/mfe-harness`

Two independently built versions of `@tecton/react` on one page, driven by
Playwright. It is the executable half of
[`docs/engineering/micro-frontends/`](../../../docs/engineering/micro-frontends/):
`analysis.md` measured the failure modes, `README.md` states the model, and
this fixture keeps the mitigations honest.

```bash
pnpm check:mfe                                    # from the repository root
pnpm --filter @tecton-fixture/mfe-harness build   # just the build (~10 s)
pnpm --filter @tecton-fixture/mfe-harness test:e2e
```

`check:mfe` is a **separate** root script. It is not part of `pnpm check`: it
rebuilds the package a second time and launches a browser, neither of which the
rest of the check needs.

Chromium is expected to be installed already — `PLAYWRIGHT_BROWSERS_PATH`
points at it. **Never run `playwright install`.**

## What it builds

```
scripts/build.mjs        builds @tecton/react, then derives two versions
  dist/versions/tecton-a/   @tecton/react 0.1.0 — the build as it is
  dist/versions/tecton-b/   @tecton/react 0.2.0 — retuned tokens + banner radius
  dist/host/container-a.js  own React + own @tecton/react 0.1.0 (IIFE)
  dist/host/container-b.js  own React + own @tecton/react 0.2.0 (IIFE)
  dist/host/host-shell.js   the shell's own copy of Tecton (version B)
  dist/host/css/*.css       each version's entry points
  dist/host/mfe-page.html   the host shell

scripts/serve.mjs        static server for dist/host (Playwright starts it)
tests/mfe.spec.ts        the assertions
```

Everything generated lands in `dist/`, which is git-ignored. Nothing outside
this fixture is written.

Each container renders a panel and a card `Banner` (what the styling assertions
read) plus the three things that used to fight across containers: a modal
`Dialog`, a `Menu` (a dismissible layer) and a button that raises a toast. The
dialog and the menu are controlled and driven through the container's
imperative handle — `window.__mfe.a.openDialog()`, `.openMenu()`,
`.closeDialog()` — because a modal belonging to one container covers the other
container's buttons, which is a real page's problem but not one a test should
click its way through.

The two versions differ in exactly four places, so every difference is
attributable:

|                           | A (0.1.0)                | B (0.2.0)              |
| ------------------------- | ------------------------ | ---------------------- |
| `--color-accent`          | the Tecton theme's       | `#b8336a` / `#ff5fa2`  |
| `--color-background-body` | the Tecton theme's       | `#fdf3f8` / `#2a0d1c`  |
| `--color-background-surf` | the Tecton theme's       | `#ffe9f2` / `#3d1329`  |
| card `Banner` corner      | `--radius-element` (4px) | `--radius-page` (16px) |

Both keep the theme **name** `tecton`, which is the strategy under test.

**Version B is derived from A's `dist/`, not rebuilt from patched source.** The
investigation harness patched `packages/react/src` in place and restored it
afterwards; a fixture should not need that much trust in a `finally` block. The
result is the same page: since Tecton is a theme, everything it decides —
tokens and per-component overrides alike — is a plain declaration in the built
theme CSS, inside `@layer astryx-theme` under the theme's own `@scope`. The
build script reads the banner's declared corner out of `tecton.css` rather than
hard-coding it (`--_banner-radius: var(--radius-element)` →
`var(--radius-page)`) and fails loudly if the declaration is gone, so a theme
change that retires the knob breaks the build rather than the assertions.

## Driving the page

`dist/host/mfe-page.html` reads its configuration from the query string:

| parameter           | values                              | effect                                        |
| ------------------- | ----------------------------------- | --------------------------------------------- |
| `styles`            | `full`, `no-reset`, `split`, `none` | which entry points are linked                 |
| `css`               | `ab` (default), `ba`                | stylesheet `<link>` order                     |
| `mount`             | `ab` (default), `ba`                | mount order                                   |
| `modeA` / `modeB`   | `dark` (default), `light`, `system` | each container's colour mode                  |
| `scopeA` / `scopeB` | `root`, `nested`                    | each container's `TectonProvider` scope       |
| `hostRoot`          | `1`                                 | the shell calls `configureTectonRoot()` first |
| `hostMode`          | `dark` (default), `light`           | ...in this mode                               |
| `only`              | `a`, `b`                            | load and mount a single container             |
| `autoMount`         | `0`                                 | load the bundles, mount nothing               |

At runtime: `window.__mfe.mount('a', {mode, scope})`, `window.__mfe.unmount('b')`,
`window.__mfe.host.configureRoot({mode})`, and the shared registry itself at
`document[Symbol.for('tecton.rootOwnership/v1')].inspect()`.

`styles=split` is the recommended shape: one `tokens.css` (version B's, the
newest the shell knows about) plus one `components.css` per container, and the
containers mount with `scope="nested"`.

## What the spec asserts

| #   | Assertion                                                                                                                                                                                                                                                                                                                                                                | Status     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 1   | The `<html>` attributes survive a sibling container unmounting, and the registry reports the re-assertion that did it; the last container out still leaves the page clean                                                                                                                                                                                                | mitigation |
| 2   | The **first** owning claim decides the page mode in either mount order, and a shell that called `configureTectonRoot()` beats both containers; each container keeps its own mode inside its own wrapper                                                                                                                                                                  | mitigation |
| 3   | `styles-no-reset.css` leaves the host's own `<h1>` byte-identical to a page with no Tecton CSS at all, while the container it serves stays completely themed                                                                                                                                                                                                             | mitigation |
| 4   | With the split entry points both containers resolve the host's tokens, their component styles stay their own, every sheet declares the same layer order, and a container leaving does not take the root away                                                                                                                                                             | mitigation |
| 5   | With two complete bundles the **last-loaded** theme wins for every container, in both load orders; component styles stay version-safe; the layer statement fixes the order regardless of arrival                                                                                                                                                                         | recorded   |
| 6   | A modal in each container shares **one** scroll lock: closing the first leaves the body pinned, and only the last one out restores it — in either closing order, with the scroll position intact                                                                                                                                                                         | patch      |
| 7   | One Escape dismisses the layer that is **on top**, whichever container opened it: a menu over the other container's dialog goes first, the dialog next — and the same with the containers swapped                                                                                                                                                                        | patch      |
| 8   | Toasts raised by both containers land in **one** viewport: with two `scope="root"` providers, in the split shape where one container is root and the nested one has no viewport of its own, and in the recommended shape where **every** container is nested and the first one stands in — including when that container unmounts and the next one picks the viewport up | mitigation |

Rows 6 and 7 assert the two upstream patches
(`docs/engineering/upstream-patches.md`), which reach the page because the
patched library is vendored into `@tecton/react`. Three of those four
assertions fail against unpatched code (verified by vendoring the unpatched
modules and re-running); the fourth — the swapped-containers Escape case —
passed before the patch **by luck**, because the copy that attached its listener
first happened to own the top layer, and it is kept for exactly that reason.

Row 5 is deliberately not a fix. Under one theme name two sheets put their
tokens in the same layer under the same `@scope`, so source order decides — and
it decides for every container, including ones nobody redeployed. The mitigation
is the split of row 4 plus the load-order rule in the guide, not a wrapper-side
trick.

One thing changed since `analysis.md` was written: the Tecton theme now
overrides the complete token set, and the build's token-coverage manifest keeps
it that way, so there are no longer any _uncontested_ tokens for a wider version
to win by default (F3). The spec asserts that too — both containers' surface
colour moves together with the load order.

## If something looks wrong

- **Everything is unstyled** — `dist/host/css` is missing; run the build.
- **`Rollup failed to resolve "@tecton/react"`** — the build derives the two
  versions before bundling; run `scripts/build.mjs` rather than `vite build`
  directly.
- **`process is not defined` in the page** — `containers/vite.config.mjs` lost
  its `define`; library mode does not substitute it and React's build reads it.
- **A colour assertion is off by a blend** — a CSS transition was caught
  mid-flight; the spec waits 250 ms after mount for exactly this reason.
