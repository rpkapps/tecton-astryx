/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'BreadcrumbItem',
  displayName: 'BreadcrumbItem',
  group: 'Breadcrumbs',
  category: 'Navigation',

  keywords: ['breadcrumb', 'crumb', 'link', 'navigation'],

  usage: {
    description:
      'BreadcrumbItem is one crumb in a Breadcrumbs trail. Give it an `href` to make it navigate; leave it off and it is a plain label.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use the page title as the label, so the trail matches the headings.',
      },
      {
        guidance: false,
        description: 'Give the current crumb an href. It goes nowhere.',
      },
    ],
    accessibility:
      'The last crumb is marked as the current page automatically; pass `isCurrent` only to override that.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Leading glyph.',
      },
      {
        name: 'Label',
        required: true,
        description: 'The crumb text.',
      },
    ],
  },

  examples: ['BreadcrumbItemBasic', 'BreadcrumbItemShowcase'],

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: "The crumb's label.",
      required: true,
    },
    {
      name: 'href',
      type: 'string',
      description:
        'Where the crumb goes. Omit it for a crumb that does not navigate.',
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph rendered before the label, by name or as an SVG component.',
    },
    {
      name: 'isCurrent',
      type: 'boolean',
      description:
        'Marks this crumb as the current page. Left unset, the last crumb is the current one; pass `false` to opt out.',
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent) => void',
      description: 'Click handler.',
    },
  ],
};
