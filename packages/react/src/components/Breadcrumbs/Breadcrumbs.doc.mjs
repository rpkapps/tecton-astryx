/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Breadcrumbs',
  displayName: 'Breadcrumbs',
  group: 'Breadcrumbs',
  category: 'Navigation',

  keywords: ['breadcrumbs', 'trail', 'hierarchy', 'navigation', 'path'],

  usage: {
    description:
      'Breadcrumbs show where a page sits in the hierarchy and let someone step back up it. They are for depth, not for history — they say where you are, not how you got there.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Start at a root that means something, not at the application name.',
      },
      {
        guidance: true,
        description:
          'Keep the trail to four crumbs or so; collapse the middle when it is longer.',
      },
      {
        guidance: false,
        description:
          'Use breadcrumbs as the only way to get back. A page with one way out needs a back control too.',
      },
    ],
    accessibility:
      'The trail is a navigation landmark and the current crumb is marked as the current page.',
    anatomy: [
      {
        name: 'Crumbs',
        required: true,
        description: 'The ancestors, in order from the root.',
      },
      {
        name: 'Separator',
        required: true,
        description: 'What sits between two crumbs.',
      },
      {
        name: 'Current crumb',
        required: true,
        description: 'Where the person is now. It does not navigate.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The crumbs, in order from the root.',
      required: true,
    },
    {
      name: 'separator',
      type: 'ReactNode',
      description: 'What sits between two crumbs.',
      default: "'/'",
    },
    {
      name: 'variant',
      type: 'BreadcrumbsVariant',
      description:
        'How loudly the trail reads. `supporting` is smaller and quieter.',
      default: "'default'",
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name for the navigation landmark.',
      default: "'Breadcrumb'",
    },
  ],

  examples: [
    'BreadcrumbsBasic',
    'BreadcrumbsDeepHierarchy',
    'BreadcrumbsShowcase',
    'BreadcrumbsSupportingVariant',
    'BreadcrumbsWithIcons',
  ],

  notes: [
    "There is no overflow prop: the design's `Home / ··· / Current` collapse has to be built from the crumbs themselves, using a crumb whose label is an ellipsis.",
  ],
};
