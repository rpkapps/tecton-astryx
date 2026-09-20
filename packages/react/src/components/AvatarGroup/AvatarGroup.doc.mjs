/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'AvatarGroup',
  displayName: 'AvatarGroup',
  group: 'Avatar',
  category: 'Content',

  keywords: ['avatar', 'group', 'stack', 'overflow', 'people'],

  usage: {
    description:
      'AvatarGroup shows several avatars as one overlapping run, with a `+N` marker once there are more than fit. Use it where the set matters more than any one member.',
    bestPractices: [
      {
        guidance: true,
        description: 'Set `max` so the row cannot grow without bound.',
      },
      {
        guidance: true,
        description:
          'Let the group own the size and shape rather than setting them on each avatar.',
      },
      {
        guidance: false,
        description:
          'Use a group for two avatars; two of them side by side read better.',
      },
    ],
    accessibility:
      'The overflow marker says how many are hidden, and becomes a button when it is given something to do.',
    anatomy: [
      {
        name: 'Avatars',
        required: true,
        description: 'The visible members, overlapping.',
      },
      {
        name: 'Overflow',
        required: false,
        description: 'The `+N` marker standing for the rest.',
      },
    ],
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The avatars in the group.',
      required: true,
    },
    {
      name: 'size',
      type: 'AvatarSize',
      description: 'Diameter in pixels, applied to every avatar in the group.',
      default: '32',
    },
    {
      name: 'shape',
      type: 'AvatarShape',
      description: 'Corner treatment, applied to every avatar in the group.',
      default: "'circle'",
    },
    {
      name: 'max',
      type: 'number',
      description:
        'How many avatars to show before the rest collapse into a `+N` marker. Omit it to show them all.',
    },
    {
      name: 'onOverflowClick',
      type: '() => void',
      description: 'Called when the `+N` marker is activated.',
    },
  ],

  examples: ['AvatarGroupBasic'],

  notes: [
    "The slicing behind `max` is Tecton's own: the group underneath leaves it to the consumer. The two overlap spacings the design draws have no prop, so every group uses one.",
  ],
};
