/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'ChatMessageMetadataStatus',
  type: 'block',
  exampleFor: 'ChatMessageMetadata',
  name: 'ChatMessageMetadata — Status',
  displayName: 'ChatMessageMetadata — Status',
  description:
    'All 5 delivery statuses (sending, sent, delivered, read, and error), each with a timestamp. Use to show message delivery progress or surface failures.',
  isReady: true,
  aspectRatio: 1,
  componentsUsed: ['Chat', 'ChatMessageMetadata', 'Timestamp'],
};
