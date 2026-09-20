# The documentation site

`apps/docs` is the Tecton docsite: a landing page, nine written guides, seven
foundations pages, a page for every component the package exports, a gallery of
the page templates, and the changelog. It is a [fumadocs][] site on Next.js 16,
exported as static HTML.

Two things about it are worth knowing before anything else.

**Almost none of it is written.** The only authored content in the app is the
nine guides under `apps/docs/guides`. Everything else — every component page,
every foundations table, every sidebar entry, every search record — is printed
at build time from the package: from the doc files that live beside each
component, from the built theme, and from the design JSON the theme was
transcribed from. A component added to `@tecton/react` gains a page, a place in
the sidebar and an entry in the search index without a line changing here.

**The examples are the running components.** An example on a component page is
not a screenshot and not a re-implementation: it is the same file that lives
beside the component in `packages/react`, loaded and mounted in the reader's
browser, with its source shown beside it in the Code tab. The two cannot drift,
because they are the same file.

|            |                                                                             |
| ---------- | --------------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, `output: 'export'`)                                 |
| Docs shell | `fumadocs-ui` and `fumadocs-core` 16, `fumadocs-mdx` 15                     |
| Styling    | Tailwind v4 (fumadocs requires it) over `@tecton/react/styles-no-reset.css` |
| Search     | Orama, exported as a static index                                           |
| Tests      | Playwright, against the static export                                       |

## Routes

| Route                      | What it is                                                                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                        | Landing page: hero, install snippet, counts, and the live component gallery                                                                                |
| `/docs`                    | Index of everything, as tiles                                                                                                                              |
| `/docs/<guide>`            | The nine guides: `getting-started`, `principles`, `theming`, `styling`, `typography-usage`, `icons-usage`, `accessibility`, `micro-frontends`, `upgrading` |
| `/docs/foundations/<name>` | `colour`, `typography`, `spacing`, `shape`, `elevation`, `motion`, `icons`                                                                                 |
| `/docs/components`         | The component index, grouped by category, one live tile each                                                                                               |
| `/docs/components/<Name>`  | One per exported component                                                                                                                                 |
| `/docs/templates`          | The page-template gallery                                                                                                                                  |
| `/docs/templates/<Name>`   | One per published template                                                                                                                                 |
| `/docs/changelog`          | The package's releases                                                                                                                                     |
| `/api/search`              | The exported search index — a build artefact, not a server                                                                                                 |

## Data flow

```
packages/react/src/**/*.doc.mjs ─┐
packages/react/src/**/examples/  │
packages/react/src/templates/    ├─► apps/docs/scripts/generate-data.mjs ─┬─► apps/docs/content/docs/**  ──► fumadocs ──► out/
packages/react/dist/theme/*      │                                        │      (MDX + meta.json)
design/foundations/*.json        │                                        └─► apps/docs/src/generated/** ─► the page components
apps/docs/guides/*.doc.mjs     ──┘                                               (registries + example modules)
```

`generate-data.mjs` runs first in both `dev` and `build`
(`pnpm --filter @tecton/docs generate` runs it alone). It reads:

- **component docs** — `packages/react/src/components/<Name>/<Name>.doc.mjs`,
  the same files `scripts/check-docs-drift.mjs` already validates against the
  implementation;
- **example docs and sources** — `<Name>/examples/<Id>.doc.mjs` beside
  `<Id>.tsx`;
- **template docs and sources** — anything under `packages/react/src/templates`,
  which is empty until that export exists;
- **guides** — `apps/docs/guides/*.doc.mjs`;
- **tokens** — `packages/react/dist/theme/{tokens,semantic,typography}.js`,
  `dist/icons/names.js` and the built stylesheets, plus
  `design/foundations/*.json` for the design's own descriptions. The package has
  to be built first, which is why `pnpm check` runs `build` before anything that
  reads `dist/`;
- **the changelog** — `packages/react/CHANGELOG.md`, if it exists.

It writes two trees, both gitignored:

`apps/docs/content/docs/**` — the MDX fumadocs compiles, and the `meta.json`
files that order the sidebar. A component page is real MDX: its prose, its
do/don't lists and its notes are Markdown, so they are indexed by search and
read by the table of contents; its tables and previews are JSX elements that
resolve to the components registered in `src/components/mdx.tsx`.

