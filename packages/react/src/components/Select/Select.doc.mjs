/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Select',
  displayName: 'Select',
  group: 'Select',
  category: 'Forms',

  keywords: ['select', 'dropdown', 'picker', 'options', 'form'],

  usage: {
    description:
      'Select picks one value from a known list. Below about half a dozen options a radio group is easier to scan; above about twenty, turn on `hasSearch`. Options are data, so a Tecton select never needs anything imported alongside it.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Turn on `hasSearch` once the list is long enough to scroll.',
      },
      {
        guidance: true,
        description:
          'Use `appearance="textOnly"` for a select that reads as part of a sentence or sits in a toolbar.',
      },
      {
        guidance: true,
        description: 'Group long lists into sections with titles.',
      },
      {
        guidance: false,
        description: 'Put actions in a select. Actions belong in a menu.',
      },
    ],
    accessibility:
      'The trigger is a combobox; the chosen option is announced, and a search box announces how many options match as it is typed in.',
    anatomy: [
      {
        name: 'Label',
        required: true,
        description: 'What is being chosen.',
      },
      {
        name: 'Trigger',
        required: true,
        description: 'The field showing the current value.',
      },
      {
        name: 'Options',
        required: true,
        description: 'The list, with its sections and dividers.',
      },
      {
        name: 'Clear',
        required: false,
        description: 'Takes the choice back out.',
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
      name: 'options',
      type: 'readonly SelectItem[]',
      description: 'The options, sections and dividers to choose from.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The value of the chosen option.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description:
        'Called with the value the user chose. With `hasClear`, clearing the field reports an empty string.',
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Control height.',
      default: "'md'",
    },
    {
      name: 'appearance',
      type: 'SelectAppearance',
      description:
        "The field's appearance: `outlined` for a form, `textOnly` for a select that reads as part of a sentence or a toolbar.",
      default: "'outlined'",
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Text shown while nothing is chosen.',
      default: "'Select...'",
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
      name: 'hasSearch',
      type: 'boolean',
      description: 'Adds a search box above the options.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Adds a clear button once a value is chosen.',
      default: 'false',
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
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field required.',
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

  examples: ['SelectBasic', 'SelectWithSections'],

  notes: [
    "Tecton's filled field appearance has no slot underneath; `outlined` and `textOnly` are the two Tecton ships.",
    'With `hasClear`, clearing reports an empty string rather than null, so the callback keeps one signature.',
  ],
};
