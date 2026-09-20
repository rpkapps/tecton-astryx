/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Button',
  displayName: 'Button',
  group: 'Button',
  category: 'Action',

  keywords: [
    'button',
    'action',
    'submit',
    'primary',
    'secondary',
    'tertiary',
    'outlined',
    'destructive',
    'loading',
  ],

  usage: {
    description:
      'Button triggers an action: submitting a form, confirming a choice, starting a job. The variant carries the emphasis, so the most important action in a view reads first.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reserve `primary` for the single most important action in a view; everything else is quieter.',
      },
      {
        guidance: true,
        description:
          'Write labels that name the action — "Save changes", "Generate model" — rather than "OK".',
      },
      {
        guidance: true,
        description:
          'Turn on `isLoading` for an action that takes time, so the button reports its own progress.',
      },
      {
        guidance: false,
        description:
          'Put two primary buttons in one view; the hierarchy stops meaning anything.',
      },
      {
        guidance: false,
        description:
          'Use a button to navigate somewhere. Navigation belongs to links.',
      },
    ],
    accessibility:
      'The label is the accessible name, so a button always has one. Loading is announced, not only drawn.',
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Leading glyph that reinforces the label.',
      },
      {
        name: 'Label',
        required: true,
        description: 'The visible text, which is also the accessible name.',
      },
      {
        name: 'Spinner',
        required: false,
        description: 'Replaces the icon while the action is in flight.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'The visible text, which is also the accessible name of the control.',
      required: true,
    },
    {
      name: 'variant',
      type: 'ButtonVariant',
      description: 'Visual emphasis.',
      default: "'secondary'",
    },
    {
      name: 'size',
      type: 'ButtonSize',
      description: 'Control height.',
      default: "'md'",
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description:
        'Glyph rendered before the label, by name or as an SVG component.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and recesses the fill.',
      default: 'false',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Shows a spinner in place of the icon and blocks interaction while the action is in flight.',
      default: 'false',
    },
    {
      name: 'isFullWidth',
      type: 'boolean',
      description:
        "Stretches the button across its container — the shape a panel's committing action takes.",
      default: 'false',
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      description: 'HTML button type.',
      default: "'button'",
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Short text shown on hover and keyboard focus.',
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler<HTMLButtonElement>',
      description: 'Click handler.',
    },
  ],

  examples: [
    'ButtonBasic',
    'ButtonShowcase',
    'ButtonVariants',
    'ButtonWithEndSlot',
    'ButtonWithIcon',
  ],

  notes: [
    "The design's `activated` state — a button stuck in the pressed look — is not on Button. A button that stays down is a ToggleButton.",
    "`destructive` is an addition to the design's five-step ladder. The design draws no such button, but the theme already colours one, and a delete that reads the same as a save is a defect rather than a restraint. It is the one variant that is about meaning rather than emphasis: use it only for an action that cannot be undone, and only once in a view.",
  ],
};
