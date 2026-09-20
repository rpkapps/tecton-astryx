/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'ListItem',
  displayName: 'ListItem',
  group: 'List',
  category: 'Data',

  keywords: ['list item', 'row', 'item', 'selected'],

  usage: {
    description:
      'ListItem is one row of a List: a label, optionally a second line under it, and content at either end. A row with `onClick` or `href` becomes the whole click target.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Put the thing being identified in `label` and everything about it in `description`.',
      },
      {
        guidance: true,
        description:
          'Keep end content to one control; a row with three is a table row.',
      },
      {
        guidance: false,
        description:
          'Put a separate button inside a row that is itself clickable.',
      },
    ],
    accessibility:
      'A clickable row is one tab stop, not two: the whole row is the target and the label is its name.',
    anatomy: [
      {
        name: 'Start content',
        required: false,
        description: 'Icon, avatar or checkbox before the label.',
      },
      {
        name: 'Label',
        required: true,
        description: 'What the row is.',
      },
      {
        name: 'Description',
        required: false,
        description: 'The second line.',
      },
      {
        name: 'End content',
        required: false,
        description: 'Badge, value or chevron.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description: "The row's primary text.",
      required: true,
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary content under the label.',
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description: 'Content before the label, such as an icon or an avatar.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Content after the label, such as a badge or a chevron.',
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent) => void',
      description: 'Click handler. Makes the whole row the click target.',
    },
    {
      name: 'href',
      type: 'string',
      description: 'Where the row goes. Makes the whole row a link.',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description: 'Marks the row as the one currently chosen.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and dims the row.',
      default: 'false',
    },
  ],

  examples: [
    'ListItemBasic',
    'ListItemBasicItem',
    'ListItemShowcase',
    'ListItemWithMedia',
    'ListItemWithMetadata',
  ],

  notes: [
    "The inventory suggested the generic item primitive; the list's own row component is used instead, because it is what the list renders its children as and it carries the selected state Tecton's `activated` row needs.",
  ],
};
