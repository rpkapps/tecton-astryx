/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'List',
  displayName: 'List',
  group: 'List',
  category: 'Data',

  keywords: ['list', 'rows', 'collection', 'density', 'dividers'],

  usage: {
    description:
      'List is a vertical run of rows that belong to one collection. `density` sets the row height: Tecton draws the default row at 44px and the condensed one at 36px.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give the list a header when it is one of several on a page; it names the list for assistive technology too.',
      },
      {
        guidance: true,
        description:
          'Use `condensed` for data people scan and `default` for rows they read.',
      },
      {
        guidance: false,
        description: 'Use a list for tabular data. Columns want a table.',
      },
    ],
    accessibility:
      'The header is associated with the list, so the collection is announced by name.',
    anatomy: [
      {
        name: 'Header',
        required: false,
        description: 'Names the list.',
      },
      {
        name: 'Rows',
        required: true,
        description: 'The items.',
      },
      {
        name: 'Dividers',
        required: false,
        description: 'Hairlines between the rows.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The rows.',
    },
    {
      name: 'density',
      type: 'ListDensity',
      description: 'Row height.',
      default: "'default'",
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: 'Draws a hairline between the rows.',
      default: 'false',
    },
    {
      name: 'header',
      type: 'ReactNode',
      description:
        'A heading above the list, which also names it for assistive technology.',
    },
    {
      name: 'marker',
      type: 'ListMarker',
      description: 'How the rows are marked.',
      default: "'none'",
    },
    {
      name: 'start',
      type: 'number',
      description: 'The number a `decimal` list counts from.',
      default: '1',
    },
  ],

  examples: [
    'ListBasic',
    'ListBasicList',
    'ListBulletedFeatures',
    'ListMessageList',
    'ListOrderedSteps',
    'ListShowcase',
  ],

  notes: [
    'Tecton names two densities; the scale underneath has three, and `comfortable` is offered as the third rather than hidden.',
    "There is no gutters prop, and the design's `activated` row — a persistent selection distinct from hover — is `isSelected` on the row rather than a list-level mode.",
  ],
};
