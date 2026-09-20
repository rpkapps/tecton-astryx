/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'CollapsibleGroupShowcase',
  type: 'block',
  exampleFor: 'CollapsibleGroup',
  name: 'CollapsibleGroup',
  displayName: 'Collapsible Group',
  description:
    'CollapsibleGroup coordinates its Collapsible children: with type="single", opening one closes the others. No state or handlers in the example — the group owns which value is open and each child only declares its own. One Collapsible per Card, so each trigger keeps its default large type as the heading of its own surface.',
  isReady: true,
  isShowcase: true,
  aspectRatio: 16 / 9,
  componentsUsed: ['Collapsible', 'CollapsibleGroup', 'Card', 'Text', 'Stack'],
};
