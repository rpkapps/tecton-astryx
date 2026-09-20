/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Fab',
  displayName: 'Fab',
  group: 'Fab',
  category: 'Action',

  keywords: ['fab', 'floating action button', 'primary action', 'elevation'],

  usage: {
    description:
      'Fab is the one action a screen is really for, lifted off the surface and pinned where it can always be reached. A screen has at most one.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use `extended` when the glyph alone would not say what the action is.',
      },
      {
        guidance: true,
        description:
          'Pick an action that applies to the whole screen, not to one row of it.',
      },
      {
        guidance: false,
        description: 'Put two floating actions on one screen.',
      },
    ],
    accessibility:
      'A round action has no visible text, so `label` is its accessible name and its tooltip.',
    anatomy: [
      {
        name: 'Icon',
        required: true,
        description: 'The glyph.',
      },
      {
        name: 'Label',
        required: false,
        description:
          'Visible on an extended action; the accessible name on a round one.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'What the action does. Visible text on an `extended` action, the accessible name on a `round` one.',
      required: true,
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description: 'The glyph, by name or as an SVG component.',
      required: true,
    },
    {
      name: 'shape',
      type: 'FabShape',
      description: 'Which shape the action takes.',
      default: "'round'",
    },
    {
      name: 'variant',
      type: 'FabVariant',
      description: 'Visual emphasis.',
      default: "'primary'",
    },
    {
      name: 'elevation',
      type: 'FabElevation',
      description: 'How far the action is lifted off the surface.',
      default: "'med'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and recesses the fill.',
      default: 'false',
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler<HTMLButtonElement>',
      description: 'Click handler.',
    },
  ],

  examples: ['FabBasic'],

  notes: [
    'This is the one raised surface in Tecton. Everything else is flat and separated by darkness and a rule.',
    'The pill radius the design draws on the round shape is a theme concern; the shape here takes the theme corner.',
  ],
};
