# registry-mfe-page

Two **published** versions of `@tecton/react` on one page, both installed from
a registry with `npm`, each bundled into its own IIFE with its own React.

This is the same page shape as `fixtures/consumers/mfe-harness/` and asserts the
same multi-version behaviour, with one difference that is the entire point:
the harness _derives_ its second version by editing a copy of `dist/`, while
this fixture installs two versions that were really published to a registry and
really resolved by npm:

```json
"tecton-a": "npm:@tecton/react@<A>",
"tecton-b": "npm:@tecton/react@<B>"
```

`react` and `react-dom` are aliased the same way (`react-a`, `react-b`, …) so
neither container is served a hoisted shared React.

The host page links exactly one `tokens.css` — version B's, the newest it knows
about — plus one `components.css` per container, calls `configureTectonRoot()`
before anything mounts, and mounts both containers `scope="nested"`: the shape
`docs/engineering/micro-frontends/README.md` §1 recommends.

It is deliberately **outside the pnpm workspace** (see the negated glob in
`pnpm-workspace.yaml`), because its dependencies are registry versions that
only exist while the verification registry is running.

Driven by `pnpm verify:registry` (`scripts/verify-registry.mjs`), which
publishes both versions, rewrites the two pins to what it published, installs,
builds and drives the page in Chromium, then restores `package.json`.
