/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'RadioGroup',
  displayName: 'RadioGroup',
  group: 'Radio',
  category: 'Forms',

  keywords: ['radio group', 'options', 'single choice', 'form'],

  usage: {
    description:
      'RadioGroup is a labelled set of mutually exclusive options. Exactly one is chosen at a time; if the question can be left unanswered, give it an explicit "none" option rather than starting with no value.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use radios up to about six options and a select beyond that.',
      },
      {
        guidance: true,
        description:
          'Keep the options in a meaningful order — by size, by frequency, by time.',
      },
      {
        guidance: false,
        description:
          'Use `horizontal` for more than three options; the grouping stops being obvious.',
      },
    ],
    accessibility:
      'The group is a radio group with its label announced before the options.',
    anatomy: [
      {
        name: 'Group label',
        required: true,
        description: 'The question.',
      },
      {
        name: 'Options',
        required: true,
        description: 'The answers.',
      },
      {
        name: 'Status',
        required: false,
        description: 'Validation feedback for the group.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label for the whole set; always rendered for assistive technology.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The `Radio` options.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The value of the chosen option.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Called with the value of the option the user chose.',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text under the group label.',
    },
    {
      name: 'orientation',
      type: 'RadioGroupOrientation',
      description: 'Which way the options run.',
      default: "'vertical'",
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Control size: `md` is 16px, `sm` is 13px.',
      default: "'md'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the group label, keeping it for assistive technology.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables every option in the group.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the question required.',
      default: 'false',
    },
    {
      name: 'status',
      type: 'FieldStatus',
      description: 'Validation feedback for the group.',
    },
    {
      name: 'name',
      type: 'string',
      description:
        'HTML name shared by the options, for a group that submits with a form.',
    },
  ],

  examples: ['RadioGroupBasic'],
};
