/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'AccordionGroup',
  displayName: 'AccordionGroup',
  group: 'Accordion',
  category: 'Surfaces',

  keywords: ['accordion', 'group', 'collapsible', 'disclosure', 'dividers'],

  usage: {
    description:
      'AccordionGroup coordinates a stack of accordions. In `single` mode opening one closes the last; in `multiple` mode any number can stand open at once.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use `single` when the sections are alternatives and `multiple` when they are parts of one whole.',
      },
      {
        guidance: true,
        description:
          'Give every accordion in the group a `value` — the group tells them apart by it.',
      },
      {
        guidance: false,
        description: 'Put an accordion group inside another one.',
      },
    ],
    accessibility:
      'Each header keeps its own expanded state; the group only decides which are open.',
    anatomy: [
      {
        name: 'Items',
        required: true,
        description: 'The accordions the group coordinates.',
      },
      {
        name: 'Dividers',
        required: false,
        description: 'Hairlines between the items.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The accordions to coordinate.',
      required: true,
    },
    {
      name: 'type',
      type: 'AccordionGroupType',
      description: 'How many accordions may stand open at once.',
      default: "'single'",
    },
    {
      name: 'value',
      type: 'string | string[]',
      description: 'Which accordions are open, when the group is controlled.',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      description:
        'Which accordions start open, when the group is uncontrolled.',
    },
    {
      name: 'onChange',
      type: '(value: string | string[]) => void',
      description: 'Called with the open accordions whenever they change.',
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: 'Draws a hairline between the accordions.',
      default: 'false',
    },
    {
      name: 'density',
      type: 'AccordionGroupDensity',
      description: "How much air each accordion's header and body get.",
    },
    {
      name: 'chevronPosition',
      type: "'start' | 'end'",
      description: 'Which end of each header the disclosure chevron sits at.',
      default: "'end'",
    },
  ],

  examples: ['AccordionGroupBasic'],

  notes: [
    'The design offers dividers as a group option and Tecton keeps it, but the group draws the rule itself rather than the items drawing their own edges, so a divider sits under an open item as well as a closed one.',
  ],
};
