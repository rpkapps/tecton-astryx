# The documentation site

`apps/docs` is the Tecton docsite: a landing page, nine written guides, seven
foundations pages, a page for every module the package publishes, 53 page
templates, and the changelog. It is a [fumadocs][] site on Next.js 16, exported
as static HTML.

Three things about it are worth knowing before anything else.

**Almost none of it is written.** The only authored content in the app is the
nine guides under `apps/docs/guides`. Every component page — its prose, its
props, its anatomy, its best practices, its accessibility requirements, its
theming targets — is printed at build time from the documentation objects that
ship inside the component system `@tecton/react` re-exports. A module added
upstream gains a page, a place in the sidebar and an entry in the search index
without a line changing here.

**The examples are the running components.** An example on a component page is
not a screenshot and not a re-implementation: it is the file under
`apps/docs/examples`, loaded and mounted in the reader's browser, with its
source shown verbatim in the Code tab. The two cannot drift, because they are
the same file.

**The site is a port, not an invention.** Its shape — the component page, the
gallery tile, the template gallery, the grouped sidebar — is ported from the
component system's own documentation site, which is MIT and credited in
`THIRD-PARTY-NOTICES.md` at the repository root. Where a file here is a port,
its header says which file it came from.

|            |                                                                             |
| ---------- | --------------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, `output: 'export'`, webpack)                        |
| Docs shell | `fumadocs-ui` and `fumadocs-core` 16, `fumadocs-mdx` 15                     |
| Styling    | Tailwind v4 (fumadocs requires it) over `@tecton/react/styles-no-reset.css` |
| Also       | StyleX, compiled through Babel, for the examples that use it                |
| Search     | Orama, exported as a static index                                           |
| Tests      | Playwright, against the static export                                       |

## Routes

| Route                      | What it is                                                                       |
| -------------------------- | -------------------------------------------------------------------------------- |
| `/`                        | Landing page: what Tecton is, the two snippets, the counts, and the live gallery |
| `/docs`                    | Index of everything, as tiles                                                    |
| `/docs/<guide>`            | The nine guides                                                                  |
| `/docs/foundations/<name>` | `colour`, `typography`, `spacing`, `shape`, `elevation`, `motion`, `icons`       |
| `/docs/components`         | The gallery: one 16:10 live tile per component, in category sections             |
| `/docs/components/<Name>`  | One page per module doc — 106 components and 38 hooks                            |
| `/docs/templates`          | The template gallery, filterable by category group                               |
| `/docs/templates/<slug>`   | One per page template: the whole page running, and its source                    |
| `/docs/changelog`          | The package's releases                                                           |
| `/api/search`              | The exported search index — a build artefact, not a server                       |

## Data flow

```
core/src/**/*.doc.mjs  ─┐   (229 docs + groups.doc.mjs, inside @tecton/react's
                        │    node_modules — the component system's own)
apps/docs/examples/**  ─┤
apps/docs/guides/*     ─┼─► apps/docs/scripts/generate-data.mjs ─┬─► apps/docs/content/docs/**
packages/react/dist/** ─┤                                        │     (MDX + meta.json)
design/foundations/*   ─┘                                        └─► apps/docs/src/generated/**
                                                                       (registries + loader maps)
```

`generate-data.mjs` runs first in `dev`, `build` and `typecheck`
(`pnpm --filter @tecton/docs generate` runs it alone). It reads:

- **the component docs** — every `.doc.mjs` under
  `packages/react/node_modules/@astryxdesign/core/src`, plus `groups.doc.mjs`.
  A doc with `subComponentOf` documents part of another component and becomes a
  props table on that component's page; every other doc becomes a page;
- **the examples** — `apps/docs/examples/components/<Dir>/<Name>.tsx` with its
  `<Name>.doc.mjs`, and `apps/docs/examples/pages/<slug>/page.tsx` with its
  `template.doc.mjs`;
