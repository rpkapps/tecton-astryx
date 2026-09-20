/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Tab',
  displayName: 'Tab',
  group: 'Tabs',
  category: 'Navigation',

  keywords: ['tab', 'stop', 'panel', 'navigation'],

  usage: {
    description:
      'Tab is one stop in a Tabs strip. In the tabs pattern give it the `panelId` of the panel it controls; in the navigation pattern give it an `href`.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep labels to one or two words so the strip does not scroll.',
      },
      {
        guidance: true,
        description: 'Use `endContent` for a count, and keep it to a number.',
      },
      {
        guidance: false,
        description:
          'Hide the label on more than a couple of tabs; a strip of bare glyphs is a guessing game.',
      },
    ],
    accessibility:
      'In the tabs pattern the tab points at the panel it controls, so the panel is reachable from the tab.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Glyph before the label.',
      },
      {
        name: 'Label',
        required: true,
        description: 'The tab text and its accessible name.',
      },
      {
        name: 'End content',
        required: false,
        description: 'A count or a status dot.',
      },
    ],
  },

  examples: ['TabBasic'],

  props: [
    {
      name: 'label',
      type: 'string',
      description: "The tab's text, which is also its accessible name.",
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The value this tab sets on the strip.',
      required: true,
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description: 'Glyph shown while the tab is not current.',
    },
    {
      name: 'selectedIcon',
      type: 'TectonIconRef',
      description:
        'Glyph shown while the tab is current. Falls back to `icon`.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Content after the label, such as a count or a status dot.',
    },
    {
      name: 'panelId',
      type: 'string',
      description: 'Id of the panel this tab controls, in the tabs pattern.',
    },
    {
      name: 'href',
      type: 'string',
      description: 'Where the tab goes, in the navigation pattern.',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the label, leaving the glyph and using the label as the accessible name.',
      default: 'false',
    },
  ],

  notes: [
    "Tecton's per-tab focus treatment is a dark box rather than the pink ring. Focus is a system-wide token, so tabs focus like everything else.",
  ],
};
