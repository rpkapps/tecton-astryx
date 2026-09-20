/* Ported from the upstream example blocks by scripts/port-examples.mjs. */
/** @type {import('@tecton/docs').ExampleDoc} */
export const docs = {
  id: 'LinkProviderCustomLink',
  name: 'Custom Link Component',
  component: 'LinkProvider',
  description:
    'Routes every Astryx link through a custom component that intercepts the click, the hook frameworks like Next.js use for client-side navigation. Click the link to see the custom handler fire instead of a full-page load.',
};
