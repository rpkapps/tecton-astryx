/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Autocomplete',
  displayName: 'Autocomplete',
  group: 'Autocomplete',
  category: 'Forms',

  keywords: [
    'autocomplete',
    'typeahead',
    'search',
    'combobox',
    'suggestions',
    'filter',
  ],

  usage: {
    description:
      'Autocomplete narrows a long list as the person types. Reach for it when the list is too long to scroll — a well, a horizon, a person — and for a short, known list use Select instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give it `options` when the list is already in memory and `onSearch` when it has to be fetched.',
      },
      {
        guidance: true,
        description:
          'Set `debounceMs` to 0 for a list in memory, so the results keep up with the typing.',
      },
      {
        guidance: true,
        description:
          'Say what an empty result means — "No wells match" beats "No results".',
      },
      {
        guidance: false,
        description:
          'Use it for fewer than about a dozen options; a select shows them all at once.',
      },
    ],
    accessibility:
      'The field is a combobox: the list is announced as it opens and the highlighted suggestion is announced as it changes.',
    anatomy: [
      {
        name: 'Label',
        required: true,
        description: 'What the field is for.',
      },
      {
        name: 'Field',
        required: true,
        description: 'Where the query is typed.',
      },
      {
        name: 'Suggestions',
        required: true,
        description: 'The matches, as they narrow.',
      },
      {
        name: 'Clear',
        required: false,
        description: 'Takes the chosen suggestion back out.',
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
      type: 'AutocompleteOption | null',
      description: 'The chosen suggestion, or `null` when nothing is chosen.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(option: AutocompleteOption | null) => void',
      description:
        'Called with the suggestion the user chose, or `null` when it is cleared.',
      required: true,
    },
    {
      name: 'options',
      type: 'readonly AutocompleteOption[]',
      description: 'The suggestions, when the list is known up front.',
    },
    {
      name: 'onSearch',
      type: '( query: string, ) => readonly AutocompleteOption[] | Promise<readonly AutocompleteOption[]>',
      description:
        'Finds the suggestions for a query, when the list has to be fetched. Takes precedence over `options`.',
    },
    {
      name: 'size',
      type: 'ControlSize',
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
      name: 'maxSuggestions',
      type: 'number',
      description: 'How many suggestions to show at once.',
      default: '10',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description: 'How many characters must be typed before the list opens.',
      default: '1',
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        'How long to wait after the last keystroke before searching, in milliseconds. Set it to 0 for a list that is already in memory.',
      default: '150',
    },
    {
      name: 'hasSuggestionsOnFocus',
      type: 'boolean',
      description: 'Opens the list on focus, before anything has been typed.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Shows a clear button once a suggestion is chosen.',
      default: 'true',
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
      name: 'emptyText',
      type: 'string',
      description: 'What the list says when nothing matches.',
      default: "'No results found'",
    },
    {
      name: 'width',
      type: 'number | string',
      description:
        'Width of the whole field — a number is pixels, a string is used as-is.',
    },
  ],

  examples: ['AutocompleteBasic'],

  notes: [
    "Tecton's tokenised, multi-value autocomplete is not part of this component — it is a different control underneath, and it is not built yet.",
    "Only the outlined appearance is offered; the design's filled and text-only fields have no variant axis to hang off.",
  ],
};
