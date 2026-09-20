/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'typography-usage',
  title: 'Using typography',
  description:
    'Which text type to reach for, how headings and document structure relate, and why every number is monospace.',
  category: 'Guides',
  sections: [
    {
      title: 'Two components',
      content: [
        {
          type: 'prose',
          text: '`Heading` names a section; `Text` is everything else. Between them they carry the whole type scale, so a screen never needs a font size of its own. The scale, with sizes, weights and line heights, is printed under [Typography](/docs/foundations/typography).',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {Heading, Text} from '@tecton/react/Text';

<Heading level={2}>Facies Modeling</Heading>
<Text type="supporting" color="secondary">
  Plurigaussian simulation, Survey 2.
</Text>`,
        },
        {
          type: 'prose',
          text: 'Both are the component system’s own — see [Text](/docs/components/Text) and [Heading](/docs/components/Text) for the full props. What Tecton adds is the values in the scale and eight extra `type`s, declared through the theme.',
        },
      ],
    },
    {
      title: 'Pick the type by the job',
      content: [
        {
          type: 'table',
          caption:
            'The built-in `Text` types, and the eight Tecton adds through the theme.',
          columns: ['Job', 'Type'],
          rows: [
            ['Page or cover title', '`display-1`–`display-3` on `Heading`'],
            ['Section heading', '`Heading` with the right `level`'],
            ['Body copy, descriptions', '`body` — the default'],
            ['A lead paragraph', '`large`'],
            ['A label above something', '`label`'],
            ['Metadata, captions, hints', '`supporting`, usually `secondary`'],
            ['Inline code, a token name', '`code`'],
            [
              'A label that needs weight',
              '`mediumStrong`, `smallStrong` *(Tecton)*',
            ],
            ['The smallest legible chrome', '`tiny` *(Tecton)*'],
            [
              'A measured value',
              '`largeData`, `mediumData`, `smallData` *(Tecton)*',
            ],
            [
              'Text inside a control',
              '`actionMedium`, `actionSmall` *(Tecton)*',
            ],
          ],
        },
        {
          type: 'prose',
          text: 'The Tecton types are ordinary values of the existing `type` prop: the theme declares them, so `<Text type="mediumData">` type-checks in your editor.',
        },
      ],
    },
    {
      title: 'Headings and document structure',
      content: [
        {
          type: 'prose',
          text: "`level` sets both the element and the size, which is usually what you want. When the visual size and the document's outline disagree — a big number that is not a section heading, a small heading deep in a card — set `accessibilityLevel` to fix the rank without changing the look, so screen-reader users still get a sane outline.",
        },
        {
          type: 'code',
          language: 'tsx',
          code: `<Heading level={3} type="display-3" accessibilityLevel={2}>
  170.3 mmusd
</Heading>`,
        },
        {
          type: 'list',
          items: [
            'One `level={1}` per page.',
            'Never skip a rank on the way down.',
            'Do not use a heading to make text bigger; use `Text` with a `type`.',
          ],
        },
      ],
    },
    {
      title: 'Data text',
      content: [
        {
          type: 'prose',
          text: 'The three data types are IBM Plex Mono with lining figures. Use one for anything measured — a depth, a cost, a percentage, an identifier — and add `hasTabularNumbers` whenever the values stack, so the digits line up in a column.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `<Text type="mediumData" hasTabularNumbers>
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
          text: '`color` takes a role, not a colour: `primary` for what is being read, `secondary` for labels and metadata, `disabled` for what is unavailable, `placeholder` for an empty field’s prompt, `accent` for the lilac adornment, `inherit` to take the colour of whatever encloses it. `weight` names four steps — `normal`, `medium`, `semibold`, `bold` — but Tecton’s foundation carries two, so `semibold` and `bold` resolve to the heaviest the theme actually defines. Reach for a `type` before you reach for a `weight`.',
        },
      ],
    },
    {
      title: 'Truncation',
      content: [
        {
          type: 'prose',
          text: '`maxLines` clamps to a number of lines, and `hasTruncateTooltip` shows the full text on hover and keyboard focus when it is actually clipped. Use the pair together: a clamped label with no way to read the rest is a label that has lost its meaning.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `<Text maxLines={2} hasTruncateTooltip>
  {description}
</Text>`,
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
