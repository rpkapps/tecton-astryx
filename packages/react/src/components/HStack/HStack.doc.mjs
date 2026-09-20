/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'HStack',
  displayName: 'HStack',
  group: 'Layout',
  category: 'Layout',

  keywords: ['hstack', 'row', 'horizontal', 'layout', 'flex'],

  usage: {
    description:
      'HStack is a Stack that runs left to right. Everything else about it is the same.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reach for HStack rather than Stack with a direction; the name says what the layout does.',
      },
      {
        guidance: true,
        description:
          'Use `align="center"` for a row of controls, so labels and glyphs line up on their middles.',
      },
    ],
    accessibility: 'Layout only; reading order follows the children.',
    anatomy: [
      {
        name: 'Children',
        required: true,
        description: 'Laid out left to right with an even gap.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The children to lay out.',
    },
    {
      name: 'gap',
      type: 'SpaceStep',
      description: 'Space between the children, as a step on the spacing grid.',
    },
    {
      name: 'padding',
      type: 'SpaceStep',
      description: 'Space inside the stack, as a step on the spacing grid.',
    },
    {
      name: 'justify',
      type: 'StackJustify',
      description: 'How the space along the main axis is shared out.',
    },
    {
      name: 'align',
      type: 'StackAlign',
      description: 'How the children sit across the other axis.',
    },
    {
      name: 'wrap',
      type: "'nowrap' | 'wrap' | 'wrap-reverse'",
      description:
        'Whether the children wrap onto another line when they run out of room.',
      default: "'nowrap'",
    },
    {
      name: 'width',
      type: 'number | string',
      description: 'Width — a number is pixels, a string is used as-is.',
    },
    {
      name: 'height',
      type: 'number | string',
      description: 'Height — a number is pixels, a string is used as-is.',
    },
    {
      name: 'maxWidth',
      type: 'number | string',
      description:
        'Maximum width — a number is pixels, a string is used as-is.',
    },
    {
      name: 'minHeight',
      type: 'number | string',
      description:
        'Minimum height — a number is pixels, a string is used as-is.',
    },
    {
      name: 'isScrollable',
      type: 'boolean',
      description: 'Lets the stack scroll when its children overflow.',
      default: 'false',
    },
    {
      name: 'as',
      type: 'ElementType',
      description: 'Which element to render.',
      default: "'div'",
    },
  ],

  examples: ['HStackBasic'],
};
