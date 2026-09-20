/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Card',
  displayName: 'Card',
  group: 'Card',
  category: 'Surfaces',

  keywords: ['card', 'surface', 'container', 'tile', 'record'],

  usage: {
    description:
      'Card bounds one thing: a record, a summary, a choice. Like every Tecton surface it is darker than the page it sits on and carries a rule rather than a shadow.',
    bestPractices: [
      {
        guidance: true,
        description: 'Put one subject in a card. Two subjects want two cards.',
      },
      {
        guidance: true,
        description:
          'Let the card take the theme padding unless the content really needs a different one.',
      },
      {
        guidance: false,
        description:
          'Nest cards. A card inside a card stops reading as a boundary.',
      },
    ],
    accessibility:
      'A card is a container, not a landmark. If it groups something worth navigating to, give it a heading.',
    anatomy: [
      {
        name: 'Surface',
        required: true,
        description: 'The bounded area, with its rule and its corners.',
      },
      {
        name: 'Content',
        required: true,
        description: 'Whatever the card is about.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: "The card's content.",
    },
    {
      name: 'variant',
      type: 'CardVariant',
      description: "How the card's background reads against the page.",
      default: "'default'",
    },
    {
      name: 'padding',
      type: 'CardPadding',
      description:
        "Inner padding, as a step on the spacing grid. Omit for Tecton's 16px.",
    },
    {
      name: 'width',
      type: 'number | string',
      description: 'Width — a number is pixels, a string is used as-is.',
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
  ],

  examples: [
    'CardBasic',
    'CardCallout',
    'CardElevations',
    'CardShowcase',
    'CardWithInnerLayout',
    'CardWithSimpleContent',
  ],

  notes: [
    'Elevation is not exposed. Tecton surfaces are flat and separated by darkness and a rule, so a shadow would contradict the rest of the system.',
  ],
};
