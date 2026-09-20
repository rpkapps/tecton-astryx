/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'ColorSwatch',
  displayName: 'ColorSwatch',
  group: 'ColorSwatch',
  category: 'Content',

  keywords: ['color', 'swatch', 'series', 'legend', 'picker'],

  usage: {
    description:
      'ColorSwatch is a small square of colour standing for a series, a facies or a horizon. It appears in legends, inside fields, and in the pickers that set those colours.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give a swatch a label that says what the colour stands for, not what colour it is.',
      },
      {
        guidance: true,
        description:
          'Put a swatch next to the name it belongs to, never on its own.',
      },
      {
        guidance: false,
        description:
          'Rely on the swatch alone to tell two series apart — the name has to be there too.',
      },
    ],
    accessibility:
      'A swatch that can be chosen is a button that reports whether it is pressed. A decorative swatch is hidden from assistive technology, so the name beside it does the work.',
    anatomy: [
      {
        name: 'Square',
        required: true,
        description: 'The colour itself.',
      },
      {
        name: 'Selection ring',
        required: false,
        description: 'The lime ring marking the chosen swatch.',
      },
    ],
  },

  props: [
    {
      name: 'color',
      type: 'string',
      description: 'The colour to show, as any CSS colour value.',
      required: true,
    },
    {
      name: 'size',
      type: 'number',
      description:
        'Side length in pixels. Tecton draws 12 where the swatch stands alone and 6 where it sits inside a line of text.',
      default: '12',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description: 'Draws the lime selection ring.',
      default: 'false',
    },
    {
      name: 'label',
      type: 'string',
      description:
        "Accessible name — what this colour stands for, not the colour's value. Required for a swatch that can be chosen; on a decorative swatch it is announced as an image.",
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler<HTMLButtonElement>',
      description: 'Click handler. Makes the swatch a button.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction.',
      default: 'false',
    },
  ],

  examples: ['ColorSwatchBasic'],

  notes: [
    'The selection ring is lime, which is the one place in Tecton where a selection is not marked in the hot pink everything else focuses in. It is drawn outside the square so it never eats into the colour being shown.',
    'Tecton owns this component outright: there is nothing like it underneath.',
  ],
};