- **the guides** — `apps/docs/guides/*.doc.mjs`;
- **the tokens** — `packages/react/dist/theme/{tokens,semantic,typography}.js`,
  `dist/icons/names.js` and the built stylesheets, plus
  `design/foundations/*.json` for the design's own descriptions. The package has
  to be built first, which is why `pnpm check` runs `build` before anything that
  reads `dist/`;
- **the changelog** — `packages/react/CHANGELOG.md`.

It writes two trees, both gitignored:

`apps/docs/content/docs/**` — the MDX fumadocs compiles, and the `meta.json`
files that list the pages. A component page is real MDX: its description, its
best practices and its keywords are Markdown, so search indexes them; its
tables, previews and playground are JSX elements resolving to the components
registered in `src/components/mdx.tsx`.

`apps/docs/src/generated/**` — typed modules the page components import:
`componentRegistry`, `exampleRegistry`, `templateRegistry`, `componentSidebar`,
`showcaseRegistry`, `eagerShowcases`, `guideRegistry`, `foundationData`,
`foundationPages`, `changelog`, `sitePages`, and the `exampleLoaders` /
`templateLoaders` maps of dynamic imports. `apps/docs/src/types/docs.ts` is the
hand-written contract they are typed against.

### Making the docs speak Tecton

Every string in every doc object is rewritten on the way in:
`@astryxdesign/core` → `@tecton/react`, `Astryx` → `Tecton`, `astryx` →
`tecton`. Three things survive verbatim, because a reader meets them exactly as
they are and a renamed one would match nothing:

- `@astryx.…`, the library's own i18n message ids, which an override is keyed
  on;
- `data-astryx-…`, the attributes the theme is scoped to;
- `astryx-…`, the class names and cascade-layer names the components carry —
  `astryx-button`, `astryx-base`, `astryx-theme` — which are what a
  `defineTheme` target and a hand-written selector both name.

`speakTecton()` in the generator is the whole of that rule, and
`scripts/check-docs-site.mjs` holds the same allowance: anything else naming the
library, on a generated page or in the exported HTML, fails the check.

## A component page

The order is the one the component system's own site reads in, flattened from
its tabs into a single page so that search and the table of contents see all of
it:

1. **the showcase**, as an example block — the preview, and its source a tab
   away;
2. **Usage** — the doc's description, then
   `import {X} from '@tecton/react/<Module>'`;
3. **Anatomy** — the parts the component draws;
4. **Best practices** — one row per practice with its Do or Don't badge;
5. **Signature** — a hook's parameters and returns;
6. **Playground** or **Props** — when the doc carries a `playground`, the
   component rendered from its defaults with a knob on every prop a control can
   express; otherwise the plain props table;
7. **Examples** — every block whose `exampleFor` belongs to this module;
8. **Theming** — the targets a `defineTheme` config keys on, a copyable example
   of that config, and the custom properties the component reads;
9. **Accessibility** — the requirements, grouped by category, with the WCAG
   criterion linked;
10. **Parts** — a props table or hook signature for every entry in the doc's
    `components[]` and for every sibling `subComponentOf` doc;
11. **Keywords** and **Related**.

The section components under `src/components/component-detail/` are ports of the
component system's docsite files of the same name. What changed: previews render
under Tecton's theme in a nested `TectonProvider` with a dark/light switch
(upstream renders under its neutral theme), the shadcn, playground-link and
analytics sections are dropped, and the inline type-definition popovers are
dropped because the vendored docs carry no extracted declarations for them.

## The sidebar

144 flat entries is a list to scroll past, so the component pages are grouped
the way the library groups them, by the rule in the component system's own
generator: a doc's `group` makes a group, a group with one member flattens back
to a plain entry, the group's label is its canonical member's display name (or a
humanised form of the raw label when no member is named after it), hooks living
in `hooks/` and anything in the `Utilities` group go to Utilities, and a hook
whose parent doc has parts joins its parent's group. Items are alphabetised.

