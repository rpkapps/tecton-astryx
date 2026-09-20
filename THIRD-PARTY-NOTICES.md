# Third-party notices

The examples and page templates under `apps/docs/examples` are derived from
the example blocks and page templates that ship with
[`@astryxdesign/cli`](https://www.npmjs.com/package/@astryxdesign/cli), the
tooling for the Astryx design system that `@tecton/react` is built on. They are
used here under the licence below, with their imports rewritten onto
`@tecton/react` by `apps/docs/scripts/port-examples.mjs`; the per-file
copyright line was replaced by this single notice for the whole corpus. What
each file changed on its way in is listed in
`docs/engineering/ported-examples.log`.

The 101 images under `apps/docs/public/template-assets` are the same corpus's
own sample photography, copied verbatim from the Astryx documentation site
(`apps/docsite/public/template-assets`) under the same licence. They are what
the ported examples reference; nothing in them is Tecton's.

The component pages are generated from the documentation objects that ship
inside `@astryxdesign/core` (`src/**/*.doc.mjs` and `groups.doc.mjs`) — the
prose, props, best practices, anatomy, accessibility requirements and theming
targets of every module the package re-exports — with the library's name
rewritten to Tecton's. The page layout itself is ported from that project's
documentation site (`apps/docsite/src/components/component-detail/*`,
`ShowcaseThumbnail.tsx`, `eagerShowcases.ts`, the components gallery and the
template gallery), also under the licence below.

The same licence covers `@astryxdesign/core`, which `@tecton/react` re-exports
and which the package vendors the types of.

## Astryx (`@astryxdesign/cli`, `@astryxdesign/core`, the Astryx documentation site)

```
MIT License

Copyright (c) 2026 Meta Platforms, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
