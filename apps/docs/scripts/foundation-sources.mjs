/**
 * Where every foundations page gets its data.
 *
 * A foundations page is never written by hand: it is printed from the package's
 * own token exports and from the design JSON the tokens were transcribed from.
 * This list is the contract between the two scripts that care —
 * `apps/docs/scripts/generate-data.mjs`, which reads the sources, and
 * `scripts/check-docs-site.mjs`, which fails the build when one of them has
 * moved or gone away.
 *
 * Paths are relative to the repository root.
 */

/** @type {readonly {name: string, title: string, sources: readonly string[]}[]} */
export const foundationPages = [
  {
    name: 'colour',
    title: 'Colour',
    sources: [
      'packages/react/dist/theme/semantic.js',
      'packages/react/dist/theme/tokens.js',
      'packages/react/dist/tecton-tokens.css',
      'design/foundations/colors.json',
    ],
  },
  {
    name: 'typography',
    title: 'Typography',
    sources: [
      'packages/react/dist/theme/typography.js',
      'design/foundations/typography.json',
    ],
  },
  {
    name: 'spacing',
    title: 'Spacing and radius',
    sources: [
      'packages/react/dist/theme/tokens.js',
      'packages/react/dist/tecton-components.css',
      'design/foundations/spacing-and-radius.json',
    ],
  },
  {
    name: 'shape',
    title: 'Shape',
    sources: [
      'packages/react/dist/theme/tokens.js',
      'packages/react/dist/tecton-tokens.css',
      'design/foundations/spacing-and-radius.json',
    ],
  },
  {
    name: 'elevation',
    title: 'Elevation',
    sources: [
      'packages/react/dist/theme/tokens.js',
      'packages/react/dist/tecton-tokens.css',
      'design/patterns/panels.md',
    ],
  },
  {
    name: 'motion',
    title: 'Motion',
    sources: [
      'packages/react/dist/theme/tokens.js',
      'packages/react/dist/tecton-components.css',
    ],
  },
  {
    name: 'icons',
    title: 'Icons',
    sources: ['packages/react/dist/icons/names.js'],
  },
];

/** The changelog the `/changelog` route renders. */
export const changelogSource = 'packages/react/CHANGELOG.md';
