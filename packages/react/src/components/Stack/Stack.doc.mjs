/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Stack',
  displayName: 'Stack',
  group: 'Layout',
  category: 'Layout',

  keywords: ['stack', 'layout', 'flex', 'gap', 'spacing'],

  usage: {
    description:
      "Stack lays children out in one direction with an even gap between them. `gap` and `padding` are steps on Tecton's 4px grid rather than pixel values, so a layout cannot drift off the rhythm.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use a stack instead of margins on the children; one gap beats N margins.',
      },
      {
        guidance: true,
        description:
          'Reach for HStack and VStack when the direction is fixed — the name reads better.',
      },
      {
        guidance: false,
        description:
          'Pass pixel values for spacing. The scale exists so that screens agree with each other.',
      },
    ],
    accessibility: 'Layout only; reading order follows the children.',
    anatomy: [
      {
        name: 'Children',
        required: true,
        description: 'Laid out along one axis with an even gap.',
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
      name: 'direction',
      type: "'horizontal' | 'vertical'",
      description: 'Which way the children run.',
      default: "'vertical'",
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

  examples: ['StackBasic'],
};
