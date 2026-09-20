/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'ChatComposerInputMentionTrigger',
  type: 'block',
  exampleFor: 'ChatComposerInput',
  name: 'ChatComposerInput — Mentions',
  displayName: 'ChatComposerInput — Mentions',
  description:
    'Chat input with an @ trigger that opens a typeahead menu for mentioning users. Selected names appear as inline tokens.',
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
