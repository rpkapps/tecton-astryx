/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'theming',
  title: 'Theming',
  description:
    'Colour modes, the tecton token map, tokens as CSS variables, and how a theme decides what a component looks like.',
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
          text: 'A provider can also be nested — `scope="nested"` — which themes its own subtree without claiming the document. That is how every preview on this site can be looked at in the other mode while the page stays as it was.',
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
          code: `import {tecton} from '@tecton/react/theme';

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
              'Ink, glyphs, surfaces, actions, dividers, the five statuses, the accents, and the table, top-nav and input colours.',
            ],
            ['`tecton.space`', 'The 4px grid, from `none` to `xxl`.'],
            [
              '`tecton.radius`',
              'Corner radii: `element` is the default Tecton corner, `container` the one a card takes.',
            ],
            ['`tecton.size`', 'Control heights: `sm`, `md`, `lg`.'],
            ['`tecton.font`', 'The two families and the weights.'],
            [
              '`tecton.shadow`',
              'Elevation, for the rare genuinely floating surface.',
            ],
            ['`tecton.border`', 'One border width, used everywhere.'],
          ],
        },
        {
          type: 'prose',
          text: 'Every branch is printed, with its value in both modes, under [Foundations](/docs/foundations/colour).',
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
          code: `import {tectonToken} from '@tecton/react/theme';

const ring = {outlineColor: tectonToken('--focus-outline-color')};`,
        },
        {
          type: 'prose',
          text: 'For an application that compiles StyleX, `@tecton/react/theme/tokens.stylex` publishes the same variables as StyleX variable maps — `spacingVars`, `colorVars` and the rest — so a `stylex.create` block can name a token without writing `var()` by hand.',
        },
      ],
    },
    {
      title: 'What a theme decides',
      content: [
        {
          type: 'prose',
          text: 'Tecton is a `defineTheme` config: the palette, the type scale, the radii, an icon registry, and a block of per-component decisions. That last part is why a Tecton button does not look like a default one, and it is how a look is changed here — not at the call site.',
        },
        {
          type: 'prose',
          text: 'Every component page has a **Theming** section printed from the component’s own doc: the keys it exposes to a `defineTheme` `components` map, the `data-*` attributes each key reflects, and the custom properties the component reads. That is the surface a theme may decide, and it is the whole of it.',
        },
        {
          type: 'code',
          language: 'ts',
          caption: 'The shape of a per-component decision.',
          code: `components: {
  button: {
    base: {/* CSS properties */},
    'variant:primary': {/* prop-specific */},
  },
}`,
        },
        {
          type: 'prose',
          text: 'A theme may also add values to a prop’s vocabulary. Tecton does: `variant="outlined"` and `variant="text-only"` on `Button`, `status="neutral"` on `Banner`, `variant="lime"` on `Badge`, and eight text types. Those are declared, so they type-check in your editor — they are extensions of the component’s API, not new components.',
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
            'Layout around a component: margins, widths, grid placement, through `style`, `className` or `xstyle`.',
            'Anything a component exposes as a prop: variant, size, density, status.',
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
            'Component internals. The generated class names are hashes of their own declarations; they are not an API and they change between releases without notice.',
            'Token values, redefined on your own elements to re-skin the components. A token redefined halfway down the tree makes two versions of the design system on one page.',
            'The theme attribute Tecton sets on the document root, or the layer container it mounts.',
          ],
        },
        {
          type: 'prose',
          text: 'One consequence worth knowing: every rule Tecton ships now sits in one cascade layer under one attribute scope, per-component decisions included. On a page carrying two versions of Tecton that makes a component decision a cross-version contract in exactly the way a token value is — see [Micro-frontends](/docs/micro-frontends).',
        },
      ],
    },
  ],
};
