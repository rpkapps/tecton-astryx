/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Avatar',
  displayName: 'Avatar',
  group: 'Avatar',
  category: 'Content',

  keywords: ['avatar', 'user', 'person', 'profile', 'initials', 'image'],

  usage: {
    description:
      'Avatar stands for a person or a thing: a photograph if there is one, initials if there is not. It is an identifier, never a control on its own — give it `onClick` or `href` only when the whole avatar really is the target.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always pass `name`. It is the initials, the alt text and the tooltip in one.',
      },
      {
        guidance: true,
        description:
          'Use 40 for a header, 32 in a list row and 24 or 18 inside dense data.',
      },
      {
        guidance: false,
        description:
          'Use an avatar as decoration next to a name that is already written out.',
      },
    ],
    accessibility:
      'An interactive avatar needs a real name: without `name` or `alt` it has no accessible name and warns in development.',
    anatomy: [
      {
        name: 'Image or initials',
        required: true,
        description: 'The likeness, or the letters standing in for it.',
      },
      {
        name: 'Status',
        required: false,
        description: 'Corner content, such as a presence dot.',
      },
    ],
  },

  props: [
    {
      name: 'name',
      type: 'string',
      description:
        'The name behind the avatar: the initials, the alt text and the tooltip.',
    },
    {
      name: 'src',
      type: 'string',
      description: 'Image to show instead of initials.',
    },
    {
      name: 'fallbackSrc',
      type: 'string',
      description: 'Image to fall back to when `src` fails to load.',
    },
    {
      name: 'alt',
      type: 'string',
      description: 'Alt text, when it should differ from the name.',
    },
    {
      name: 'size',
      type: 'AvatarSize',
      description: 'Diameter in pixels.',
      default: '32',
    },
    {
      name: 'shape',
      type: 'AvatarShape',
      description: 'Corner treatment.',
      default: "'circle'",
    },
    {
      name: 'tooltip',
      type: 'string | boolean',
      description:
        'Text shown on hover and keyboard focus. `true` shows the name, `false` shows nothing.',
      default: 'true',
    },
    {
      name: 'href',
      type: 'string',
      description: 'When set, the avatar is a link to here.',
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler',
      description: 'When set without `href`, the avatar behaves as a button.',
    },
    {
      name: 'status',
      type: 'ReactNode',
      description: 'Corner content, such as a presence dot.',
    },
  ],

  examples: ['AvatarBasic', 'AvatarShapes'],

  notes: [
    "Tecton's seven accent colours for avatars are a per-instance choice in the design with no prop underneath, so every avatar takes the theme's one fill.",
    "The design's `off` state — a neutral fill and a greyscale image — has no equivalent.",
    "Tecton's 18px tier is drawn at 20px: the size scale underneath has rungs at 16 and 20 and nothing between them.",
  ],
};
