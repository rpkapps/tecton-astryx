/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'Panel',
  displayName: 'Panel',
  group: 'Panel',
  category: 'Layout',

  keywords: [
    'panel',
    'surface',
    'section',
    'card',
    'container',
    'header',
    'region',
  ],

  usage: {
    description:
      'Panel is a titled surface that groups related content into one region of a page. It renders a section element with an optional header row for a title, supporting copy and controls.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give a panel a title whenever its content is not obvious from context; the title becomes the landmark people scan for.',
      },
      {
        guidance: true,
        description:
          'Keep header actions to the one or two that operate on the whole panel.',
      },
      {
        guidance: true,
        description:
          'When a panel has no visible title, pass an accessible label so the region is still announced.',
      },
      {
        guidance: false,
        description:
          'Nest panels more than one level deep; the nested surfaces stop reading as separate regions.',
      },
      {
        guidance: false,
        description:
          'Use a panel purely to add padding around content. Reach for layout primitives instead.',
      },
    ],
    anatomy: [
      {
        name: 'Title',
        required: false,
        description: 'Heading that names the region.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Supporting copy rendered under the title.',
      },
      {
        name: 'Actions',
        required: false,
        description:
          'Controls aligned to the end of the header row, acting on the whole panel.',
      },
      {
        name: 'Body',
        required: true,
        description: 'The content the panel groups.',
      },
    ],
  },

  props: [
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Heading shown in the panel header.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Supporting copy rendered under the title.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description: 'Controls aligned to the end of the header row.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The content the panel groups.',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Id applied to the panel element.',
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible label for a panel with no visible title.',
    },
  ],
};
