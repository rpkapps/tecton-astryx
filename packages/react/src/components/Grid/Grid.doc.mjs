/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Grid',
  displayName: 'Grid',
  group: 'Layout',
  category: 'Layout',

  keywords: ['grid', 'columns', 'layout', 'responsive'],

  usage: {
    description:
      'Grid lays children out in columns. Give `columns` a number for a fixed count, or a minimum column width to let the grid fit as many as the space allows.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Prefer a minimum width over a fixed count, so the layout survives a narrow panel.',
      },
      {
        guidance: true,
        description:
          'Set `gap` from the spacing scale rather than adding margins to the children.',
      },
      {
        guidance: false,
        description: 'Use a grid for a single column. A stack says it better.',
      },
    ],
    accessibility:
      'A grid is visual layout only; it changes nothing about reading order.',
    anatomy: [
      {
        name: 'Tracks',
        required: true,
        description: 'The columns the children land in.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The children to lay out.',
    },
    {
      name: 'columns',
      type: 'GridColumns',
      description: 'How many columns the grid has.',
    },
    {
      name: 'gap',
      type: 'SpaceStep',
      description: 'Space between the children, as a step on the spacing grid.',
    },
    {
      name: 'rowGap',
      type: 'SpaceStep',
      description: 'Space between the rows, overriding `gap` on that axis.',
    },
    {
      name: 'columnGap',
      type: 'SpaceStep',
      description: 'Space between the columns, overriding `gap` on that axis.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'How the children sit within their row.',
      default: "'stretch'",
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'How the children sit within their column.',
      default: "'stretch'",
    },
    {
      name: 'width',
      type: 'number | string',
      description: 'Width — a number is pixels, a string is used as-is.',
    },
    {
      name: 'maxWidth',
      type: 'number | string',
      description:
        'Maximum width — a number is pixels, a string is used as-is.',
    },
    {
      name: 'minHeight',
      type: 'number | string',
      description:
        'Minimum height — a number is pixels, a string is used as-is.',
    },
  ],

  examples: [
    'GridBasic',
    'GridDashboardLayout',
    'GridGalleryExample',
    'GridResponsiveAutoFit',
    'GridShowcase',
    'GridWithGridSpan',
  ],
};
