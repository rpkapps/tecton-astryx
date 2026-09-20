/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'typography-usage',
  title: 'Using typography',
  description:
    'Which text variant to reach for, how headings and document structure relate, and why every number is monospace.',
  category: 'Guides',
  sections: [
    {
      title: 'Two components',
      content: [
        {
          type: 'prose',
          text: '`Heading` names a section; `Text` is everything else. Between them they carry the sixteen Tecton text styles, so a screen never needs a font size of its own. The full scale, with sizes, weights and line heights, is printed under [Typography](/foundations/typography).',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {Heading, Text} from '@tecton/react';

<Heading level={2}>Facies Modeling</Heading>
<Text variant="small" color="secondary">
  Plurigaussian simulation, Survey 2.
</Text>`,
        },
      ],
    },
    {
      title: 'Pick the variant by the job',
      content: [
        {
          type: 'table',
          columns: ['Job', 'Variant'],
          rows: [
            ['Page or cover title', '`display1`–`display3` on `Heading`'],
            ['Section heading', '`Heading` with the right `level`'],
            ['Body copy, descriptions', '`medium` — the default'],
            ['A label above a field, metadata', '`small`, usually `secondary`'],
            ['A label that needs weight', '`mediumStrong`, `smallStrong`'],
            ['The smallest legible chrome', '`tiny`'],
            ['A measured value', '`largeData`, `mediumData`, `smallData`'],
            ['Custom action-like text', '`actionMedium`, `actionSmall`'],
          ],
        },
      ],
    },
    {
      title: 'Headings and document structure',
      content: [
        {
          type: 'prose',
          text: "`level` sets both the element and the size, which is usually what you want. When the visual size and the document's outline disagree — a big number that is not a section heading, a small heading deep in a panel — set `outlineLevel` to fix the rank without changing the look, so screen-reader users still get a sane outline.",
        },
        {
          type: 'code',
          language: 'tsx',
          code: `<Heading level={3} variant="display3" outlineLevel={2}>
  170.3 mmusd
</Heading>`,
        },
        {
          type: 'list',
          items: [
            'One `level={1}` per page.',
            'Never skip a rank on the way down.',
            'Do not use a heading to make text bigger; use `Text` with a variant.',
          ],
        },
      ],
    },
    {
      title: 'Data text',
      content: [
        {
          type: 'prose',
          text: 'The three data variants are IBM Plex Mono with lining figures. Use one for anything measured — a depth, a cost, a percentage, an identifier — and add `hasTabularNumbers` whenever the values stack, so the digits line up in a column.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `<Text variant="mediumData" hasTabularNumbers>
  2,525 m
</Text>`,
        },
        {
          type: 'prose',
          text: 'Two conventions travel with it: a unit is set smaller and dimmer than the number it follows, and semantic colour goes on the number, never on the surface behind it.',
        },
      ],
    },
    {
      title: 'Colour and weight',
      content: [
        {
          type: 'prose',
          text: '`color` takes a role, not a colour: `primary` for what is being read, `secondary` for labels and metadata, `disabled` for what is unavailable, `accent` for the lilac adornment. `weight` names all four steps, but the Tecton foundation defines two — `semibold` and `bold` resolve to the heaviest weights the theme actually carries. Reach for a variant before you reach for a weight.',
        },
      ],
    },
    {
      title: 'Loading the faces',
      content: [
        {
          type: 'prose',
          text: 'The theme names Figtree and IBM Plex Mono; it does not fetch them. If your document does not load them, everything still renders — one step down the fallback stack, with the data columns no longer aligned. See [Getting started](/docs/getting-started) for the link tags.',
        },
      ],
    },
  ],
};
