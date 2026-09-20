/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Toast',
  displayName: 'useToast',
  group: 'Toast',
  category: 'Feedback',

  keywords: ['toast', 'snackbar', 'notification', 'transient', 'undo'],

  usage: {
    description:
      'useToast raises a short, transient message about something that just happened, and hands back a way to take it down again. What it takes is data — a title, a body, a kind, a duration and at most one action — so raising a toast never reaches for a component.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Confirm something that happened, in the past tense: "Model saved".',
      },
      {
        guidance: true,
        description:
          'Give a toast an action only when it is a way back — Undo, Retry, View.',
      },
      {
        guidance: true,
        description:
          'Use `error` for something that failed; an error toast stays until it is dismissed.',
      },
      {
        guidance: false,
        description:
          'Put anything in a toast that the person has to read. Toasts go away.',
      },
      {
        guidance: false,
        description:
          'Raise a toast for every save in a row; one at the end says the same thing.',
      },
    ],
    accessibility:
      'A toast is announced politely; an error toast is announced assertively and stays until it is dismissed.',
    anatomy: [
      {
        name: 'Title',
        required: false,
        description: 'A headline for a message that needs one.',
      },
      {
        name: 'Body',
        required: true,
        description: 'What happened.',
      },
      {
        name: 'Action',
        required: false,
        description: 'The one way back.',
      },
    ],
  },

  props: [
    {
      name: 'title',
      type: 'string',
      description: 'A headline, for a toast whose body needs one.',
    },
    {
      name: 'body',
      type: 'string',
      description: 'The message.',
      required: true,
    },
    {
      name: 'type',
      type: 'ToastType',
      description: 'What kind of toast this is.',
      default: "'info'",
    },
    {
      name: 'durationMs',
      type: 'number',
      description:
        'How long the toast stays, in milliseconds. An error toast ignores it and stays until it is dismissed.',
      default: '5000',
    },
    {
      name: 'action',
      type: 'ToastAction',
      description: 'The one action the toast offers.',
    },
  ],

  examples: ['ToastBasic'],

  propsType: 'ToastPayload',

  notes: [
    'The payload is deliberately data only. A later phase routes the same payload page-wide — deduplicating, queueing, surviving a route change — and a payload made of plain values is one that can be sent anywhere.',
    "The two kinds are `info` and `error`; the design's success and warning toasts have no slot, and a confirmation that needs colour belongs in an alert.",
  ],
};