`generate-data.mjs` works the grouping out and writes it to
`src/generated/componentSidebar.ts`; `src/lib/source.ts` turns it into folders in
the page tree fumadocs draws. **The folders are synthetic**: the files under
`content/docs/components` stay flat, so a page's URL is
`/docs/components/Button` and not `/docs/components/Button/Button`. A folder in
fumadocs' page tree does not have to be a folder on disk, and fumadocs opens the
folder holding the page being read while leaving the others collapsed.

## Examples

Every example on the site is ported from upstream, not written here. Upstream
ships 646 _blocks_ (one component doing one thing) and 53 _page templates_ (a
whole screen) in
`packages/react/node_modules/@astryxdesign/cli/assets/templates`, and
`apps/docs/scripts/port-examples.mjs` rewrites them into the docs app:

```
apps/docs/examples/components/<Component>/<Name>.tsx      the example
apps/docs/examples/components/<Component>/<Name>.doc.mjs  its doc object
apps/docs/examples/pages/<slug>/page.tsx                  the page template
apps/docs/examples/pages/<slug>/template.doc.mjs          its doc object
```

**The port is import rewriting.** `@tecton/react` re-exports the component
system one for one — same names, same props — so an example needs no
translation: `'@astryxdesign/core/X'` becomes `'@tecton/react/X'`, heroicons and
lucide glyphs become Tecton glyph components, and the prose is put through the
same Tecton rewrite. Everything the port changed is in
`docs/engineering/ported-examples.log`.

```
pnpm examples:port    # rewrite apps/docs/examples from upstream
pnpm examples:check   # re-run the port in memory and fail on drift
```

`apps/docs/examples` is generated and committed: hand-editing a file there is
undone by the next port, and `pnpm examples:check` fails until it is. ESLint
skips the directory for the same reason it skips `apps/docs/src/generated`;
`tsc` does not — the examples are inside the app's `tsconfig.json`, so
`pnpm --filter @tecton/docs typecheck` covers all 699 of them.

### Which page renders which example

A block's doc carries `exampleFor`, the component it is an example of. That may
be a module (`Button`), a part of one (`ChatMessageBubble`) or a hook
(`useTableSelection`); either way the example belongs to the page that documents
it, and the generator resolves it through a map built from every doc's own name,
`components[]` and `hiddenComponents`. One directory upstream — `ChatDictation` —
is named after no doc at all; the generator carries a one-line alias onto
`ChatDictationButton`, which is the component those blocks render.

A block marked `isShowcase` leads its page; the rest follow under Examples.

### How an example reaches the browser

1. **Register.** `src/generated/exampleLoaders.ts` gains
   `ButtonShowcase: () => import('../../examples/components/Button/ButtonShowcase')`.
2. **Emit.** The file's text is embedded verbatim in the page's MDX, inside the
   element that frames it:

   ````mdx
   <ExampleBlock id={"ButtonShowcase"} name={"Button — Variants"} description={"…"}>

   ```tsx
   'use client';

   import {Button} from '@tecton/react/Button';
   …
   ```

   </ExampleBlock>
   ````

   The fenced block is ordinary MDX, so fumadocs highlights it with Shiki and
   gives it a copy button — the Code tab is a real fumadocs code block.

3. **Render.** `ExampleBlock` is a client component: a header with the example's
   name and a dark/light switch, a preview stage, and Description/Code tabs
   below. The stage is a second `TectonProvider` with `scope="nested"` — nested
   matters, because a preview must not claim the document root or raise a second
   toast viewport. Inside it, `<LivePreview id>` resolves the id in the loader
   map and renders it under `<Suspense>`.

Because the site is a **static export**, step 3 happens in the browser: the
prerendered HTML carries the frame and the code, and the example's own chunk is
fetched and mounted after hydration. The gallery goes one step further and waits
until a tile is near the viewport (`WhenVisible`), except for the first twelve,
which are statically imported through `src/generated/eagerShowcases.ts` so the
top of the gallery is in the prerendered HTML.

### StyleX

