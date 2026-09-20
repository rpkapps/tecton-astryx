# Changelog

All notable changes to `@tecton/react`. Dates are the date the work landed on
the release branch; the package is not published yet, so nothing here has a
version behind it apart from the one in `package.json`.

## Unreleased

### The whole component surface

Tecton went from 48 components to **180** — one for every component the library
underneath it publishes, and then some.

- **132 new components**, in every family the system has: `AppShell`,
  `Calendar`, `Carousel`, `CommandPalette` and its six parts, `ContextMenu` and
  its five, the fifteen `Chat*` components the AI panel needs, `DateInput`,
  `DateRangeInput`, `DateTimeInput`, `FileInput`, `FormLayout`, `HoverCard`,
  `Layout` and its four regions, `Lightbox`, `Markdown`, `MetadataList`,
  `MobileNav`, `MultiSelector`, `NumberInput`, `Outline`, `OverflowList`,
  `Overlay`, `Pagination`, `Popover`, `PowerSearch`, `ScrollableArea`,
  `SideNav` and its four parts, `Skeleton`, `Stepper`, `Table`'s six
  subcomponents, `TimeInput`, `Timestamp`, `Tokenizer`, `Toolbar`, `TopNav` and
  its six, `VisuallyHidden` and the rest.
- They are **pass-throughs**: published under Tecton names, typed with
  Tecton-named types, refs forwarded, `displayName` set, and every icon-shaped
  prop widened to take a Tecton glyph name as well as whatever it already took.
  Nothing else about them changed, so a team can use one today and get the
  designed version later without touching the import.
- They are **generated** from `wrappers.manifest.json` by
  `scripts/generate-wrappers.mjs`, which emits the wrapper, its documentation,
  a smoke test, the export block and the package's `exports` map. `--check`
  runs in the build and in `pnpm check`, so an upstream upgrade that moves a
  prop is a build failure with a diff rather than a stale doc.

### Four providers

`LinkProvider`, `LocaleProvider`, `SurfaceTheme` and `CodeTheme` join
`TectonProvider` under a new **Providers** category.

### Helpers, hooks and data types

New: `@tecton/react/support`, also re-exported from the package root. It
publishes the half of the surface that is not a component — a table's sorting,
filtering, grouping and pagination hooks, ISO date types, an autocomplete
source, a power-search configuration, the code-theme presets — under Tecton
names. Every line of it is an alias rather than a re-export, so no upstream
declaration file reaches a consumer's editor.

### Examples and page templates

- **502 examples and page templates ported** from upstream's example blocks,
  translated rather than copied: imports, component names, props and glyphs all
  go through the same tables the wrappers are generated from.
- New: `@tecton/react/templates`, which publishes the page templates so a
  documentation site can render the gallery from the same code a consumer would
  paste.
- Every example and every template is rendered under `TectonProvider` in the
  test suite. `docs/engineering/ported-examples.log` records every substituted
  glyph, every prop dropped in translation and every file that could not be
  ported, with the reason.

### Button gains `destructive`

`variant="destructive"` is an **addition** to the design's five-step emphasis
ladder. The design draws no such button, but the theme already colours one, and
a delete that reads the same as a save is a defect rather than a restraint. It
is the one variant that carries meaning rather than weight: use it for an
action that cannot be undone, and only once in a view.

### Renames forced by the existing surface

Nothing that shipped was renamed. Where a new component's obvious name was
already taken by a designed component's data type, the new one bent:
`MenuActionItem`, `MenuSeparator`, `SelectChoice`,
`ToggleButtonGroupSegment`, `FieldMessage`, `ItemRow`, `ToggleButtonBar`.
`docs/engineering/component-mapping.md` lists each one and why.

### Guards

- `pnpm check` gained `wrappers:check` and `readme:check`; the package build
  gained both as steps 0c and 0d.
- The documentation drift guard now reads both halves of the barrel and fails
  on a component directory the barrel does not export. It got stricter, not
  looser.
- The README's component table is generated from the components' own
  documentation by `scripts/generate-readme.mjs`.
