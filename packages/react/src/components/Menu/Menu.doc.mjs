/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Menu',
  displayName: 'Menu',
  group: 'Menu',
  category: 'Action',

  keywords: ['menu', 'dropdown', 'actions', 'overflow', 'kebab'],

  usage: {
    description:
      'Menu is a button that opens a list of actions. The entries are data — an action, a divider, or a section holding more actions — so a menu never needs anything imported alongside it.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Order the entries by how often they are used, not alphabetically.',
      },
      {
        guidance: true,
        description:
          'Mark a destructive action with `isDestructive` and put it last, after a divider.',
      },
      {
        guidance: true,
        description:
          'Use `isIconOnly` with the kebab glyph for a row or panel overflow menu.',
      },
      {
        guidance: false,
        description:
          'Put more than about seven actions in one menu without sections.',
      },
      {
        guidance: false,
        description: 'Use a menu for choosing a value. That is a select.',
      },
    ],
    accessibility:
      'The trigger says it opens a menu, focus moves into the list when it opens, and returns to the trigger when it closes.',
    anatomy: [
      {
        name: 'Trigger',
        required: true,
        description: 'The button that opens the menu.',
      },
      {
        name: 'Items',
        required: true,
        description: 'The actions.',
      },
      {
        name: 'Sections and dividers',
        required: false,
        description: 'Grouping inside the list.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        "The trigger button's text, which is also its accessible name.",
      required: true,
    },
    {
      name: 'items',
      type: 'readonly MenuEntry[]',
      description: 'The actions, sections and dividers the menu offers.',
      required: true,
    },
    {
      name: 'variant',
      type: 'MenuVariant',
      description: 'Visual emphasis of the trigger button.',
      default: "'secondary'",
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Trigger button height.',
      default: "'md'",
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph on the trigger button, by name or as an SVG component.',
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description:
        'Renders the trigger as an icon-only button, using `label` as its accessible name. Needs `icon`.',
      default: 'false',
    },
    {
      name: 'placement',
      type: 'MenuPlacement',
      description: 'Which side of the trigger the menu opens on.',
      default: "'below'",
    },
    {
      name: 'alignment',
      type: "'start' | 'center' | 'end'",
      description: 'How the menu lines up with the trigger.',
      default: "'start'",
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Open state, when the menu is controlled.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Called with the new open state whenever it changes.',
    },
    {
      name: 'menuWidth',
      type: 'number | string',
      description: 'Smallest width of the open menu — a number is pixels.',
    },
  ],

  examples: ['MenuBasic'],

  notes: [
    "There is no size prop for menu density: the menu underneath has one row height. Tecton's menu surface is darker than the page and carries no shadow, which is theme, not prop.",
    "The design's `selected` menu row — the same fill with a brighter label — is not offered; a menu that tracks a choice wants a select.",
  ],
};
