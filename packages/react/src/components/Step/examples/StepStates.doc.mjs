/* Ported from the upstream example blocks by scripts/port-examples.mjs. */
/** @type {import('@tecton/docs').ExampleDoc} */
export const docs = {
  id: 'StepStates',
  name: 'States',
  component: 'Step',
  description:
    'Every state a single Step can land in, each shown as one Step in its own Stepper. Completed, current, and upcoming are derived by comparing the step index against the parent activeStep, so they are never set directly; isDisabled and status are the two a step declares itself. Status is a separate axis from progress, which is why a completed step can still carry a warning.',
};