Eighteen of the examples style themselves with `@stylexjs/stylex`, and seven of
those read `@tecton/react/theme/tokens.stylex`. They are shown as source and run
in the reader's browser, so the site compiles StyleX the way a consumer's build
would:

- `babel.config.json` runs `@stylexjs/babel-plugin` with the options the package
  builds with (`classNamePrefix: 'tecton'`). It is JSON because Next's Babel
  loader refuses a `.cjs` or `.mjs` config and this package is `"type":
"module"`, so a `.js` one would be read as ESM.
- A Babel config means webpack rather than Turbopack, so `dev` and `build` pass
  `--webpack`.
- `postcss.config.cjs` runs `@stylexjs/postcss-plugin` over `src/**` and
  `examples/**` and writes the classes it compiled where `@stylex;` sits.
- That `@stylex;` is in **`src/app/stylex.css`, on its own sheet**, not in
  `global.css`. Tailwind v4 rebuilds the stylesheet it is handed from its own
  tree and drops the rules the StyleX plugin injected, whichever order the two
  plugins run in. On its own sheet nothing rewrites it.
- `package.json` carries a modern `browserslist`. Without it, Babel down-levels
  the Unicode property escapes in fumadocs' own dependencies and the build fails
  on regular expressions nobody here wrote.

## The gallery and the templates

`/docs/components` is a port of upstream's own gallery page: a section per
category in upstream's order (Action, Chat, Container, Content, Data
Visualization, Feedback & Status, Form Controls, Layout, Navigation, Overlay,
Table & List, Utility), a responsive grid of clickable 16:10 tiles, each
rendering the component's showcase at 200% scaled by half with pointer events
off, and a muted placeholder where a component has no showcase. A tile is a
page, and a page is a module, so `Chat` has one tile rather than one per part.

`/docs/templates` follows upstream's `templateGalleryOrder`: templates are
grouped by the part of their category before the `-`, the groups are shown in
upstream's order, and within a group they sort by title. Upstream's tile opens a
dialog; ours links to the template's own page, which is where the source is —
the site is a static export, and a page a reader can link to beats a dialog they
cannot.

The images the templates reference live in `apps/docs/public/template-assets`,
copied verbatim from upstream and credited in `THIRD-PARTY-NOTICES.md`.

## Search

`src/app/api/search/route.ts` is `staticGET` from `fumadocs-core/search/server`.
Under `output: 'export'` Next writes its result to `out/api/search`: one JSON
document holding the Orama index of every page the loader knows about, built
from the MDX's structured content — titles, descriptions, headings and
paragraphs. There is no server.

`src/components/search.tsx` uses `staticClient()` from
`fumadocs-core/search/client/orama-static`. The first time the dialog is opened
it fetches that document, loads it into Orama in the browser, and runs every
query locally. `scripts/check-docs-site.mjs` asserts that every generated page
appears in the index of the built export, and the Playwright suite asserts that
typing `button` reaches `/docs/components/Button`.

This is also why the prose on a component page is Markdown rather than data
passed to a component: text inside a JSX element is invisible to the index.

## Theming

The chrome is fumadocs' and the colours are Tecton's. `src/app/global.css` maps
every `--color-fd-*` variable fumadocs draws with onto a Tecton role, and
because Tecton's roles are `light-dark()` pairs resolved against
`color-scheme`, one mapping covers both modes. Text is Figtree and code is IBM
Plex Mono, the two families the theme names.

`<html>` is served with `data-astryx-theme="tecton"` and `data-theme="dark"`
already on it: the theme's custom properties are scoped to that attribute, so a
page that waited for hydration to add it would paint once without the design
system's colours. Dark is the default, as Tecton is designed dark.

The two theme systems are kept apart on purpose. fumadocs switches modes with a
class on `<html>` (`next-themes`); Tecton switches with `data-theme` and
`color-scheme`. `src/components/provider.tsx` reads the resolved theme and hands
it to `TectonProvider`, so each writes only its own attribute — the registry
inside `TectonProvider` reverts foreign writes to `data-theme`, and a second
writer would fight it.

