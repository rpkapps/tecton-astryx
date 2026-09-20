/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Radio',
  displayName: 'Radio',
  group: 'Radio',
  category: 'Forms',

  keywords: ['radio', 'option', 'choice', 'form'],

  usage: {
    description:
      'Radio is one option inside a RadioGroup. Tecton draws the selected dot in a light neutral rather than an accent colour.',
    bestPractices: [
      {
        guidance: true,
        description: "Write each option as an answer to the group's question.",
      },
      {
        guidance: false,
        description:
          'Use a radio outside a group. One radio cannot be unchosen.',
      },
    ],
    accessibility:
      'Arrow keys move between the options in a group, and only the chosen one is a tab stop.',
    anatomy: [
      {
        name: 'Circle',
        required: true,
        description: 'The control.',
      },
      {
        name: 'Label',
        required: true,
        description: 'The option.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Helper text under the label.',
      },
    ],
  },

  examples: ['RadioBasic', 'RadioShowcase'],

  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: "The option's label.",
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The value this option sets on the group.',
      required: true,
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Helper text under the label.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents this option from being chosen.',
      default: 'false',
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description: 'Content rendered before the radio circle.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Content rendered after the label.',
    },
  ],
};
