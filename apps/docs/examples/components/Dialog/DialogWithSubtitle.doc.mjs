/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'DialogWithSubtitle',
  type: 'block',
  exampleFor: 'Dialog',
  alsoExampleFor: ['useImperativeDialog'],
  name: 'Dialog — Required',
  displayName: 'Dialog — Required',
  description:
    'Cannot be dismissed by Escape or backdrop click; the user must explicitly choose an action. Uses purpose="required". Use for ownership transfers, legal acknowledgements, or critical decisions where skipping is not an option.',
  isReady: true,
  aspectRatio: 4 / 3,
  componentsUsed: ['Dialog', 'Layout', 'Button', 'Text'],
};
