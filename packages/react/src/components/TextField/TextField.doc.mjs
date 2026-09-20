/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'TextField',
  displayName: 'TextField',
  group: 'TextField',
  category: 'Forms',

  keywords: ['text field', 'input', 'form', 'outlined', 'validation'],

  usage: {
    description:
      'TextField takes one line of text: a name, a query, a number typed in. It is drawn in the outlined appearance — a transparent field inside a 1px rule, a label above and helper text below.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Label every field. A placeholder is not a label: it disappears as soon as someone types.',
      },
      {
        guidance: true,
        description:
          'Say what is wrong and how to fix it in the status message, not just that something is wrong.',
      },
      {
        guidance: true,
        description:
          'Use `description` for guidance people need before they type, not after.',
      },
      {
        guidance: false,
        description:
          'Use a field for a value that has a known, short list of answers. That is a select.',
      },
    ],
    accessibility:
      'The label is always rendered for assistive technology, even when hidden. An error sets the field invalid as well as colouring it.',
    anatomy: [
      {
        name: 'Label',
        required: true,
        description:
          'What the field is for. Turns pink on focus and red on error.',
      },
      {
        name: 'Start icon',
        required: false,
        description: 'A glyph inside the leading edge.',
      },
      {
        name: 'Field',
        required: true,
        description: 'The value, or the placeholder.',
      },
      {
        name: 'Helper text',
        required: false,
        description: 'Guidance, or the validation message.',
      },
      {
        name: 'Clear',
        required: false,
        description: 'Empties the field.',
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
      name: 'type',
      type: 'TextFieldType',
      description: 'What the field holds.',
      default: "'text'",
    },
    {
      name: 'size',
      type: 'TextFieldSize',
      description: 'Control height.',
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
      description:
        'Shows the value at full strength but blocks editing, keeping the field in the tab order.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field required and sets `aria-required`.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Marks the field optional.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Shows a clear button once the field has a value.',
      default: 'false',
    },
    {
      name: 'onEnter',
      type: '() => void',
      description: 'Called when the user presses Enter.',
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
    'TextFieldBasic',
    'TextFieldIcon',
    'TextFieldSearch',
    'TextFieldShowcase',
    'TextFieldSizes',
    'TextFieldStates',
    'TextFieldStatusVariant',
    'TextFieldTypes',
    'TextFieldValidation',
  ],

  notes: [
    "Only the outlined appearance ships. The design's filled and text-only fields have no variant axis underneath, and the dotted disabled-filled rule, the solid red filled error surface and the violet-tinted active interior are all unreachable.",
    'Validation is drawn the way the design draws it: plain coloured helper text under the field, never the boxed callout the control underneath uses by default.',
  ],
};
