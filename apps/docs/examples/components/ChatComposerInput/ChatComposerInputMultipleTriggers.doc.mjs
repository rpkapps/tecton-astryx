/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'ChatComposerInputMultipleTriggers',
  type: 'block',
  exampleFor: 'ChatComposerInput',
  name: 'ChatComposerInput — Multiple Triggers',
  displayName: 'ChatComposerInput — Multiple Triggers',
  description:
    'Chat input with both @ mentions and / commands. Each trigger type renders tokens in a distinct color so users can tell them apart at a glance.',
  isReady: true,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'ChatComposer',
    'ChatComposerInput',
    'Typeahead',
    'Layout',
    'Text',
  ],
};
