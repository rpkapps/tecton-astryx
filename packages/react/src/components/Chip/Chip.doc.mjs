/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Chip',
  displayName: 'Chip',
  group: 'Chip',
  category: 'Content',

  keywords: ['chip', 'tag', 'token', 'filter', 'removable'],

  usage: {
    description:
      'Chip is a compact label for one value the person put there: a filter that is on, a tag on a record, a selection they can take back. A chip with `onRemove` grows an X.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use chips for values someone chose, and badges for values the system assigns.',
      },
      {
        guidance: true,
        description:
          'Give a removable chip a label that says what removing it does — the value itself usually does.',
      },
      {
        guidance: false,
        description: 'Use a chip as a button for an action. That is a button.',
      },
    ],
    accessibility:
      'A removable chip has a remove button with its own name; a clickable chip is a button in its own right.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Leading glyph.',
      },
      {
        name: 'Label',
        required: true,
        description: 'The value.',
      },
      {
        name: 'Remove',
        required: false,
        description: 'Takes the value back out.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description: 'The chip text.',
      required: true,
    },
    {
      name: 'size',
      type: 'ChipSize',
      description: 'Chip height.',
      default: "'md'",
    },
    {
      name: 'color',
      type: 'ChipColor',
      description: 'Colour role.',
      default: "'default'",
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph rendered before the label, by name or as an SVG component.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and dims the chip.',
      default: 'false',
    },
    {
      name: 'onRemove',
      type: '(event: MouseEvent) => void',
      description:
        'When set, the chip carries a remove button that calls this.',
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent) => void',
      description:
        'When set without `onRemove`, the whole chip behaves as a button.',
    },
  ],

  examples: ['ChipBasic', 'ChipRemovable'],

  notes: [
    "Tecton's filled and outlined chip emphases have no prop underneath: every chip is drawn in the one treatment the theme paints.",
    "Tecton's chip colours are named for meaning (primary, info, success…) and mapped onto the hue underneath, so `primary` is the violet, `info` the periwinkle and so on.",
  ],
};