`apps/docs/src/generated/**` — typed modules the page components import:
`componentRegistry`, `exampleRegistry`, `templateRegistry`, `guideRegistry`,
`foundationData`, `foundationPages`, `changelog`, `sitePages`, one `.tsx` module
per example and per template, and the `exampleLoaders` / `templateLoaders` maps
of dynamic imports. `apps/docs/src/types/docs.ts` is the hand-written contract
they are typed against.

## Examples

Every example on the site is ported from upstream, not written here. Upstream
ships 646 _blocks_ (one component doing one thing) and 53 _page templates_ (a
whole screen) in
`packages/react/node_modules/@astryxdesign/cli/assets/templates`, and
`apps/docs/scripts/port-examples.mjs` rewrites them into the docs app:

```
apps/docs/examples/components/<Component>/<Name>.tsx   the example
apps/docs/examples/components/<Component>/<Name>.doc.mjs   its doc object
apps/docs/examples/pages/<slug>/page.tsx               the page template
apps/docs/examples/pages/<slug>/template.doc.mjs       its doc object
```

The directory mirrors upstream's own, so a block stays where its author put it.
A block's doc carries `exampleFor`, which is the component whose page shows it,
plus the `id` the port adds (the file stem); a page template's doc carries its
`slug`.

**The port is import rewriting.** `@tecton/react` re-exports
`@astryxdesign/core` one for one — same component names, same props — so an
example needs no translation. `'@astryxdesign/core/X'` becomes
`'@tecton/react/X'`, heroicons and lucide glyphs become Tecton glyph components
from `'@tecton/react/icons'`, `export default function X` becomes
`export function X` named for its file, and the upstream copyright line is
dropped in favour of `THIRD-PARTY-NOTICES.md` at the repository root. `react`,
`recharts` and `@stylexjs/stylex` are left alone; they are dependencies of this
app. Lucide's `size={n}`, which a Tecton glyph does not take, becomes
`width={n} height={n}`, so an icon still draws the size the example drew it.

**Prose names Tecton.** An example is documentation, and a page that names the
library underneath Tecton is a page about something else, so
`@astryxdesign/core` → `@tecton/react`, `Astryx` → `Tecton` and `astryx` →
`tecton` are applied to comments, strings, template literals and JSX text, and
to the doc objects' strings — and to nothing else. Identifiers, module
specifiers and keys are left alone: an override keyed on one of the library's
own message ids has to keep that id, or it reads right and matches nothing.

Everything the port changed — every glyph substitution, every renamed export,
every icon prop rewritten, every file whose prose changed, and the one file
that needed a hand-written rule — is in
`docs/engineering/ported-examples.log`, with the file it happened to. Its Notes
list the subpaths the examples import beyond a component module, which is the
surface `@tecton/react` has to cover for them to compile.

```
pnpm examples:port    # rewrite apps/docs/examples from upstream
pnpm examples:check   # re-run the port in memory and fail on drift
```

`apps/docs/examples` is generated and committed: hand-editing a file there is
undone by the next port, and `pnpm examples:check` fails until it is. That is
also what catches an upstream bump silently changing an example. ESLint skips
the directory for the same reason it skips `apps/docs/src/generated`.

## How an example becomes a page

Take `packages/react/src/components/Button/examples/ButtonBasic.tsx`:

```tsx
import {Button} from '../Button.js';

export function ButtonBasic() {
  return <Button label="Generate facies model" variant="primary" />;
}
```

1. **Rewrite.** Every relative import is a name the package's barrel exports, so
   they all collapse into the entry point a consumer would use — `@tecton/react`
   for a component, `@tecton/react/templates` for a template. A name no entry
   point publishes fails the build, because it would mean the code on the page is
   not code a reader can run. The result is written to
   `src/generated/examples/ButtonBasic.tsx` with a `'use client'` banner.

