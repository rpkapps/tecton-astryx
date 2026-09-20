/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'ToggleButtonGroup',
  displayName: 'ToggleButtonGroup',
  group: 'ToggleButton',
  category: 'Action',

  keywords: ['segmented control', 'toggle group', 'switcher', 'view'],

  usage: {
    description:
      'ToggleButtonGroup is a row of segments of which exactly one is chosen — a view switch, a unit, a density. The segments are data, so the group never needs anything imported alongside it.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use it for two to five segments; beyond that use a select.',
      },
      {
        guidance: true,
        description:
          'Keep the labels the same shape — all words or all glyphs — so the row reads evenly.',
      },
      {
        guidance: false,
        description:
          'Use it where nothing may be chosen. One segment is always down.',
      },
    ],
    accessibility:
      'The group is a radio group: arrow keys move between segments and the group is one tab stop.',
    anatomy: [
      {
        name: 'Segments',
        required: true,
        description: 'The choices.',
      },
      {
        name: 'Selection',
        required: true,
        description: 'The segment that is down.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name for the group.',
      required: true,
    },
    {
      name: 'items',
      type: 'readonly ToggleButtonGroupItem[]',
      description: 'The segments, in the order they are shown.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The value of the chosen segment.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Called with the value of the segment the user chose.',
      required: true,
    },
    {
      name: 'size',
      type: 'ToggleButtonSize',
      description: 'Control height.',
      default: "'medium'",
    },
    {
      name: 'layout',
      type: 'ToggleButtonGroupLayout',
      description:
        'How the segments share the width of the group: `hug` sizes each to its label, `fill` stretches them equally.',
      default: "'hug'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables every segment in the group.',
      default: 'false',
    },
  ],

  examples: ['ToggleButtonGroupBasic'],

  notes: [
    'Vertical orientation is not supported — the control underneath is a row.',
    'Four Tecton sizes map onto three, so `extraSmall` and `small` are both drawn at the smallest.',
  ],
};
