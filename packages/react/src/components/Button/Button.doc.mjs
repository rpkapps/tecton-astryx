/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'Button',
  displayName: 'Button',
  group: 'Button',
  category: 'Action',

  keywords: [
    'button',
    'action',
    'submit',
    'cta',
    'primary',
    'secondary',
    'ghost',
    'destructive',
    'loading',
  ],

  usage: {
    description:
      'Button triggers an action: submitting a form, confirming a choice, or starting a task. Its variant carries the emphasis, so the most important action in a view reads first.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reserve the primary variant for the single most important action in a view; everything else is secondary or ghost.',
      },
      {
        guidance: true,
        description:
          'Write labels that name the action — "Save changes", "Delete project" — rather than "OK" or "Submit".',
      },
      {
        guidance: true,
        description:
          'Turn on the loading state for actions that take time, so the button reports its own progress.',
      },
      {
        guidance: false,
        description:
          'Put two primary buttons in the same view; the hierarchy stops meaning anything.',
      },
      {
        guidance: false,
        description:
          'Use a button to navigate somewhere. Navigation belongs to links.',
      },
    ],
    anatomy: [
      {
        name: 'Icon',
        required: false,
        description: 'Leading glyph that reinforces the label.',
      },
      {
        name: 'Label',
        required: true,
        description:
          'The visible text, which is also the accessible name of the control.',
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
      description: 'Accessible label, rendered as the visible button text.',
      required: true,
    },
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost' | 'destructive'",
      description: 'Visual emphasis.',
      default: "'secondary'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Control height.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Prevents interaction and dims the control.',
      default: 'false',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows a spinner while the action is in flight.',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon element rendered before the label.',
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      description: 'HTML button type.',
      default: "'button'",
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler<HTMLButtonElement>',
      description: 'Click handler.',
    },
  ],
};
