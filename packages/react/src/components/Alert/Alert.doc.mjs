/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Alert',
  displayName: 'Alert',
  group: 'Alert',
  category: 'Feedback',

  keywords: [
    'alert',
    'banner',
    'message',
    'notification',
    'error',
    'warning',
    'success',
    'info',
  ],

  usage: {
    description:
      'Alert states something about the system that the person needs to know: a job failed, a file saved, a licence is about to expire. It stays until the condition does — for something transient, raise a toast instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Say what happened and what to do about it, in that order.',
      },
      {
        guidance: true,
        description:
          'Reserve `error` for something that is actually broken; a warning that shouts is a warning nobody reads.',
      },
      {
        guidance: true,
        description:
          'Give an alert an action only when there is one thing to do about it.',
      },
      {
        guidance: false,
        description: 'Stack alerts. Three at once means none of them is read.',
      },
      {
        guidance: false,
        description:
          'Use an alert to confirm something the person just did — that is a toast.',
      },
    ],
    accessibility:
      'The status is carried by the glyph and the words as well as the colour, so an alert still reads with no colour vision. Give the dismiss button a label when the title is not plain text.',
    anatomy: [
      {
        name: 'Status glyph',
        required: true,
        description: 'Marks the kind of message.',
      },
      {
        name: 'Title',
        required: true,
        description: 'The message in one line.',
      },
      {
        name: 'Description',
        required: false,
        description: 'The detail behind the title.',
      },
      {
        name: 'Actions',
        required: false,
        description: 'The one thing to do about it.',
      },
      {
        name: 'Dismiss',
        required: false,
        description: 'Takes the alert away.',
      },
    ],
  },

  props: [
    {
      name: 'status',
      type: 'AlertStatus',
      description: 'What kind of message this is.',
      required: true,
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'The headline — the message in one line.',
      required: true,
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Supporting detail under the title.',
    },
    {
      name: 'icon',
      type: 'TectonIconRef',
      description: 'Glyph shown instead of the status glyph.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description:
        'Controls aligned to the end of the alert, such as a single action.',
    },
    {
      name: 'placement',
      type: 'AlertPlacement',
      description:
        'Whether the alert sits in the flow of the content (rounded) or spans the page edge to edge.',
      default: "'inline'",
    },
    {
      name: 'isDismissable',
      type: 'boolean',
      description: 'Gives the alert a dismiss button.',
      default: 'false',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Called when the alert is dismissed.',
    },
    {
      name: 'dismissLabel',
      type: 'string',
      description: 'Accessible name for the dismiss button.',
    },
  ],

  examples: ['AlertBasic', 'AlertStatuses'],

  notes: [
    "Tecton's outlined alert emphasis — transparent fill, a 1px severity rule, severity-coloured text — has no slot underneath, so every alert is filled.",
    'The component underneath can disclose a body behind a toggle in the header; a Tecton alert is a single block of message, so that is switched off and `children` is not exposed.',
  ],
};