The stylesheet is `@tecton/react/styles-no-reset.css`, not `styles.css`:
Tailwind's preflight is already resetting the document, and two resets
disagreeing about the same elements is how a documentation site stops looking
like the system it documents.

## Guards

`scripts/check-docs-site.mjs`, wired into `pnpm check` as `docs:site:check`,
runs against the generated trees and the built export:

1. every module with a main doc has a page, every page documents one, and every
   page's import path is a subpath the package actually exports;
2. every page the generator claims exists on disk;
3. every ported example is rendered by exactly one page, and no page renders an
   example that is not in the registry;
4. every example and every template has a source file and a loader entry;
5. every guide and every section is in the sidebar, and every component page is
   in the grouped component sidebar exactly once;
6. every source a foundations page reads is still where it reads it from;
7. the exported search index carries every page;
8. nothing on a generated page or in the exported HTML names the upstream
   library, beyond the message ids, attributes and class names listed above.

`pnpm --filter @tecton/docs test:e2e` (or `pnpm docs:site:e2e`) drives the
static export in Chromium, in two suites of different shapes.

`tests/site.spec.ts` checks in detail the things a reader most depends on: the
landing page's live tiles, the Button page's showcase, Code tab, mode switch and
playground, the Table page's part props, the grouped sidebar opening, the
gallery's categories and a keyboard journey into a tile, the icon gallery's
filter and cut switch, the colour page's values in both modes, search reaching
`/docs/components/Button`, and a template rendering live beside its source.

`tests/every-page.spec.ts` is the opposite: one cheap pass over all 217 pages,
asserting only what must never be untrue anywhere — the page is served, its
title is its own, every example frame on it drew something, a component page
that documents examples rendered at least one frame, nothing logged a console
error, and nothing a reader sees names the upstream library. It is driven by
`sitePages`, so a module added to the package is covered here the moment it has
a page.

Both are outside `pnpm check` because they launch a browser.

## Working on it

```bash
pnpm --filter @tecton/react build     # the site reads dist/ for tokens
pnpm --filter @tecton/docs dev        # generates, then next dev --webpack
pnpm --filter @tecton/docs build      # generates, then a static export into out/
pnpm --filter @tecton/docs serve      # serves out/ the way a static host would
pnpm --filter @tecton/docs test:e2e   # Playwright against the export
node scripts/check-docs-site.mjs      # the guard
```

The generator does not watch. After changing a doc file, an example or a guide,
run `pnpm --filter @tecton/docs generate` (or restart `dev`).

### Adding a guide

1. Write `apps/docs/guides/<name>.doc.mjs`, exporting a `docs` object of the
   `DocTopic` shape in `apps/docs/src/types/docs.ts`: a `name` (which is the
   URL), a `title`, a `description` and `sections`, each section a title and a
   list of blocks — `prose`, `code`, `list` or `table`. Prose may carry inline
   code in backticks and links written as `[label](/docs/theming)`.
2. Add the name to `GUIDE_ORDER` in `apps/docs/scripts/generate-data.mjs` if it
   belongs somewhere particular in the sidebar; without that it sorts after the
   ordered ones.
3. `pnpm --filter @tecton/docs generate`. The page, its sidebar entry and its
   search records all appear. `scripts/check-docs-site.mjs` fails if the guide
   is not in the sidebar, which is the only way to forget it.

### Adding a component page

Nothing here. A page follows its doc object, and the doc objects come from the
component system. `pnpm upgrade-astryx` brings a newer one in; the generator
prints the new page, the guard notices if it did not.

### Adding a foundations page

Add it to `apps/docs/scripts/foundation-sources.mjs` with the files it is
printed from, add the data it needs to `buildFoundations()`, and add a component
for it to the `FOUNDATIONS` map in
`apps/docs/src/components/docs/foundations.tsx`. The guard checks that every
declared source exists, so a page cannot quietly outlive its data.

[fumadocs]: https://fumadocs.dev
