/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Tabs',
  displayName: 'Tabs',
  group: 'Tabs',
  category: 'Navigation',

  keywords: ['tabs', 'tab list', 'strip', 'sections', 'navigation'],

  usage: {
    description:
      'Tabs is the strip that holds a set of Tab stops and knows which is current. Use the `tabs` pattern when the tabs switch panels on one page, and `navigation` when each tab is a link to a different page.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use tabs for views of the same subject, not for steps in a process.',
      },
      {
        guidance: true,
        description:
          'Set `pattern="navigation"` when the tabs are links, so they are marked up as navigation rather than as tabs.',
      },
      {
        guidance: false,
        description:
          'Use more tabs than fit; a strip that scrolls hides its own options.',
      },
      {
        guidance: false,
        description: 'Put tabs inside tabs.',
      },
    ],
    accessibility:
      'In the tabs pattern arrow keys move between tabs and the strip is one tab stop; in the navigation pattern it is a navigation landmark and the current tab is marked as the current page.',
    anatomy: [
      {
        name: 'Strip',
        required: true,
        description: 'The row of stops.',
      },
      {
        name: 'Indicator',
        required: true,
        description: 'Marks the current stop.',
      },
      {
        name: 'Divider',
        required: false,
        description: 'A rule under the strip.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The tabs.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The value of the current tab.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Called with the value of the tab the user chose.',
      required: true,
    },
    {
      name: 'size',
      type: 'ControlSize',
      description: 'Tab height.',
      default: "'md'",
    },
    {
      name: 'layout',
      type: 'TabsLayout',
      description:
        'How the tabs share the width of the strip: `hug` sizes each to its label, `fill` stretches them equally.',
      default: "'hug'",
    },
    {
      name: 'pattern',
      type: 'TabsPattern',
      description:
        'What the strip is. `tabs` marks up the WAI-ARIA tabs pattern and expects each tab to name the panel it controls; `navigation` makes the strip a navigation landmark whose tabs are links.',
      default: "'tabs'",
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description: 'Draws a rule under the strip.',
      default: 'false',
    },
    {
      name: 'isFullBleed',
      type: 'boolean',
      description:
        "Extends the strip to the edges of its container, past the container's own padding.",
      default: 'false',
    },
  ],

  examples: ['TabsBasic'],

  notes: [
    "Tecton's filled tab style lives on the strip in the design and has no variant axis; the closest thing is a ToggleButtonGroup, which the theme paints to match.",
    'Vertical tabs have no equivalent.',
  ],
};
