/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'styling',
  title: 'Styling',
  description:
    'How to lay out and style your own screens with Tecton: layout primitives, tokens, StyleX, and where a component stops being yours to restyle.',
  category: 'Guides',
  sections: [
    {
      title: 'Reach for a layout primitive first',
      content: [
        {
          type: 'prose',
          text: '`Stack`, `HStack`, `VStack`, `Grid` and `Section` cover almost every arrangement in the design. They take gaps and padding as steps on the 4px grid rather than as free values, which is what keeps the rhythm consistent between screens.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {Card} from '@tecton/react/Card';
import {Grid} from '@tecton/react/Grid';
import {HStack, VStack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';

<Grid columns={{minWidth: 280, repeat: 'fill'}} gap={4}>
  <Card>
    <VStack gap={2}>
      <Heading level={3}>Reduced DLS</Heading>
      <HStack hAlign="between" vAlign="center">
        <Text type="supporting" color="secondary">
          AFE Cost
        </Text>
        <Text type="mediumData" hasTabularNumbers>
          3M–12M
        </Text>
      </HStack>
    </VStack>
  </Card>
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
            ['`1.5`', '6'],
            ['`2`', '8'],
            ['`3`', '12'],
            ['`4`', '16'],
            ['`5`', '20'],
            ['`6`', '24'],
            ['`8`', '32'],
            ['`10`', '40'],
          ],
        },
      ],
    },
    {
      title: 'Style your own markup with tokens',
      content: [
        {
          type: 'prose',
          text: 'Where no component exists — a bespoke chart frame, a schematic, a page shell — write ordinary markup and take the values from the token map. The result sits inside the same design system, follows the colour mode for free, and owes nothing to anyone’s internals.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {tecton} from '@tecton/react/theme';

<figure
  style={{
    margin: 0,
    padding: tecton.space.lg,
    background: tecton.color.surface.card,
    border: \`\${tecton.border.width} solid \${tecton.color.divider.subtle}\`,
    borderRadius: tecton.radius.container,
  }}
>
  <WellSchematic />
</figure>;`,
        },
        {
          type: 'prose',
          text: 'The same tokens are plain CSS custom properties, so a stylesheet or a CSS module can use them without importing anything. Every branch of the map, with its value in both modes, is printed under [Foundations](/docs/foundations/colour).',
        },
      ],
    },
    {
      title: 'Styling a component from the outside',
      content: [
        {
          type: 'prose',
          text: 'The components take `className`, `style` and StyleX’s `xstyle`, and the examples on this site use all three. That is not a licence to redraw them: those props are for **placement and arrangement** — a width, a margin, a grid position, a `flex-grow` — not for changing what a component looks like.',
        },
        {
          type: 'list',
          items: [
            'Fine: give a card a `maxWidth`, stretch a button to `width="100%"`, put a `marginBlockStart` on a section.',
            'Not fine: change a component’s colours, radii, borders or paddings from the call site. Two call sites styled differently are two design systems.',
            'Never target a component’s generated class names from your own stylesheet. They are hashes of their own declarations and they change between releases without notice.',
          ],
        },
        {
          type: 'prose',
          text: 'If a component cannot look the way your screen needs, that is a theme decision, not a call-site one — see [Theming](/docs/theming).',
        },
      ],
    },
    {
      title: 'StyleX',
      content: [
        {
          type: 'prose',
          text: 'The components are written in StyleX, and `xstyle` takes a StyleX style. An application that already compiles StyleX can write styles against the token variables directly, which is how several of the examples on this site are built.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import * as stylex from '@stylexjs/stylex';
import {spacingVars} from '@tecton/react/theme/tokens.stylex';
import {VStack} from '@tecton/react/Layout';

const styles = stylex.create({
  header: {marginInlineStart: spacingVars['--spacing-3']},
});

<VStack gap={1} xstyle={styles.header}>…</VStack>;`,
        },
        {
          type: 'prose',
          text: 'StyleX is optional: `@tecton/react` ships compiled CSS, so an application that does not compile StyleX loses nothing but `xstyle`. `style` and `className` work either way.',
        },
      ],
    },
    {
      title: 'Text and headings',
      content: [
        {
          type: 'prose',
          text: 'Use `Text` and `Heading` rather than styling a `<span>`: they carry the type scale, the weights, the data types and the tabular figures. Headings take a `level`, which sets both the element and the size, and an `accessibilityLevel` for the case where the size you want and the rank the document needs disagree. See [Using typography](/docs/typography-usage).',
        },
      ],
    },
    {
      title: 'The escape hatch',
      content: [
        {
          type: 'prose',
          text: '`tectonToken(name)` reaches a custom property the `tecton` map does not name, so a value that exists in the theme is never out of reach.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {tectonToken} from '@tecton/react/theme';

const ring = {outlineColor: tectonToken('--focus-outline-color')};`,
        },
        {
          type: 'prose',
          text: 'If you find yourself wanting more than that, the component is missing something. Say so rather than routing around it — see [Upgrading](/docs/upgrading) for what a release can and cannot change under you.',
        },
      ],
    },
  ],
};
