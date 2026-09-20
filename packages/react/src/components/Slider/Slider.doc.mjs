/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Slider',
  displayName: 'Slider',
  group: 'Slider',
  category: 'Forms',

  keywords: ['slider', 'range', 'value', 'marks', 'form'],

  usage: {
    description:
      'Slider picks a number, or a range of two, by position rather than by typing. Give it a `formatValue` whenever the number means something — depths, pressures, percentages — so the value is announced in the units the person reads.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use a slider when the rough position matters more than the exact number.',
      },
      {
        guidance: true,
        description: 'Pair it with a field when the exact number matters too.',
      },
      {
        guidance: true,
        description: 'Set `step` to something the data actually moves in.',
      },
      {
        guidance: false,
        description:
          'Use a slider for a value with more than a couple of hundred meaningful positions.',
      },
    ],
    accessibility:
      'Arrow keys move by one step, Home and End jump to the ends, and `formatValue` is what gets announced.',
    anatomy: [
      {
        name: 'Track',
        required: true,
        description: 'The range the value lives in.',
      },
      {
        name: 'Fill',
        required: true,
        description: 'How much of the range is below the value.',
      },
      {
        name: 'Thumb',
        required: true,
        description: 'The handle, one per value.',
      },
      {
        name: 'Marks',
        required: false,
        description: 'Labelled positions on the track.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label above the track; always rendered for assistive technology.',
      required: true,
    },
    {
      name: 'value',
      type: 'SliderValue',
      description: 'The current value: one number, or the two ends of a range.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: SliderValue) => void',
      description: 'Called continuously as the thumb moves.',
    },
    {
      name: 'onChangeEnd',
      type: '(value: SliderValue) => void',
      description: 'Called once, when the drag ends.',
    },
    {
      name: 'min',
      type: 'number',
      description: 'Lowest value.',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Highest value.',
      default: '100',
    },
    {
      name: 'step',
      type: 'number',
      description: 'How far one step moves the value.',
      default: '1',
    },
    {
      name: 'marks',
      type: 'readonly SliderMark[]',
      description: 'Ticks drawn on the track.',
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      description:
        'Formats the value for display and for assistive technology.',
    },
    {
      name: 'valueDisplay',
      type: 'SliderValueDisplay',
      description: 'How the current value is shown.',
      default: "'tooltip'",
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: 'Which way the track runs.',
      default: "'horizontal'",
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text under the label.',
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
      name: 'status',
      type: 'FieldStatus',
      description: 'Validation feedback for the value.',
    },
    {
      name: 'width',
      type: 'number | string',
      description:
        'Width of the whole field — a number is pixels, a string is used as-is.',
    },
  ],

  examples: ['SliderBasic', 'SliderRange'],

  notes: [
    "There is no size prop: Tecton's medium and small sliders differ a lot, and the slider underneath has one size.",
    "Tecton's teal and lime slider colours have no slot, and the design's end labels are drawn as marks rather than as a separate treatment.",
  ],
};
