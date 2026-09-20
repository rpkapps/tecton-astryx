/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'ToggleButton',
  displayName: 'ToggleButton',
  group: 'ToggleButton',
  category: 'Action',

  keywords: ['toggle', 'pressed', 'activated', 'state', 'button'],

  usage: {
    description:
      "ToggleButton is a button that stays down: a setting that is on, a layer that is shown, a panel that is open. It carries the activated look the rest of Tecton's buttons only pass through on the way to a click.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Label the button with what it turns on, so down means on.',
      },
      {
        guidance: true,
        description:
          'Give it a `pressedIcon` when the glyph should change with the state.',
      },
      {
        guidance: false,
        description: 'Use a toggle button for an action that happens once.',
      },
    ],
    accessibility:
      'The button reports whether it is pressed, so the state is announced rather than only drawn.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'The glyph, which may change when pressed.',
      },
      {
        name: 'Label',
        required: true,
        description: 'What the button turns on.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'What the button turns on. Visible text, or the accessible name when the button is icon-only.',
      required: true,
    },
    {
      name: 'isPressed',
      type: 'boolean',
      description:
        'Whether the button is down. Ignored inside a `ToggleButtonGroup`.',
    },
    {
      name: 'onPressedChange',
      type: '(isPressed: boolean) => void',
      description:
        'Called with the new state. Ignored inside a `ToggleButtonGroup`.',
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph shown while the button is up, by name or as an SVG component.',
    },
    {
      name: 'pressedIcon',
      type: 'TectonIconRef',
      description:
        'Glyph shown while the button is down. Falls back to `icon`.',
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description:
        'Drops the visible text and uses `label` as the accessible name and the tooltip. Needs `icon`.',
      default: 'false',
    },
    {
      name: 'size',
      type: 'ToggleButtonSize',
      description: 'Control height.',
      default: "'medium'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and recesses the fill.',
      default: 'false',
    },
    {
      name: 'value',
      type: 'string',
      description:
        'The value this button contributes inside a `ToggleButtonGroup`.',
    },
  ],

  examples: [
    'ToggleButtonBasic',
    'ToggleButtonColor',
    'ToggleButtonIconSwap',
    'ToggleButtonStates',
  ],

  notes: [
    'Tecton names four sizes and the scale underneath has three, so `extraSmall` and `small` are both drawn at the smallest.',
    'There is no variant prop: the toggle button underneath has one emphasis.',
  ],
};
