/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'upgrading',
  title: 'Upgrading',
  description:
    'What a Tecton release contains, what the version number promises, and the contract for running two versions at once.',
  category: 'Guides',
  sections: [
    {
      title: 'What a release is',
      content: [
        {
          type: 'prose',
          text: 'A Tecton release is one published version of `@tecton/react`: the component system it re-exports, their type declarations, the icon set, the theme and the five stylesheets, built together from one commit. The stylesheet in a release always matches the code in that release — that is why they ship in the same package and are versioned as one thing.',
        },
        {
          type: 'prose',
          text: 'Every release is listed on the [changelog](/docs/changelog).',
        },
      ],
    },
    {
      title: 'What the version number promises',
      content: [
        {
          type: 'table',
          columns: ['Change', 'Version'],
          rows: [
            [
              'A bug fix, a token value corrected to match the design, a documentation change',
              'patch',
            ],
            [
              'A new module, a new prop, a new glyph, a new token, a new theme variant',
              'minor',
            ],
            [
              'A prop removed or renamed, a default changed, a module removed',
              'major (minor while below `1.0.0`)',
            ],
            [
              'A change to what the components render or to the class names they carry',
              'any release — the DOM is not API',
            ],
          ],
        },
        {
          type: 'prose',
          text: 'Tecton is below `1.0.0` today, so a minor version may still change a component’s API; a patch never does. Once `1.0.0` lands, the table above reads as ordinary semantic versioning. What is **not** covered by any version number: the markup a component renders, its generated class names, and the library underneath it. Anything you built by reaching into those can break in a patch.',
        },
        {
          type: 'prose',
          text: 'One consequence of Tecton being a theme rather than a component library: **the component API is the underlying system’s**, so a release that moves to a newer version of it inherits that system’s own breaking changes. The changelog names them.',
        },
      ],
    },
    {
      title: 'Before you upgrade',
      content: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Read the changelog entries between your version and the new one.',
            'Type-check. Most breaking changes are type errors first: a renamed prop, a narrowed union, a required label.',
            'Search your codebase for anything that reaches past the API — a generated class name, a redefined token, a style override aimed at a component’s internals. Those are the changes that break silently.',
            'Look at one dense screen in both colour modes. Token values move within a release, and a screen built from the token map moves with them by design.',
          ],
        },
      ],
    },
    {
      title: 'The multi-version contract',
      content: [
        {
          type: 'prose',
          text: 'A page may carry more than one version of Tecton — that is the point of a micro-frontend — under one contract:',
        },
        {
          type: 'list',
          items: [
            '**One theme layer on the page.** The host loads exactly one `tokens.css`, and it is the newest version the page carries. Every container then renders in the host’s token values, on purpose — and, since every Tecton rule now lives in that one layer, in the host’s per-component decisions too.',
            '**One component stylesheet per container**, matching the code in that container’s bundle. The components’ own styles are content-hashed, so versions coexist without contesting each other.',
            '**One owner of the document root.** The shell calls `configureTectonRoot()`; every container mounts with `scope="nested"`.',
            '**Concurrent versions stay inside one major of the library underneath.** Crossing that line puts two incompatible base layers on the page, and no amount of care in the theme fixes it.',
          ],
        },
        {
          type: 'prose',
          text: 'Inside that contract, a container can upgrade on its own schedule: the newest container brings the page’s tokens, the older containers keep their own component code, and the visual difference is whatever genuinely changed in the design. The full guide is [Micro-frontends](/docs/micro-frontends).',
        },
        {
          type: 'prose',
          text: 'Bound the number of concurrent versions by policy. Each extra one costs roughly 190 kB of largely duplicate CSS, and every version on the page is a version someone has to reason about when a screen looks wrong.',
        },
      ],
    },
    {
      title: 'When something breaks',
      content: [
        {
          type: 'list',
          items: [
            'A component looks wrong but the props are right: check that exactly one `tokens.css` is loaded, and that it is the newest.',
            'The page chrome is the wrong mode: check that the shell calls `configureTectonRoot()` before any container loads, and that no container is still mounting with the default `scope="root"`.',
            'A style you added stopped applying: it was probably aimed at a component’s internals. Rebuild it from the token map on your own element.',
            'Toasts from one container stopped appearing beside another’s: they never shared a viewport. Each copy of the package shows its own — raise them from the shell if they belong together.',
            'The design moved under you on a patch: that is a token value corrected to match the design. It is intentional, and the changelog says so.',
          ],
        },
      ],
    },
  ],
};
