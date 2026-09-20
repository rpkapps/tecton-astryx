/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'ButtonGroup',
  displayName: 'ButtonGroup',
  group: 'Button',
  category: 'Action',

  keywords: ['button group', 'segmented', 'actions', 'toolbar', 'split'],

  usage: {
    description:
      'ButtonGroup joins buttons into one control for actions that belong together — a set of exports, a split action and its menu.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give the group a label; it is what assistive technology announces for the set.',
      },
      {
        guidance: true,
        description: 'Set the size on the group rather than on each button.',
      },
      {
        guidance: false,
        description:
          'Mix emphases inside a group unless one action really does lead.',
      },
    ],
    accessibility:
      'The group is labelled as a whole; each button keeps its own name.',
    anatomy: [
      {
        name: 'Buttons',
        required: true,
        description: 'The actions, joined edge to edge.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The buttons in the group.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name for the group.',
      required: true,
    },
    {
      name: 'orientation',
      type: 'ButtonGroupOrientation',
      description: 'Which way the buttons run.',
      default: "'horizontal'",
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Control height for every button in the group.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables every button in the group.',
      default: 'false',
    },
  ],

  examples: ['ButtonGroupBasic'],

  notes: [
    'There is no group-level variant: emphasis is set per button, as it is on the group underneath.',
  ],
};
