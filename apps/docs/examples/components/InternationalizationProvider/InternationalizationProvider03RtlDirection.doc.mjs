/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'InternationalizationProvider03RtlDirection',
  type: 'block',
  exampleFor: 'InternationalizationProvider',
  name: 'InternationalizationProvider — RTL Direction',
  displayName: 'Internationalization Provider — RTL Direction',
  description:
    'Toggle text direction with the `dir` prop and watch Tecton components mirror. Pagination flips its prev/next chevrons under RTL. The `dir` prop is passed to both `InternationalizationProvider` (so Tecton components pick it up) and the `VStack` (so the DOM subtree mirrors); both channels stay in sync with no extra wrapper.',
  isReady: true,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'InternationalizationProvider',
    'Pagination',
    'SegmentedControl',
    'Layout',
  ],
};
