/** @type {import('@tecton/docs').ExampleDoc} */
export const docs = {
  id: 'LocaleProvider03RtlDirection',
  name: 'RTL Direction',
  component: 'LocaleProvider',
  description:
    'Toggle text direction with the `dir` prop and watch Astryx components mirror. Pagination flips its prev/next chevrons under RTL. The `dir` prop is passed to both `InternationalizationProvider` (so Astryx components pick it up) and the `VStack` (so the DOM subtree mirrors); both channels stay in sync with no extra wrapper.',
  origin: 'ported',
};
