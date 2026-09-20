# Registry verification

`pnpm verify:registry` publishes `@tecton/react` to a real npm registry running
on this machine and then installs it the way a consumer would — with `npm`,
from a tarball the registry served, into applications that are not part of this
workspace. It ends by putting **two published versions on one page** and
driving them in Chromium.

It is not part of `pnpm check`: it publishes, installs over the network and
launches a browser. Run it before a release, and after anything that changes
what the package ships — `files`, `exports`, the vendored upstream library, the
dependency list, or the build's output layout.

```bash
pnpm verify:registry              # the whole thing, ~75 s
pnpm verify:registry --no-build   # reuse packages/react/dist as it is
pnpm verify:registry --keep       # leave the registry running for poking at by hand
```

## Why it exists

Everything else in this repository reads the package through the workspace.
`pnpm check` builds `fixtures/consumers/vite-app` with `@tecton/react`
symlinked into place; `pnpm check:mfe` derives its second "version" by editing
a copy of `dist/`. Both are useful, and neither one exercises the part a
consumer actually experiences:

| Only publishing exercises this      | What goes wrong without it                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `files` in `package.json`           | a file the build emits is simply absent from the tarball; the symlink still had it                                                    |
| `exports` resolved from a tarball   | a subpath that works through a symlinked source tree 404s from `node_modules`                                                         |
| the dependency tree npm resolves    | a `dependency` that should have been a `peerDependency`, or an upstream package installed as a package of its own instead of vendored |
| two versions genuinely side by side | the multi-version mitigations tested against two copies npm installed, not two copies a fixture derived                               |

A symlink hides all four.

## What it does

1. **Starts a throwaway Verdaccio** on a free port, with empty storage under
   `node_modules/.cache/verdaccio/` and an npmjs uplink, so the consumers'
   own dependencies (React, Vite, esbuild…) resolve normally through it. A
   registry left running on the conventional port `4873` from an earlier
   session is detected and deliberately **not** reused — its storage may
   already hold a different build under the same version, and publishing over
   it would fail.

2. **Builds and publishes two versions.**

   - **A** is `packages/react` exactly as it builds, at whatever version
     `packages/react/package.json` says.
   - **B** is the same build with the patch version bumped, `--color-accent`
     retuned to a visibly different colour, and one per-component decision
     moved with it: the corner Tecton gives a `Banner` with
     `container="card"`, from the control radius (`--radius-element`, 4px) to
     the page radius (`--radius-page`, 16px). Both are plain declarations in
     the built theme CSS — Tecton is a theme, so its per-component overrides
     ship the same way its tokens do — which is what a rebuild from changed
     source produces. The script reads the declared value out of the built CSS
     rather than hard-coding it, and fails loudly if it is gone.

   Both are staged as **copies** under `node_modules/.cache/verdaccio/`.
   Nothing under `packages/react/` is modified, and the script asserts that.

