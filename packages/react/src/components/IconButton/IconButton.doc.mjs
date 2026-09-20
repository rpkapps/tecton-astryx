/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'IconButton',
  displayName: 'IconButton',
  group: 'Button',
  category: 'Action',

  keywords: ['icon button', 'action', 'toolbar', 'kebab', 'close'],

  usage: {
    description:
      'IconButton is a button whose whole content is one glyph. Use it where the action is obvious from the glyph and space is short — a toolbar, a row action, a panel header.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always give it a label; it is the accessible name and the tooltip.',
      },
      {
        guidance: true,
        description:
          'Use it only for glyphs people already know: close, more, edit, delete.',
      },
      {
        guidance: false,
        description:
          'Use an icon button for the main action of a screen. Say what it does.',
      },
    ],
    accessibility:
      'The label is the accessible name, so an icon button is never unnamed.',
    anatomy: [
      {
        name: 'Icon',
        required: true,
        description: 'The glyph.',
      },
      {
        name: 'Label',
        required: true,
        description: 'The accessible name, not drawn.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name for the control — it has no visible text.',
      required: true,
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description: 'The glyph, by name or as an SVG component.',
      required: true,
    },
    {
      name: 'variant',
      type: 'IconButtonVariant',
      description: 'Visual emphasis.',
      default: "'secondary'",
    },
    {
      name: 'size',
      type: 'IconButtonSize',
      description: 'Control height.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and recesses the fill.',
      default: 'false',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Shows a spinner in place of the glyph while the action is in flight.',
      default: 'false',
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Short text shown on hover and keyboard focus.',
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler<HTMLButtonElement>',
      description: 'Click handler.',
    },
  ],

  examples: ['IconButtonBasic'],

  notes: [
    'Tecton draws icon buttons as circles and as rounded squares; there is no shape prop underneath, so every icon button takes the theme corner.',
    'A button that stays down is a ToggleButton, not an icon button with an activated state.',
  ],
};
