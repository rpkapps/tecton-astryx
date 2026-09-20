/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Icon',
  displayName: 'Icon',
  group: 'Icon',
  category: 'Content',

  keywords: ['icon', 'glyph', 'symbol', 'outline', 'filled'],

  usage: {
    description:
      'Icon draws one of the 131 Tecton glyphs. Icons take the colour of the text beside them, so they belong with a label far more often than on their own.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Leave an icon decorative when text beside it already says the same thing.',
      },
      {
        guidance: true,
        description:
          'Pass `label` only when the glyph carries meaning nothing else repeats.',
      },
      {
        guidance: true,
        description:
          'Use 16 inside dense controls, 20 beside body text and 24 where the glyph is the subject.',
      },
      {
        guidance: false,
        description:
          'Give an icon a label inside a button. The button already has a name.',
      },
    ],
    accessibility:
      'An icon is hidden from assistive technology unless it is given a `label`, which turns it into an image with that name.',
    anatomy: [
      {
        name: 'Glyph',
        required: true,
        description: 'The artwork, outlined or filled.',
      },
    ],
  },

  props: [
    {
      name: 'name',
      type: 'TectonIconName',
      description: 'Which Tecton glyph to draw.',
      required: true,
    },
    {
      name: 'variant',
      type: 'TectonIconVariant',
      description: 'Which cut of the glyph to draw.',
      default: "'outline'",
    },
    {
      name: 'size',
      type: 'TectonIconSize',
      description: 'Rendered size, in pixels.',
      default: '16',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for a glyph that carries meaning on its own. Leave it unset for decoration and the icon is hidden from assistive technology.',
    },
  ],

  examples: [
    'IconBasic',
    'IconNonSemanticColors',
    'IconSemanticColors',
    'IconShowcase',
    'IconSizes',
  ],

  notes: [
    '`strata` is the one glyph that does not take the surrounding colour: its top face is drawn in the purple-to-orange gradient the design gives it. Every other glyph paints in `currentColor`.',
    'Every glyph is also a component — `DrillBitIcon`, `SeismicIcon` — exported from `@tecton/react/icons`, for a prop that wants the glyph itself rather than a name.',
  ],
};
