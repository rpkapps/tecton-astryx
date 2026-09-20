# Changelog

All notable changes to `@tecton/react`. Dates are the date the work landed on
the release branch; the package is not published yet, so nothing here has a
version behind it apart from the one in `package.json`.

## Unreleased

### Tecton is a theme

The package no longer publishes components of its own. It publishes the
component system it is built on — every name, every prop, every type, every
module, unchanged — and applies the Tecton theme to it.

**This replaces everything the previous entry described.** The 48 hand-written
components with Tecton-invented APIs and the 132 renamed pass-through wrappers
are gone. So is `@tecton/react/support`, `@tecton/react/templates`, the
name-based `<Icon name>` component and the `wrappers.manifest.json` that
generated half of it.

What you write instead is the component system's own API:

```tsx
// before
<Button label="Save" variant="primary" icon="add" />
<TextField label="Name" value={name} onChange={setName} startIcon="search" />
<Panel title="Horizons" actions={<Badge label="2" variant="info" />}>…</Panel>

// now
<Button label="Save" variant="primary" icon={<Icon icon={AddIcon} />} />
<TextInput label="Name" value={name} onChange={setName} startIcon={SearchIcon} />
<Card><VStack gap={3}><Heading level={2}>Horizons</Heading>…</VStack></Card>
```

There is no migration table, because there is no mapping: look the component up
in its own documentation and use it as documented.

### What the package publishes

- **The root** re-exports every one of the component system's 496 named
  exports, by the same reference, plus `TectonProvider`,
  `configureTectonRoot`, `tectonTheme`, `tectonIcons`, `tectonToken` and
  `tecton`. Nothing is renamed and nothing is shadowed.
- **118 subpaths**, one per module the component system publishes, at the same
  path: `@tecton/react/Button`, `@tecton/react/Layout`,
  `@tecton/react/hooks`, `@tecton/react/Table/utils`, `@tecton/react/i18n`.
  They are generated from its own `exports` map and drift-checked in the build.
- **`@tecton/react/theme`** now carries the theme runtime (`Theme`,
  `defineTheme`, `useTheme`, the token variable maps) as well as Tecton's own
  theme API, so nothing about theming is unreachable.
- **`@tecton/react/theme/tokens.stylex`** and **`@tecton/react/locales/*.json`**
  are published for applications that write StyleX against the token variables
  or load a message catalogue.
- **`@tecton/react/icons`** is the 131 Tecton glyph components,
  `tectonIconNames` and `tectonIconRegistry`. The `<Icon name="…">` wrapper is
  gone; the component system's own `Icon` is at `@tecton/react/Icon`.
- The five stylesheet entry points are unchanged.

### What Tecton still is

The theme, and nothing else: the palette, the type scale, the radii, the
per-component overrides and the icon registry, plus `TectonProvider`, which
installs them. Token values did not change.

The theme's **custom variants** are now published as declarations, so
`variant="outlined"`, `variant="text-only"`, `Banner` `status="neutral"`,
`Badge` `variant="lime"` and the eight Tecton text types (`mediumStrong`,
`smallStrong`, `tiny`, `largeData`, `mediumData`, `smallData`, `actionMedium`,
`actionSmall`) type-check in your editor. They are extra values for props the
components already have — theme extensions, not new components.

### Toasts

`useToast` is the component system's own hook, with its own `ToastOptions`.
Tecton's data-only `useToast` and the document-keyed bus that routed its
payloads across copies of the package are gone with the rest of the invented
surface: the upstream toast body is a `ReactNode`, and an element built by one
copy's React cannot be rendered by another's. On a page running several copies
of `@tecton/react`, each copy now shows its own toasts in its own viewport.

Everything the **root registry** owns is unchanged: the page's colour mode and
theme name, the first-owning-claim rule, and the guarantee that a container
unmounting does not blank the page for the ones still on it.

### Micro-frontends: one thing to know

Every rule Tecton ships is now in `@layer astryx-theme` under
`[data-astryx-theme="tecton"]`, including its per-component overrides. Tecton
used to have a second layer of its own component CSS, where a StyleX class name
hashed the declaration so each version kept its own. It does not any more. So a
per-component decision is a **cross-version contract** in exactly the way a
token is: two versions on one page resolve it by source order, for every
container. `docs/engineering/micro-frontends/README.md` has the consumer rules;
the recommended shape — one `tokens.css` from the host, `components.css` per
container, `scope="nested"` — is unchanged and still the answer.

### Guards

- `wrappers:check` and `docs:check` are gone. `modules:check` replaces the
  first: it regenerates the subpath modules and the `exports` map in memory and
  fails on any difference.
- `readme:check` now generates the README's module list from the package's own
  `exports` map.
- The build **scrubs the vendored declarations** of the upstream name, in
  comments and import specifiers only — never a string-literal type, never an
  identifier, never a `.js` file. Five exported string constants survive it
  because the stylesheet and the runtime are built on their values; they are
  listed in `scripts/check-consumer-surface.mjs` with a reason each, and an
  exception that stops matching fails the check.
- The build now verifies that **every** `exports` target resolves, not only the
  stylesheets.
