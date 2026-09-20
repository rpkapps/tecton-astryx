/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Divider',
  displayName: 'Divider',
  group: 'Divider',
  category: 'Layout',

  keywords: ['divider', 'rule', 'separator', 'hairline', 'section'],

  usage: {
    description:
      'Divider is a hairline between two pieces of content. Tecton names three emphases and they differ only in colour — every divider is 1px, whatever its weight.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use `subtle` inside a component, `medium` between rows of content, and `strong` where a real break is meant.',
      },
      {
        guidance: true,
        description:
          'Let spacing separate things first, and reach for a rule only when spacing is not enough.',
      },
      {
        guidance: false,
        description:
          'Put a rule between every row of a list. The rows already read as rows.',
      },
    ],
    accessibility: 'A divider is decorative and is not announced.',
    anatomy: [
      {
        name: 'Rule',
        required: true,
        description: 'The 1px line.',
      },
      {
        name: 'Label',
        required: false,
        description: 'Text centred on the rule.',
      },
    ],
  },

  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: 'Which way the rule runs.',
      default: "'horizontal'",
    },
    {
      name: 'variant',
      type: 'DividerVariant',
      description: 'How strongly the rule reads.',
      default: "'subtle'",
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Text centred on the rule.',
    },
    {
      name: 'isFullBleed',
      type: 'boolean',
      description:
        "Extends the rule to the edges of its container, past the container's own padding.",
      default: 'false',
    },
  ],

  examples: [
    'DividerBasic',
    'DividerFullBleed',
    'DividerShowcase',
    'DividerVariants',
    'DividerVertical',
  ],

  notes: [
    "The variant axis underneath is `subtle | strong`. Tecton's third emphasis, `medium`, is painted here from the design's own token as a style preset rather than a theme variant.",
  ],
};
