/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Text',
  displayName: 'Text',
  group: 'Typography',
  category: 'Typography',

  keywords: ['text', 'body', 'label', 'data', 'monospace', 'type scale'],

  usage: {
    description:
      'Text sets a run of words in one of the Tecton type variants. The three data variants are the monospace face every numeric readout in Tecton uses; the two action variants are the label sizes controls are set in.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use a data variant for every number, unit, code and identifier — it is the strongest convention in the system.',
      },
      {
        guidance: true,
        description:
          'Turn on `hasTabularNumbers` for figures in a column, so digits line up.',
      },
      {
        guidance: true,
        description:
          'Let the variant carry the weight; override `weight` only for a genuine emphasis.',
      },
      {
        guidance: false,
        description: 'Use a display variant for body copy.',
      },
    ],
    accessibility:
      'Use `as` to render a paragraph as a paragraph and a label as a label; the variant is about size, not about meaning.',
    anatomy: [
      {
        name: 'Text',
        required: true,
        description: 'The words themselves.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The text itself.',
      required: true,
    },
    {
      name: 'variant',
      type: 'TextVariant',
      description: 'Which variant of the Tecton type scale to set the text in.',
      default: "'medium'",
    },
    {
      name: 'weight',
      type: 'TextWeight',
      description: 'Font weight, overriding the weight the variant carries.',
    },
    {
      name: 'color',
      type: 'TextColor',
      description: 'Ink role.',
      default: "'primary'",
    },
    {
      name: 'display',
      type: "'inline' | 'block'",
      description: 'Whether the text flows inline or forms its own block.',
      default: "'inline'",
    },
    {
      name: 'as',
      type: 'TextElement',
      description: 'Which element to render.',
      default: "'span'",
    },
    {
      name: 'maxLines',
      type: 'number',
      description:
        'Maximum number of lines before the text truncates with an ellipsis. `0` never truncates.',
      default: '0',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      description: "Alignment within the text's own box.",
      default: "'start'",
    },
    {
      name: 'isStruckThrough',
      type: 'boolean',
      description: 'Renders the text struck through.',
    },
    {
      name: 'hasTabularNumbers',
      type: 'boolean',
      description:
        'Lines up digits in columns — use it for any number in a table.',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Id applied to the text element.',
    },
  ],

  examples: [
    'TextBasic',
    'TextColors',
    'TextHeadingLevels',
    'TextInline',
    'TextShowcase',
    'TextTruncation',
    'TextVariants',
    'TextWordBreak',
    'TextWrap',
  ],

  notes: [
    'Eight of the fourteen variants have no counterpart in the base type scale and are carried by the theme as custom types. The package declares their types itself, so `variant="mediumData"` checks like any other.',
    "Tecton's foundation defines two weights, 400 and 500. `semibold` and `bold` are part of the API and resolve to the heaviest weights the theme carries, which today are 500 and 600.",
  ],
};
