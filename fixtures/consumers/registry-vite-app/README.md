# registry-vite-app

A plain consumer of `@tecton/react` **installed from a registry** with `npm`,
not linked from the workspace. It is driven by `pnpm verify:registry`
(`scripts/verify-registry.mjs`), which starts a local Verdaccio, publishes the
package into it, writes a temporary `.npmrc` here, and runs `npm install` and
`npm run build` in this directory.

It is deliberately **outside the pnpm workspace** (see the negated glob in
`pnpm-workspace.yaml`): its `@tecton/react` dependency is a registry version
range, and a workspace member would have it linked instead — which is exactly
the thing this fixture exists not to do.

`package.json` pins the version the verification script publishes as version A;
the script rewrites the pin to whatever `packages/react/package.json` currently
says and restores the file afterwards, so the checked-in pin is documentation
rather than a thing to keep in sync by hand.

Nothing here is built by `pnpm build`, `pnpm check` or CI. Run it with:

```bash
pnpm verify:registry
```
