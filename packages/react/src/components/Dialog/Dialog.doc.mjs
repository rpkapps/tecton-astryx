/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Dialog',
  displayName: 'Dialog',
  group: 'Dialog',
  category: 'Overlay',

  keywords: ['dialog', 'modal', 'confirm', 'overlay', 'alert'],

  usage: {
    description:
      'Dialog interrupts: it takes the screen until it is answered. Use it for a decision that cannot wait, and for a consequence that has to be stated before it happens.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Title the dialog with the decision — "Delete three wells?" — not with the noun.',
      },
      {
        guidance: true,
        description:
          'Use `confirmation` for a single irreversible action, and say what it will do.',
      },
      {
        guidance: true,
        description:
          'Set `dismissal` to `form` once the dialog can be typed into, so a stray click cannot throw the work away.',
      },
      {
        guidance: false,
        description: 'Open a dialog from a dialog.',
      },
      {
        guidance: false,
        description:
          'Use a dialog for something the page could have said inline.',
      },
    ],
    accessibility:
      'Focus moves into the dialog when it opens and comes back when it closes. The title names the dialog; a confirmation also has its consequence read out as the description.',
    anatomy: [
      {
        name: 'Title',
        required: true,
        description: 'The decision, and the accessible name of the dialog.',
      },
      {
        name: 'Subtitle',
        required: false,
        description: 'A second line under the title.',
      },
      {
        name: 'Content',
        required: false,
        description: 'Whatever the decision needs.',
      },
      {
        name: 'Footer',
        required: false,
        description: 'The actions.',
      },
      {
        name: 'Close',
        required: false,
        description: 'The way out.',
      },
    ],
  },

  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the dialog is open.',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description:
        'Called with the new open state whenever the dialog opens or closes.',
      required: true,
    },
    {
      name: 'title',
      type: 'string',
      description:
        "The dialog's title. It names the dialog for assistive technology.",
      required: true,
    },
    {
      name: 'subtitle',
      type: 'string',
      description:
        'A second line under the title. Ignored on a confirmation dialog.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: "The dialog's content. Ignored on a confirmation dialog.",
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description:
        'Actions at the foot of the dialog. Ignored on a confirmation dialog.',
    },
    {
      name: 'confirmation',
      type: 'DialogConfirmation',
      description:
        'When set, the dialog is a confirmation rather than a content dialog.',
    },
    {
      name: 'size',
      type: 'DialogSize',
      description: 'How much of the viewport the dialog takes.',
      default: "'standard'",
    },
    {
      name: 'dismissal',
      type: 'DialogDismissal',
      description:
        'How easily the dialog can be dismissed without answering it: `info` closes on Escape and on a click outside, `form` keeps the click outside from closing it once it has been typed in, and `required` allows neither.',
      default: "'info'",
    },
    {
      name: 'width',
      type: 'number | string',
      description:
        'Preferred width — a number is pixels, a string is used as-is.',
    },
    {
      name: 'hasCloseButton',
      type: 'boolean',
      description: 'Gives the header a close button.',
      default: 'true',
    },
  ],

  examples: ['DialogBasic', 'DialogConfirmation'],

  notes: [
    'Open and close live on `isOpen` and `onOpenChange` on purpose: a later phase adds page-level coordination — one dialog at a time, a dialog that survives a route change — behind those two props, so applications never change how they open one.',
    '`confirmation` switches the whole component to the alert shape. `children` and `footer` are ignored there, because the actions are the confirmation.',
  ],
};
