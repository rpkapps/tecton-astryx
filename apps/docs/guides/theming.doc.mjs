/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'theming',
  title: 'Theming',
  description:
    'Colour modes, the tecton token map, tokens as CSS variables, and what a consumer may and may not restyle.',
  category: 'Guides',
  sections: [
    {
      title: 'Colour modes',
      content: [
        {
          type: 'prose',
          text: '`TectonProvider` takes `mode`: `dark` (the default), `light`, or `system` to follow the operating system preference. The tree inside the provider always renders in that mode, and the page canvas, the scrollbars and the native form controls follow the first provider on the page that claims the document root.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `<TectonProvider mode="system">
  <App />
</TectonProvider>`,
        },
        {
          type: 'prose',
          text: 'Switching mode costs nothing at runtime: every token is a CSS custom property, so the cascade re-resolves and no component re-renders. A mode switch in your own chrome is therefore just a piece of state that you pass to `mode`.',
        },
        {
          type: 'prose',
          text: 'Tecton is designed dark — see [Principles](/docs/principles). The light values are derived from the dark ones rather than separately designed, so review light mode before you ship it as your default.',
        },
      ],
    },
    {
      title: 'The tecton map',
      content: [
        {
          type: 'prose',
          text: 'Every design token is reachable from one object, named by the role it plays rather than by the colour it happens to be. Each leaf is a ready-to-use `var(--…)` string, so it works in an inline style, in a CSS-in-JS layer, or anywhere else a style value is accepted.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {tecton} from '@tecton/react';

<div
  style={{
    background: tecton.color.surface.card,
    color: tecton.color.text.primary,
    border: \`\${tecton.border.width} solid \${tecton.color.divider.subtle}\`,
    borderRadius: tecton.radius.container,
    padding: tecton.space.lg,
  }}
/>;`,
        },
        {
          type: 'table',
          caption: 'The branches of the map.',
          columns: ['Branch', 'What it names'],
          rows: [
            [
              '`tecton.color`',
              'Ink, glyphs, surfaces, actions, dividers, the five severities, the seven accents, and the table, top-nav and input colours.',
            ],
            ['`tecton.space`', 'The 4px grid, from `none` to `xxl`.'],
            [
              '`tecton.radius`',
              'Corner radii: `element` (4px) is the default Tecton corner.',
            ],
            ['`tecton.size`', 'Control heights: `sm`, `md`, `lg`.'],
            ['`tecton.font`', 'The two families and the two weights.'],
            [
              '`tecton.shadow`',
              'Elevation, for the rare genuinely floating surface.',
            ],
            ['`tecton.border`', 'One border width, used everywhere.'],
          ],
        },
        {
          type: 'prose',
          text: 'Every branch is printed, with its value in both modes, under [Foundations](/foundations/colour).',
        },
      ],
    },
    {
      title: 'Tokens as CSS variables',
      content: [
        {
          type: 'prose',
          text: 'The map is a convenience over the real contract, which is the custom properties themselves. A stylesheet, a template or a non-React part of your page can read them directly, and `tectonToken()` is the escape hatch for a property the map does not name.',
        },
        {
          type: 'code',
          language: 'css',
          caption: 'Your own CSS, using the same tokens the components use.',
          code: `.readout {
  background: var(--color-background-card);
  color: var(--color-text-primary);
  border-radius: var(--radius-container);
  padding: var(--spacing-4);
  font-family: var(--font-family-code);
}`,
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {tectonToken} from '@tecton/react';

const ring = {outlineColor: tectonToken('--focus-outline-color')};`,
        },
      ],
    },
    {
      title: 'What you may restyle',
      content: [
        {
          type: 'list',
          items: [
            'Your own surfaces, built from the token map — that is what it is for.',
            'Layout around a component: margins, widths, grid placement.',
            'Anything a component exposes as a prop: variant, size, density, tone.',
          ],
        },
      ],
    },
    {
      title: 'What you may not',
      content: [
        {
          type: 'list',
          items: [
            'Component internals. The class names are generated and hashed; they are not an API and they change between releases without notice.',
            'Token values, redefined on your own elements to re-skin Tecton. A token redefined halfway down the tree makes two versions of the design system on one page.',
            'The theme attribute Tecton sets on the document root, or the overlay container it mounts.',
          ],
        },
        {
          type: 'prose',
          text: 'If a component cannot express something your screen needs, that is a gap in Tecton and worth reporting: a local override will be silently undone by the next release. Where Tecton itself could not express the design, the component page says so under "Notes".',
        },
      ],
    },
  ],
};
