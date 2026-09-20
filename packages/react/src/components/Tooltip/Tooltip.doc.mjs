/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Tooltip',
  displayName: 'Tooltip',
  group: 'Tooltip',
  category: 'Overlay',

  keywords: ['tooltip', 'hint', 'hover', 'popover', 'help'],

  usage: {
    description:
      'Tooltip is a short note revealed on hover and keyboard focus. It supplements the thing it points at — never put anything in it the interface cannot be used without.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep it to a line or two; a tooltip is a hint, not documentation.',
      },
      {
        guidance: true,
        description:
          'Use it to name an icon-only control, or to expand an abbreviation.',
      },
      {
        guidance: false,
        description: 'Put a control inside a tooltip. Nobody can reach it.',
      },
      {
        guidance: false,
        description:
          'Put information in a tooltip that is needed to complete a task.',
      },
    ],
    accessibility:
      'The tooltip opens on keyboard focus as well as hover, and closes on Escape, so it is not pointer-only.',
    anatomy: [
      {
        name: 'Trigger',
        required: true,
        description: 'What the tooltip describes.',
      },
      {
        name: 'Content',
        required: true,
        description: 'The note.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The element the tooltip describes.',
      required: true,
    },
    {
      name: 'content',
      type: 'ReactNode',
      description: 'The note itself. Keep it to a line or two.',
      required: true,
    },
    {
      name: 'placement',
      type: 'TooltipPlacement',
      description: 'Which side of the trigger the tooltip appears on.',
      default: "'above'",
    },
    {
      name: 'alignment',
      type: 'TooltipAlignment',
      description: 'How the tooltip lines up along the placement axis.',
      default: "'center'",
    },
    {
      name: 'delayMs',
      type: 'number',
      description:
        'How long the pointer must rest before the tooltip opens, in milliseconds.',
      default: '200',
    },
    {
      name: 'isEnabled',
      type: 'boolean',
      description:
        'Whether the tooltip responds at all — turn it off rather than swapping the tree when a note is conditional.',
      default: 'true',
    },
  ],

  examples: ['TooltipBasic'],

  notes: [
    'Buttons, icon buttons and fields have their own `tooltip` prop; prefer it over wrapping them, because a disabled control swallows the hover events this component needs.',
  ],
};
