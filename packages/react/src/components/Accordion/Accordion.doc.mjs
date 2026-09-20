/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Accordion',
  displayName: 'Accordion',
  group: 'Accordion',
  category: 'Surfaces',

  keywords: [
    'accordion',
    'collapsible',
    'disclosure',
    'expand',
    'collapse',
    'section',
  ],

  usage: {
    description:
      'Accordion hides a block of content behind a header that opens it. Use it to keep a long page scannable: the headers stay visible, so the shape of the whole is still readable while only the part someone asked for is on screen.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Write headers that say what is inside, so the page can be scanned without opening anything.',
      },
      {
        guidance: true,
        description:
          'Leave the accordion people will read first open, and the rest closed.',
      },
      {
        guidance: false,
        description:
          'Hide something someone has to act on. An action nobody can see is an action nobody takes.',
      },
      {
        guidance: false,
        description:
          'Nest accordions. Two levels of disclosure is one more than anyone tracks.',
      },
    ],
    accessibility:
      'The header is a button that reports whether it is expanded, so the state is announced, not only drawn. A disabled accordion leaves the tab order.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Leading glyph that reinforces the header.',
      },
      {
        name: 'Title',
        required: true,
        description: 'The header text, always visible.',
      },
      {
        name: 'Secondary text',
        required: false,
        description: 'A quieter second column — a count, a date, a status.',
      },
      {
        name: 'Chevron',
        required: true,
        description: 'Points down when closed, up when open.',
      },
      {
        name: 'Content',
        required: false,
        description: 'What the header discloses.',
      },
    ],
  },

  props: [
    {
      name: 'title',
      type: 'ReactNode',
      description: 'The header label, always visible.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The content that opens and closes.',
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph rendered before the title, by name or as an SVG component.',
    },
    {
      name: 'secondaryText',
      type: 'ReactNode',
      description:
        'A second, quieter column in the header — a count, a status, a date.',
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Identifier, required when the accordion sits inside an `AccordionGroup`.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Open state, when the accordion is controlled.',
    },
    {
      name: 'defaultIsOpen',
      type: 'boolean',
      description:
        'Open state on first render, when the accordion is uncontrolled.',
      default: 'true',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Called with the new open state whenever it changes.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Prevents the header from being toggled. It does not close an open accordion.',
      default: 'false',
    },
    {
      name: 'chevronPosition',
      type: "'start' | 'end'",
      description: 'Which end of the header the disclosure chevron sits at.',
      default: "'end'",
    },
  ],

  examples: ['AccordionBasic', 'AccordionWithSecondaryText'],

  notes: [
    "The design's header action row — edit, settings, delete, overflow — is not offered. The header is one button, and putting buttons inside it would nest interactive elements, which no assistive technology handles predictably. Put those actions in the content, or in the section header above the group.",
    "The design's `activated` state, where an open accordion merges with its content into one lighter block, has no equivalent: open and activated are drawn the same.",
  ],
};
