/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Checkbox',
  displayName: 'Checkbox',
  group: 'Checkbox',
  category: 'Forms',

  keywords: ['checkbox', 'toggle', 'choice', 'indeterminate', 'form'],

  usage: {
    description:
      'Checkbox is one independent choice: on, off, or — when it stands for a set of choices below it — indeterminate. Several related choices belong in a CheckboxGroup.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Word the label as the thing being turned on, so checked means yes.',
      },
      {
        guidance: true,
        description:
          'Use `indeterminate` only on a checkbox that summarises others.',
      },
      {
        guidance: false,
        description:
          'Use a checkbox for something that takes effect immediately. That is a switch.',
      },
    ],
    accessibility:
      'The label names the control and is clickable. Indeterminate is reported as a mixed state, not as unchecked.',
    anatomy: [
      {
        name: 'Box',
        required: true,
        description:
          'The control, showing checked, unchecked or indeterminate.',
      },
      {
        name: 'Label',
        required: true,
        description: 'What is being chosen.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Helper text under the label.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label next to the box; always rendered for assistive technology.',
      required: true,
    },
    {
      name: 'value',
      type: 'CheckboxValue',
      description: 'Whether the box is checked, unchecked or indeterminate.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(isChecked: boolean) => void',
      description: 'Called with the new checked state when the box is toggled.',
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Box size: `md` is 16px, `sm` is 12px.',
      default: "'md'",
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text under the label.',
    },
    {
      name: 'status',
      type: 'FieldStatus & {message: string}',
      description: 'Validation feedback; an error also sets `aria-invalid`.',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the label, keeping it for assistive technology.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and dims the control.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description: 'Shows the state at full strength but blocks toggling.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the choice required.',
      default: 'false',
    },
    {
      name: 'name',
      type: 'string',
      description: 'HTML name, for a checkbox that submits with a form.',
    },
  ],

  examples: [
    'CheckboxBasic',
    'CheckboxIndeterminateState',
    'CheckboxStatusVariations',
  ],

  notes: [
    "Tecton's indeterminate box is filled with a dark dash; the box underneath keeps the unchecked fill and swaps the mark, and the indeterminate state is not addressable by the theme.",
  ],
};
