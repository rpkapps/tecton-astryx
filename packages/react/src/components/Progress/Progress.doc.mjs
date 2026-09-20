/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Progress',
  displayName: 'Progress',
  group: 'Progress',
  category: 'Feedback',

  keywords: ['progress', 'loading', 'spinner', 'bar', 'percentage'],

  usage: {
    description:
      'Progress reports how far along something is. `linear` is the bar a page or a panel puts above its content; `circular` is the compact form that sits inside a control or beside a row.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Report a real value whenever one is known; an indeterminate bar says nothing but "wait".',
      },
      {
        guidance: true,
        description: 'Give it a label that names the work, not the widget.',
      },
      {
        guidance: true,
        description:
          'Use `isDisabled` for work that was cancelled, so the bar stops claiming progress.',
      },
      {
        guidance: false,
        description:
          'Show progress for something that finishes in under a second.',
      },
    ],
    accessibility:
      'Determinate progress reports its value, minimum and maximum; indeterminate progress reports only that work is under way.',
    anatomy: [
      {
        name: 'Track',
        required: true,
        description: 'The channel the fill runs along.',
      },
      {
        name: 'Fill',
        required: true,
        description: 'How far along the work is.',
      },
      {
        name: 'Value label',
        required: false,
        description: 'The percentage, as text.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'What is making progress. Names the indicator for assistive technology.',
      required: true,
    },
    {
      name: 'variant',
      type: 'ProgressVariant',
      description: 'Which shape the indicator takes.',
      default: "'linear'",
    },
    {
      name: 'value',
      type: 'number',
      description:
        'How far along, on a scale that ends at `max`. Ignored while indeterminate.',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: 'The value that counts as finished.',
      default: '100',
    },
    {
      name: 'isIndeterminate',
      type: 'boolean',
      description:
        'Animates without reporting a position, for work whose length is unknown.',
      default: 'false',
    },
    {
      name: 'tone',
      type: 'ProgressTone',
      description: 'Which role the filled part is coloured from.',
      default: "'accent'",
    },
    {
      name: 'size',
      type: 'ProgressSize',
      description: 'Ring diameter, for circular progress.',
      default: '32',
    },
    {
      name: 'hasValueLabel',
      type: 'boolean',
      description:
        'Shows the percentage as text — inside the ring, or after the bar.',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the label, keeping it for assistive technology.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Greys the indicator out, for work that was cancelled or is inactive.',
      default: 'false',
    },
  ],

  examples: ['ProgressBasic', 'ProgressCircular'],

  notes: [
    "Determinate circular progress has no counterpart underneath — the ring is Tecton's own, drawn in StyleX against the design tokens. The indeterminate ring and the linear bar are the shared ones, themed.",
    "The design's buffer type — a dotted segment out to a second value — does not exist, and its teal and lime progress colours have no slot; `tone` carries the semantic roles instead.",
  ],
};