2. **Emit.** The rewritten source is also embedded in the component's MDX, inside
   the JSX element that frames it:

   ````mdx
   <ExampleFrame id={"ButtonBasic"} name={"Basic"} description={"A panel's committing action."}>

   ```tsx
   import {Button} from '@tecton/react';

   export function ButtonBasic() {
     return <Button label="Generate facies model" variant="primary" />;
   }
   ```

   </ExampleFrame>
   ````

   The fenced block is ordinary MDX, so fumadocs highlights it with Shiki and
   gives it a copy button — the Code tab is a real fumadocs code block, not a
   `<pre>` this site drew itself.

3. **Register.** `src/generated/exampleLoaders.ts` gains
   `ButtonBasic: () => import('./examples/ButtonBasic')`.

4. **Render.** `ExampleFrame` is a client component: a header with two Tecton
   `ToggleButtonGroup`s (dark/light, Preview/Code), a preview stage and the code
   block. The stage is a second `TectonProvider` with `scope="nested"` — nested
   matters, because a preview must not claim the document root or raise a second
   toast viewport. Inside it, `<LivePreview id>` resolves the id in the loader
   map and renders it under `<Suspense>`.

Because the site is a **static export**, step 4 happens in the browser: the
prerendered HTML carries the frame and the code, and the example's own chunk is
fetched and mounted after hydration. The component index and the template
gallery go one step further and wait until a tile is near the viewport
(`WhenVisible`), so opening the index does not fetch every module at once.

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

1. every component the barrel exports has a page, and every page documents
   something the barrel exports (a component, or a hook such as `useToast`);
2. every page the generator claims exists on disk;
3. every example in the registry is rendered by exactly one page, and no page
   renders an example that is not in the registry;
4. every generated example module imports `@tecton/react` and carries no
   relative import;
5. every guide, and each of the four sections, is in the sidebar's `meta.json`;
6. every source a foundations page reads is still where it reads it from;
7. every generated page is in the exported search index;
8. no page names the upstream library Tecton is built on.

`pnpm --filter @tecton/docs test:e2e` (or `pnpm docs:site:e2e`) drives the
static export in Chromium, in two suites of different shapes.

`tests/site.spec.ts` checks in detail the things a reader most depends on: the
landing page's live tiles, a component page whose first example renders a real
Tecton button and whose Code tab shows `@tecton/react`, the per-example mode
switch, the icon gallery's filter and cut switch, the colour page's values in
both modes, and search reaching `/docs/components/Button`.

`tests/every-page.spec.ts` is the opposite: one cheap pass over every page in
the generated page list, asserting only what must never be untrue anywhere —
the page is served, its title is its own, every example frame on it actually
drew something, nothing logged a console error, and nothing a reader can see
names the upstream library. It is driven by `sitePages`, so a component added to
the package is covered here the moment it has a page.

Both are outside `pnpm check` because they launch a browser.

## Working on it

```bash
pnpm --filter @tecton/react build     # the site reads dist/ for tokens
pnpm --filter @tecton/docs dev        # generates, then next dev
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

### Adding a component or an example

Nothing here. Write the `.doc.mjs` beside the component in `packages/react`, as
`docs/engineering/component-mapping.md` describes, and the page appears. An
example needs its `.tsx`, its `.doc.mjs`, and its id in the component doc's
`examples` list; the generator fails loudly if any of the three is missing or if
the example imports something the package does not publish.

### Adding a foundations page

Add it to `apps/docs/scripts/foundation-sources.mjs` with the files it is
printed from, add the data it needs to `buildFoundations()`, and add a component
for it to the `FOUNDATIONS` map in
`apps/docs/src/components/docs/foundations.tsx`. The guard checks that every
declared source exists, so a page cannot quietly outlive its data.

## Things that will change when other work lands

- **Templates.** `@tecton/react/templates` does not exist yet. The section is
  data-driven and empty-safe: `/docs/templates` renders an empty state today and
  fills itself in — gallery, per-template pages, sidebar entries — as soon as
  `packages/react/src/templates/<Name>/<Name>.doc.mjs` files appear beside their
  sources. This was verified against a stub.
- **The changelog.** `packages/react/CHANGELOG.md` does not exist yet;
  `/docs/changelog` says so and starts printing releases the day it does.

[fumadocs]: https://fumadocs.dev
