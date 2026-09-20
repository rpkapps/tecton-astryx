/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Badge',
  displayName: 'Badge',
  group: 'Badge',
  category: 'Content',

  keywords: ['badge', 'pill', 'label', 'status', 'count', 'tag'],

  usage: {
    description:
      'Badge is a small pill that labels the thing next to it — a state, a count, a category. It sits in the flow like a word and is never interactive.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the label to a word or two; a badge is one line and cuts what does not fit.',
      },
      {
        guidance: true,
        description:
          'Use the semantic colours for state and the hue colours for categories that have no ranking.',
      },
      {
        guidance: false,
        description:
          'Make a badge clickable. A chip is the removable, clickable one.',
      },
    ],
    accessibility:
      'A badge is read with the content around it. If it is the only thing carrying a meaning, put that meaning in nearby text too.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Leading glyph.',
      },
      {
        name: 'Label',
        required: true,
        description: 'The badge text.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description:
        'The badge text. One line — longer text is cut with an ellipsis.',
      required: true,
    },
    {
      name: 'variant',
      type: 'BadgeVariant',
      description: 'Colour role.',
      default: "'neutral'",
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph rendered before the label, by name or as an SVG component.',
    },
  ],

  examples: [
    'BadgeBasic',
    'BadgeCategoryTags',
    'BadgeCountBadges',
    'BadgeShowcase',
    'BadgeStatusLabels',
    'BadgeVariants',
  ],

  notes: [
    "Tecton's own Badge in the design is an overlay anchored to another element's corner, with a count that caps at 99+. That is a different component and is not built. This Badge is the standalone pill the design also draws, and Chip is its interactive sibling.",
  ],
};
