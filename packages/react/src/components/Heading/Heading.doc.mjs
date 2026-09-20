/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Heading',
  displayName: 'Heading',
  group: 'Typography',
  category: 'Typography',

  keywords: ['heading', 'title', 'h1', 'display', 'hierarchy'],

  usage: {
    description:
      'Heading names a section. `level` sets both the element and the size, so the document outline and the visual hierarchy stay the same thing; `variant` overrides the size with one of the display sizes without changing the element.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pick the level from the document outline, then fix the size with `variant` if it needs to be bigger.',
      },
      {
        guidance: true,
        description:
          'Use a display size for a figure that is the point of the screen — a number, a name.',
      },
      {
        guidance: false,
        description:
          'Skip a level to get a smaller heading. Use `outlineLevel` if the outline and the look really must differ.',
      },
    ],
    accessibility:
      'The rank assistive technology announces follows `level`, or `outlineLevel` when the visual hierarchy and the outline have to differ.',
    anatomy: [
      {
        name: 'Text',
        required: true,
        description: 'The heading itself.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The heading text.',
      required: true,
    },
    {
      name: 'level',
      type: 'HeadingLevel',
      description: 'Heading rank, 1–6: the element rendered and the size used.',
      required: true,
    },
    {
      name: 'variant',
      type: 'HeadingVariant',
      description: "A display size to use instead of the level's own size.",
    },
    {
      name: 'weight',
      type: 'TextWeight',
      description:
        'Font weight, overriding the weight the level or variant carries.',
    },
    {
      name: 'color',
      type: 'TextColor',
      description: 'Ink role.',
      default: "'primary'",
    },
    {
      name: 'outlineLevel',
      type: 'HeadingLevel',
      description:
        'Rank announced to assistive technology, when the visual rank and the document outline have to differ.',
    },
    {
      name: 'maxLines',
      type: 'number',
      description:
        'Maximum number of lines before the heading truncates with an ellipsis. `0` never truncates.',
      default: '0',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      description: "Alignment within the heading's own box.",
      default: "'start'",
    },
    {
      name: 'id',
      type: 'string',
      description: 'Id applied to the heading element.',
    },
  ],

  examples: ['HeadingBasic', 'HeadingLevels'],

  notes: [
    "Tecton's type foundation names `heading1` and `heading2`; levels 3 to 6 continue the ladder with the interface variants that sit at those sizes, which is what the design's sub-headings actually use.",
    "Tecton's foundation defines two weights, 400 and 500. `semibold` and `bold` are part of the API and resolve to the heaviest weights the theme carries, which today are 500 and 600.",
  ],
};
