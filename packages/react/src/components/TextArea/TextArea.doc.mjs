/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'TextArea',
  displayName: 'TextArea',
  group: 'TextField',
  category: 'Forms',

  keywords: ['textarea', 'multiline', 'notes', 'comment', 'form'],

  usage: {
    description:
      'TextArea takes several lines of text, in the same outlined appearance as TextField. Size it with `rows` — `size` only sets the padding.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set `rows` to about what a typical answer needs, so the field says how much is expected.',
      },
      {
        guidance: true,
        description:
          'Use `maxLength` when there really is a limit; it shows a counter and warns before it is passed.',
      },
      {
        guidance: false,
        description: 'Use a text area for a single-line value.',
      },
    ],
    accessibility:
      'The label is always rendered for assistive technology, and an error sets the field invalid as well as colouring it.',
    anatomy: [
      {
        name: 'Label',
        required: true,
        description: 'What the field is for.',
      },
      {
        name: 'Field',
        required: true,
        description: 'Where the text goes.',
      },
      {
        name: 'Helper text',
        required: false,
        description: 'Guidance, or the validation message.',
      },
      {
        name: 'Counter',
        required: false,
        description: 'Characters used against the limit.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label shown above the field; always rendered for assistive technology.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: "The field's current value.",
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Called with the new value on every keystroke.',
    },
    {
      name: 'rows',
      type: 'number',
      description: 'How many lines of text are visible.',
      default: '3',
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Padding inside the field.',
      default: "'md'",
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Ghost text shown while the field is empty.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text shown under the field.',
    },
    {
      name: 'startIcon',
      type: 'TectonIconRef',
      description: 'Glyph rendered inside the leading edge of the field.',
    },
    {
      name: 'status',
      type: 'FieldStatus',
      description: 'Validation feedback; an error also sets `aria-invalid`.',
    },
    {
      name: 'maxLength',
      type: 'number',
      description:
        'Largest number of characters the field expects. Shows a counter, and turns it red once the text runs past.',
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
      description: 'Prevents interaction and dims the field.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description: 'Shows the value at full strength but blocks editing.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field required and sets `aria-required`.',
      default: 'false',
    },
    {
      name: 'name',
      type: 'string',
      description: 'HTML name, for a field that submits with a form.',
    },
    {
      name: 'width',
      type: 'number | string',
      description:
        'Width of the whole field — a number is pixels, a string is used as-is.',
    },
  ],

  examples: [
    'TextAreaBasic',
    'TextAreaCharacterCount',
    'TextAreaShowcase',
    'TextAreaStates',
    'TextAreaValidation',
    'TextAreaWithIcon',
  ],

  notes: [
    'Validation is drawn the way the design draws it: plain coloured helper text under the field, never the boxed callout the control underneath uses by default.',
  ],
};
