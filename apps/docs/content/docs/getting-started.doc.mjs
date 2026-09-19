/** @type {import('../../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'getting-started',
  title: 'Getting started',
  description:
    'Install Tecton, load the stylesheet and render your first component.',
  sections: [
    {
      title: 'Install',
      content: [
        {
          type: 'prose',
          text: 'Add the package and its React peers: `pnpm add @tecton/react react react-dom`. React 19 or newer is required. Nothing else needs installing — Tecton ships compiled JavaScript and pre-built CSS, so no Babel, PostCSS or bundler plugin is involved.',
        },
      ],
    },
    {
      title: 'Load the stylesheet',
      content: [
        {
          type: 'prose',
          text: 'Import `@tecton/react/styles.css` once, as early as your other global CSS. It is a single self-contained file: the reset, the component styles and the Tecton theme, in the cascade layers they belong to.',
        },
      ],
    },
    {
      title: 'Wrap the application',
      content: [
        {
          type: 'prose',
          text: 'Mount `TectonProvider` at the root of the tree. It applies the Tecton theme and hosts the overlay layer that popovers, tooltips and toasts render into. It renders dark by default; pass `mode="light"` or `mode="system"` to change that.',
        },
      ],
    },
    {
      title: 'Load the fonts',
      content: [
        {
          type: 'prose',
          text: 'The theme names Figtree for text and IBM Plex Mono for code, but it does not fetch them. Add the font files to your document, or every viewer silently falls back to the next family in the stack.',
        },
      ],
    },
  ],
};
