/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'CheckboxGroup',
  displayName: 'CheckboxGroup',
  group: 'Checkbox',
  category: 'Forms',

  keywords: ['checkbox', 'group', 'multi-select', 'list', 'form'],

  usage: {
    description:
      'CheckboxGroup is a labelled set of checkboxes sharing one value: the keys that are checked. Use it whenever the choices answer one question.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Label the group with the question, and each item with an answer to it.',
      },
      {
        guidance: true,
        description:
          'Keep the order stable; a list that re-sorts as it is checked is impossible to use.',
      },
      {
        guidance: false,
        description: 'Use a group of one. A lone checkbox needs no group.',
      },
    ],
    accessibility:
      'The group label is announced before the items, so each choice is heard in context.',
    anatomy: [
      {
        name: 'Group label',
        required: true,
        description: 'The question.',
      },
      {
        name: 'Items',
        required: true,
        description: 'The choices.',
      },
      {
        name: 'Status',
        required: false,
        description: 'Validation feedback for the whole set.',
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
      name: 'items',
      type: 'readonly CheckboxGroupItem[]',
      description: 'The choices, in the order they are shown.',
      required: true,
    },
    {
      name: 'value',
      type: 'readonly string[]',
      description: 'The keys that are currently checked.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string[]) => void',
      description: 'Called with the new set of checked keys.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text under the group label.',
    },
    {
      name: 'density',
      type: 'CheckboxGroupDensity',
      description: 'How much air each row gets.',
      default: "'balanced'",
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: 'Draws a hairline between the rows.',
      default: 'false',
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
      description: 'Disables every row in the group.',
      default: 'false',
    },
    {
      name: 'status',
      type: 'FieldStatus',
      description: 'Validation feedback for the group.',
    },
  ],

  examples: ['CheckboxGroupBasic'],
};
