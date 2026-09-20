/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'getting-started',
  title: 'Getting started',
  description:
    'Install Tecton, load the stylesheet, mount the provider and render your first component.',
  category: 'Guides',
  sections: [
    {
      title: 'Install',
      content: [
        {
          type: 'prose',
          text: 'Add the package and its React peers. React 19 or newer is required; nothing else needs installing, because Tecton ships compiled JavaScript and pre-built CSS. There is no Babel plugin, no PostCSS step and no bundler configuration.',
        },
        {
          type: 'code',
          language: 'bash',
          code: 'pnpm add @tecton/react react react-dom',
        },
      ],
    },
    {
      title: 'Load the stylesheet',
      content: [
        {
          type: 'prose',
          text: 'Import `@tecton/react/styles.css` once, as early as your other global CSS. It is a single self-contained file: the reset, the component styles and the Tecton theme, each in the cascade layer it belongs to. Load it once per page — see [Micro-frontends](/docs/micro-frontends) for a page that hosts more than one copy of Tecton.',
        },
        {
          type: 'code',
          language: 'tsx',
          caption: 'src/main.tsx',
          code: `import '@tecton/react/styles.css';`,
        },
      ],
    },
    {
      title: 'Mount the provider',
      content: [
        {
          type: 'prose',
          text: 'Mount `TectonProvider` at the root of the tree. It applies the Tecton theme and hosts the overlay layer that popovers, tooltips, menus and toasts render into. It renders dark by default; pass `mode="light"` or `mode="system"` to change that.',
        },
        {
          type: 'code',
          language: 'tsx',
          caption: 'src/main.tsx',
          code: `import {createRoot} from 'react-dom/client';
import {TectonProvider} from '@tecton/react';
import '@tecton/react/styles.css';
import {App} from './App';

createRoot(document.getElementById('root')).render(
  <TectonProvider mode="dark">
    <App />
  </TectonProvider>,
);`,
        },
      ],
    },
    {
      title: 'Render a component',
      content: [
        {
          type: 'prose',
          text: 'Everything is exported from the package root. Each component is also published as its own subpath — `@tecton/react/Button` — for an application that would rather not pull the whole surface through one module.',
        },
        {
          type: 'code',
          language: 'tsx',
          caption: 'src/App.tsx',
          code: `import {Button, Panel, Text} from '@tecton/react';

export function App() {
  return (
    <Panel
      title="Deployments"
      description="Everything shipped in the last hour."
      actions={<Button label="Run" variant="primary" />}
    >
      <Text variant="small" color="secondary">
        Nothing to report.
      </Text>
    </Panel>
  );
}`,
        },
      ],
    },
    {
      title: 'Load the fonts',
      content: [
        {
          type: 'prose',
          text: 'The theme names Figtree for text and IBM Plex Mono for data, but it does not fetch them: a design system that downloads fonts on your behalf is a design system that decides your privacy policy. Add the faces to your document, or every viewer silently falls back to the next family in the stack.',
        },
        {
          type: 'code',
          language: 'html',
          caption: 'index.html',
          code: `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
/>`,
        },
      ],
    },
    {
      title: 'What you get',
      content: [
        {
          type: 'table',
          columns: ['Import', 'What it is'],
          rows: [
            [
              '`@tecton/react`',
              'Every component, the hooks and the token map.',
            ],
            [
              '`@tecton/react/Button`',
              'One component, for an application that imports narrowly.',
            ],
            [
              '`@tecton/react/icons`',
              'The 131 Tecton glyphs, by name and as components.',
            ],
            [
              '`@tecton/react/theme`',
              'The `tecton` token map and `tectonToken()`.',
            ],
            [
              '`@tecton/react/styles.css`',
              'The one stylesheet: reset, components, theme.',
            ],
          ],
        },
        {
          type: 'prose',
          text: 'Next: [Theming](/docs/theming) for colour modes and tokens, [Styling](/docs/styling) for laying out your own screens, and the [component index](/components) for the API of everything Tecton ships.',
        },
      ],
    },
  ],
};
