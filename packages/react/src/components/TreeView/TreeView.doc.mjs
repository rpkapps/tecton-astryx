/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'TreeView',
  displayName: 'TreeView',
  group: 'TreeView',
  category: 'Data',

  keywords: ['tree', 'hierarchy', 'folders', 'nested', 'expand'],

  usage: {
    description:
      "TreeView shows a hierarchy of rows that open and close: a project's folders, a well's horizons, a model's inputs. The items nest, each carrying the items below it.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Expand the path to whatever the person came for, and leave the rest closed.',
      },
      {
        guidance: true,
        description:
          'Keep labels short; indentation eats the width a deep tree has left.',
      },
      {
        guidance: false,
        description: 'Use a tree for a list that is only ever one level deep.',
      },
    ],
    accessibility:
      "The tree reports each row's level and whether it is expanded, so the shape of the hierarchy is audible.",
    anatomy: [
      {
        name: 'Rows',
        required: true,
        description: 'One per item, indented by depth.',
      },
      {
        name: 'Disclosure',
        required: true,
        description: 'Opens and closes a row with items under it.',
      },
      {
        name: 'Header',
        required: false,
        description: 'Names the tree.',
      },
    ],
  },

  props: [
    {
      name: 'items',
      type: 'readonly TreeItem[]',
      description: 'The top-level rows, each carrying the rows under it.',
      required: true,
    },
    {
      name: 'density',
      type: 'TreeViewDensity',
      description: 'How much air each row gets.',
      default: "'default'",
    },
    {
      name: 'hasGuides',
      type: 'boolean',
      description:
        "Draws connector lines from a row to the rows under it. Tecton's own trees use indentation alone.",
      default: 'false',
    },
    {
      name: 'header',
      type: 'ReactNode',
      description:
        'A heading above the tree, which also names it for assistive technology.',
    },
  ],

  examples: ['TreeViewBasic'],

  notes: [
    "Tecton's design describes a flat item list with an explicit depth; the tree underneath takes a nested structure, and Tecton follows it — `items` nest, and a row carries the rows below it.",
    'Several things the design draws on a tree row have no equivalent: the leading colour tag, the trailing kebab and eye-off adornments, the hidden and disabled row states, and the right-click state.',
  ],
};
