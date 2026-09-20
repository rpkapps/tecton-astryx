/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Switch',
  displayName: 'Switch',
  group: 'Switch',
  category: 'Forms',

  keywords: ['switch', 'toggle', 'setting', 'on off'],

  usage: {
    description:
      'Switch is an immediate on/off setting — it takes effect the moment it is flipped, with no separate save. If the change needs confirming, use a checkbox in a form instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Label the switch with what it turns on, so "on" needs no explanation.',
      },
      {
        guidance: true,
        description:
          'Apply the change immediately; a switch with a Save button is a checkbox.',
      },
      {
        guidance: false,
        description: 'Use a switch in a form that is submitted all at once.',
      },
    ],
    accessibility:
      'The control is a switch, so its state is announced as on or off rather than checked.',
    anatomy: [
      {
        name: 'Track',
        required: true,
        description: 'The channel the knob runs in.',
      },
      {
        name: 'Knob',
        required: true,
        description: 'The part that moves.',
      },
      {
        name: 'Label',
        required: true,
        description: 'What the switch controls.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label next to the switch; always rendered for assistive technology.',
      required: true,
    },
    {
      name: 'value',
      type: 'boolean',
      description: 'Whether the switch is on.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(isOn: boolean) => void',
      description: 'Called with the new state when the switch is flipped.',
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Control size.',
      default: "'md'",
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text under the label.',
    },
    {
      name: 'labelPosition',
      type: 'SwitchLabelPosition',
      description: 'Which side of the switch the label sits on.',
      default: "'end'",
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
      description: 'Validation feedback for the setting.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'HTML name, for a switch that submits with a form.',
    },
  ],

  examples: ['SwitchBasic'],

  notes: [
    "Tecton's off track is an outline with no fill, which survived into the theme. Disabled-and-on cannot drop the violet to grey the way the design does: that is two states at once and only one is addressable.",
  ],
};
