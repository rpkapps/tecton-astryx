/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'StepperCustomContent',
  type: 'block',
  exampleFor: 'Stepper',
  name: 'Stepper — Custom Content',
  displayName: 'Stepper — Custom Content',
  description:
    'A vertical stepper where each step owns a slice of the page. The content slot takes any node (form fields, a summary panel, a banner), so a stepper is not limited to multi-step forms. Rendering the slot only for the active step is what makes the flow expand one step at a time.',
  isReady: true,
  aspectRatio: 4 / 3,
  componentsUsed: [
    'Stepper',
    'TextInput',
    'Button',
    'Text',
    'Card',
    'Badge',
    'Banner',
  ],
};
