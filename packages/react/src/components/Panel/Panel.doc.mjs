/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Panel',
  displayName: 'Panel',
  group: 'Panel',
  category: 'Surfaces',

  keywords: ['panel', 'surface', 'region', 'header', 'sidebar'],

  usage: {
    description:
      'Panel is the titled surface Tecton builds screens out of: a header row with a title, optional actions and an optional close, a 1px rule under it, and the content below. Like every Tecton surface it is darker than the page it floats on.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give a panel a title; it is the landmark people scan for.',
      },
      {
        guidance: true,
        description:
          'Keep header actions to the one or two that act on the whole panel.',
      },
      {
        guidance: true,
        description:
          'Pass an accessible label when a panel has no visible title, so the region is still announced.',
      },
      {
        guidance: false,
        description:
          'Nest panels more than one level deep; the nested surfaces stop reading as separate regions.',
      },
      {
        guidance: false,
        description:
          'Use a panel purely to add padding. Reach for a stack instead.',
      },
    ],
    accessibility:
      'A panel is a labelled region: the title names it, and `aria-label` stands in when there is no visible title.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Leading glyph in the header.',
      },
      {
        name: 'Title',
        required: false,
        description: 'Names the region.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Supporting copy under the title.',
      },
      {
        name: 'Actions',
        required: false,
        description: 'Controls acting on the whole panel.',
      },
      {
        name: 'Close',
        required: false,
        description: 'Takes the panel away.',
      },
      {
        name: 'Body',
        required: true,
        description: 'The content the panel groups.',
      },
    ],
  },

  props: [
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Heading shown in the panel header.',
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph rendered before the title, by name or as an SVG component.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Supporting copy rendered under the title.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description: 'Controls aligned to the end of the header row.',
    },
    {
      name: 'onClose',
      type: '() => void',
      description:
        'When set, the header ends with a close button that calls this.',
    },
    {
      name: 'closeLabel',
      type: 'string',
      description: 'Accessible name for the close button.',
      default: "'Close panel'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Panel content.',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Id applied to the panel element.',
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible label when the panel has no visible title.',
    },
  ],

  examples: ['PanelBasic', 'PanelWithActions'],

  notes: [
    'Tecton owns this component outright. It is written in StyleX against the design tokens, which is what proves the package can ship its own compiled styles.',
    'There is no shadow and no elevation prop. Depth in Tecton is carried by darkness and a rule, which is the inverse of the usual convention.',
  ],
};
