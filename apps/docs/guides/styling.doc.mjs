/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'styling',
  title: 'Styling',
  description:
    'How to lay out and style your own screens with Tecton: layout primitives, tokens, and the two escape hatches.',
  category: 'Guides',
  sections: [
    {
      title: 'There is no styling API',
      content: [
        {
          type: 'prose',
          text: 'Tecton components take no `className`, no `style` and no style-props object. That is deliberate: a component whose look can be overridden from the outside has no contract, and the overrides are what break on every upgrade. What a component can look like is what its props say it can look like.',
        },
        {
          type: 'prose',
          text: 'Everything you need to build a screen is therefore either a prop, a layout primitive, or a token used on your own markup.',
        },
      ],
    },
    {
      title: 'Reach for a layout primitive first',
      content: [
        {
          type: 'prose',
          text: '`Stack`, `HStack`, `VStack` and `Grid` cover almost every arrangement in the design. They take gaps and padding as steps on the 4px grid rather than as free values, which is what keeps the rhythm consistent between screens.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {Grid, HStack, Panel, Text, VStack} from '@tecton/react';

<Grid columns={{minWidth: 280}} gap={4}>
  <Panel title="Reduced DLS">
    <VStack gap={2}>
      <HStack justify="between">
        <Text variant="small" color="secondary">
          AFE Cost
        </Text>
        <Text variant="mediumData">3M–12M</Text>
      </HStack>
    </VStack>
  </Panel>
</Grid>;`,
        },
        {
          type: 'table',
          caption: 'The steps a gap or a padding accepts.',
          columns: ['Step', 'Pixels'],
          rows: [
            ['`0`', '0'],
            ['`0.5`', '2'],
            ['`1`', '4'],
            ['`2`', '8'],
            ['`3`', '12'],
            ['`4`', '16'],
            ['`6`', '24'],
            ['`8`', '32'],
          ],
        },
      ],
    },
    {
      title: 'Style your own markup with tokens',
      content: [
        {
          type: 'prose',
          text: 'Where no component exists — a bespoke chart frame, a schematic, a page shell — write ordinary markup and take the values from the token map. The result sits inside the same design system, follows the colour mode for free, and owes nothing to Tecton internals.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {tecton} from '@tecton/react';

<figure
  style={{
    margin: 0,
    padding: tecton.space.md,
    background: tecton.color.surface.body,
    border: \`\${tecton.border.width} solid \${tecton.color.divider.subtle}\`,
    borderRadius: tecton.radius.element,
  }}
>
  <WellSchematic />
</figure>;`,
        },
        {
          type: 'prose',
          text: 'The same tokens are plain CSS custom properties, so a stylesheet or a CSS module can use them without importing anything. This documentation site is built that way: every rule in its own stylesheet is written against `var(--…)` tokens, and there is not a hex value anywhere in it.',
        },
      ],
    },
    {
      title: 'Text and headings',
      content: [
        {
          type: 'prose',
          text: 'Use `Text` and `Heading` rather than styling a `<span>`: they carry the type scale, the weights, the data variants and the tabular figures. Headings take a `level`, which sets both the element and the size, and an `outlineLevel` for the case where the size you want and the rank the document needs disagree. See [Using typography](/docs/typography-usage).',
        },
      ],
    },
    {
      title: 'The two escape hatches',
      content: [
        {
          type: 'list',
          ordered: true,
          items: [
            '`tectonToken(name)` — reach a custom property the `tecton` map does not name.',
            'Your own element, styled from tokens, wrapping or sitting beside the component. Wrapping is always allowed; reaching inside never is.',
          ],
        },
        {
          type: 'prose',
          text: 'If you find yourself wanting a third, the component is missing something. Say so rather than routing around it — see [Upgrading](/docs/upgrading) for what a release can and cannot change under you.',
        },
      ],
    },
  ],
};
