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
      title: 'What you are installing',
      content: [
        {
          type: 'prose',
          text: "Tecton is a **theme**, not a component library of its own. The package re-exports a complete React component system — every component, hook, type and module, under its own names and with its own props — and applies the Tecton palette, type scale, radii and icon set to it. So the API you write is that system's API, documented [component by component](/docs/components), and what Tecton decides is how it looks.",
        },
        {
          type: 'prose',
          text: 'That is why nothing here teaches you a Tecton-specific prop: there are none. A `Button` takes `label`, `variant` and `icon` because that is what a `Button` takes.',
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
          text: '`TectonProvider` is the one component Tecton adds. It installs the theme and hosts the layer that popovers, tooltips, menus and toasts render into. It renders dark by default; pass `mode="light"` or `mode="system"` to change that.',
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
          text: 'Everything is exported from the package root, and every module is also published at its own subpath — `@tecton/react/Button`, `@tecton/react/Layout`, `@tecton/react/Table` — which is how the examples on this site import.',
        },
        {
          type: 'code',
          language: 'tsx',
          caption: 'src/App.tsx',
          code: `import {Button} from '@tecton/react/Button';
import {Card} from '@tecton/react/Card';
import {HStack, VStack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';

export function App() {
  return (
    <Card>
      <VStack gap={3}>
        <HStack hAlign="between" vAlign="center" gap={3}>
          <VStack gap={1}>
            <Heading level={2}>Deployments</Heading>
            <Text type="supporting" color="secondary">
              Everything shipped in the last hour.
            </Text>
          </VStack>
          <Button label="Run" variant="primary" />
        </HStack>
        <Text color="secondary">Nothing to report.</Text>
      </VStack>
    </Card>
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
              'Every component and hook the system publishes, plus `TectonProvider`, `configureTectonRoot` and the token map.',
            ],
            [
              '`@tecton/react/Button`',
              'One module, at the same path the system publishes it at. There is one of these for every module.',
            ],
            [
              '`@tecton/react/hooks`',
              'The hooks the components are built from — `useHotkeys`, `useMediaQuery`, `useTypeahead` and the rest.',
            ],
            [
              '`@tecton/react/icons`',
              'The 131 Tecton glyphs as components, plus `tectonIconNames` and `tectonIconRegistry`.',
            ],
            [
              '`@tecton/react/theme`',
              'The theme runtime (`Theme`, `defineTheme`, `useTheme`) and Tecton’s own `tectonTheme`, `tecton` and `tectonToken()`.',
            ],
            [
              '`@tecton/react/styles.css`',
              'The one stylesheet: reset, components, theme.',
            ],
          ],
        },
        {
          type: 'prose',
          text: 'Next: [Theming](/docs/theming) for colour modes and tokens, [Styling](/docs/styling) for laying out your own screens, and the [component index](/docs/components) for the API of everything the package publishes.',
        },
      ],
    },
  ],
};
