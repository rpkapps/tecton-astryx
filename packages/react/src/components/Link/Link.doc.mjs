/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Link',
  displayName: 'Link',
  group: 'Link',
  category: 'Navigation',

  keywords: ['link', 'anchor', 'navigation', 'underline', 'external'],

  usage: {
    description:
      'Link takes the person somewhere else. Tecton links are the colour of the text around them — the underline is the whole affordance — so a link inside a paragraph needs `underline="always"` to be findable.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use `underline="always"` for a link inside prose and `hover` for one standing on its own.',
      },
      {
        guidance: true,
        description:
          'Write link text that says where it goes, so it still makes sense read out of context.',
      },
      {
        guidance: true,
        description:
          'Set `isExternal` for a link that leaves the application; it adds the glyph, the safe rel tokens and the note that says so.',
      },
      {
        guidance: false,
        description: 'Use a link to perform an action. Actions are buttons.',
      },
      {
        guidance: false,
        description: 'Write "click here".',
      },
    ],
    accessibility:
      'An external link announces that it opens in a new tab. `label` is only for a link whose text does not describe its destination.',
    anatomy: [
      {
        name: 'Text',
        required: true,
        description: 'The link, which is also its accessible name.',
      },
      {
        name: 'External glyph',
        required: false,
        description: 'Marks a link that opens in a new tab.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The link text.',
      required: true,
    },
    {
      name: 'href',
      type: 'string',
      description: 'Where the link goes.',
    },
    {
      name: 'underline',
      type: 'LinkUnderline',
      description: 'When the underline is drawn.',
      default: "'hover'",
    },
    {
      name: 'color',
      type: 'TextColor',
      description:
        'Ink role. Tecton links take the colour of the text around them.',
      default: "'primary'",
    },
    {
      name: 'weight',
      type: 'TextWeight',
      description:
        'Font weight, overriding the weight of the surrounding text.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and dims the link.',
      default: 'false',
    },
    {
      name: 'isExternal',
      type: 'boolean',
      description:
        'Opens the link in a new tab, with an icon, the safe `rel` tokens and a screen-reader note saying so.',
      default: 'false',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name, for a link whose content does not describe where it goes.',
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Short text shown on hover and keyboard focus.',
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler',
      description: 'Click handler.',
    },
  ],

  examples: [
    'LinkBasic',
    'LinkExternalLinks',
    'LinkInlineLink',
    'LinkShowcase',
    'LinksWithTooltips',
  ],

  notes: [
    'Tecton links carry no colour of their own. `color="accent"` is still available for a link that has to stand out, but the default matches the surrounding text as the design draws it.',
  ],
};