3. **Consumer 1 — `fixtures/consumers/registry-vite-app/`.** A Vite + React 19
   application whose `package.json` depends on `@tecton/react` at version A.
   The script writes a temporary `.npmrc` pointing at the local registry, wipes
   `node_modules` and the lockfile, and runs `npm install` — **npm, not pnpm**,
   because a plain consumer is the thing under test — then `npm run build`.
   It asserts:

   - the install resolved the published tarball at version A;
   - **no `@astryx…` directory exists anywhere under `node_modules`** — the
     upstream library is vendored inside the package, so a consumer installs
     one name and cannot end up with an unpatched copy of it;
   - the built CSS carries the `[data-astryx-theme=tecton]` theme scope
     (quoted or not — the consumer's own minifier decides);
   - the built JS carries both upstream patch markers,
     `@astryxdesign/core/scroll-lock/v1` and
     `@astryxdesign/core/layer-stack/v1`, so the patches really travelled
     inside the tarball;
   - and, in Chromium against the built page, that the provider claimed the
     document root and a primary Button's computed background is the theme's
     accent token resolved for the page's colour mode.

4. **Consumer 2 — `fixtures/consumers/registry-mfe-page/`.** The page shape
   [`micro-frontends/README.md`](./micro-frontends/README.md) §1 recommends,
   built out of two registry installs:

   ```json
   "tecton-a": "npm:@tecton/react@<A>",
   "tecton-b": "npm:@tecton/react@<B>"
   ```

   `react` and `react-dom` are aliased the same way, so neither container is
   served a hoisted shared React. Each container is bundled into its own IIFE
   with `external: []`, so each carries its own module instances. The host page
   links exactly one `tokens.css` — version B's, the newest it knows about —
   plus one `components.css` per container, calls `configureTectonRoot()`
   before anything mounts, and mounts both containers `scope="nested"`.

   In Chromium it asserts:

   - both containers render, and each bundle reports the version it actually
     resolved out of `node_modules`;
   - both containers resolve the **host's** accent — version B's — because
     there is one theme layer on the page;
   - both containers take the **host's** banner radius, for the same reason
     they take its accent: Tecton's per-component decisions live in the theme
     layer beside its tokens, under one theme name, so the host's single
     `tokens.css` decides them for every container;
   - the shell owns the document root and the root registry counts three
     holders;
   - opening a Dialog in A and then in B and closing them in order leaves the
     body scrollable — **one scroll lock shared by two separately installed
     copies** (upstream patch 1);
   - one Escape closes only the layer on top, the next closes the one
     underneath (upstream patch 2);
   - toasts raised by both versions land in one viewport.

5. **Tears down**: kills the registry's process group, restores both fixtures'
   `package.json` pins and removes the temporary `.npmrc` files, deletes the
   cache directory, prints a table and exits non-zero on any failure. The
   teardown runs on failure too. What it deliberately leaves behind is each
   fixture's `node_modules`, `package-lock.json` and `dist` — all three are
   git-ignored, the next run wipes them before installing anyway, and leaving
   them means a failed run can be opened and read afterwards.

## The two fixtures

Both live under `fixtures/consumers/` and are both **excluded from the pnpm
workspace** by a negated glob in `pnpm-workspace.yaml`:

```yaml
- 'fixtures/consumers/*'
- '!fixtures/consumers/registry-*'
```

That exclusion is load-bearing twice over. Their dependencies are registry
version ranges that only exist while the verification registry is running, so
`pnpm install` at the root would fail to resolve them; and a workspace member
would have `@tecton/react` **linked** rather than installed, which is precisely
what they exist not to do. Nothing builds them except this script — not
`pnpm build`, not `pnpm check`, not CI.

Their checked-in `package.json` files pin concrete versions (`0.1.0`, `0.1.1`)
as documentation. The script rewrites those pins to what it actually published
and restores the files before it exits, so the pins never need updating by hand
when the package's version moves.

## Reading a failure

The script reports **every** check it can rather than stopping at the first
one, so the table is the diagnosis. Some common shapes:

| Symptom                                                   | Usually means                                                                                                                                              |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Verdaccio is serving` fails                              | read `node_modules/.cache/verdaccio/registry/verdaccio.log`; usually npx could not fetch verdaccio, or the uplink is unreachable                           |
| `npm install resolved the published tarball` fails        | `files` or `exports` in `packages/react/package.json`, or a publish that silently shipped nothing                                                          |
| `no @astryxdesign package anywhere in node_modules` fails | the upstream library escaped into `dependencies`; it must stay vendored (see `upstream-patches.md`)                                                        |
| a patch marker is missing from the built JS               | the build stopped vendoring the patched library, or tree-shaking dropped it — the fixture renders a Dialog and a Menu precisely so it cannot be shaken out |
| a `consumer-2` layer or toast check fails                 | a multi-version mitigation regressed; `pnpm check:mfe` asserts the same behaviours against derived versions and is the faster place to debug it            |

`--keep` leaves the registry running and both fixtures installed and built, so
the failing page can be opened by hand.

## What it does not cover

- **The real npm registry.** Verdaccio is API-compatible, not identical;
  publish-time policy (2FA, provenance, access) is out of scope.
- **Other package managers.** `npm` is the consumer under test because it is
  the one that resolves nothing like pnpm does. Yarn and Bun consumers are not
  covered.
- **Mixed upstream majors.** Version B is derived from version A's build, so
  the two always share an upstream major — which is the only configuration
  `micro-frontends/README.md` §3 supports anyway.
- **Publishing this repository's other packages.** Only `@tecton/react` is
  published; it is the only public one.
