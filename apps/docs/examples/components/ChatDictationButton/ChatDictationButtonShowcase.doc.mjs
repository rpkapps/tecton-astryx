/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'ChatDictationButtonShowcase',
  type: 'block',
  exampleFor: 'ChatDictationButton',
  name: 'ChatDictationButton',
  displayName: 'Chat Dictation Button',
  description:
    'Interactive dictation button connected to the SpeechRecognition API via useChatDictation. Click the mic to dictate into the composer.',
  isReady: true,
  isShowcase: true,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'Chat',
    'ChatDictationButton',
    'ChatComposer',
    'ChatComposerInput',
  ],
};
