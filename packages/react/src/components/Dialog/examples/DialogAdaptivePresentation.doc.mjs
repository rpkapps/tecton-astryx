/** @type {import('@tecton/docs').ExampleDoc} */
export const docs = {
  id: 'DialogAdaptivePresentation',
  name: 'Adaptive presentation',
  component: 'Dialog',
  description:
    'Opt-in recipe for an AdaptiveDialog wrapper: Dialog remains the default everywhere, while touchPresentation="bottom-sheet" switches only at lg and below when pointer is coarse and hover is unavailable. Includes a deterministic presentation override for tests/unusual environments and notes that BottomSheet purpose controls swipe and scrim dismissal. Usage examples: touchPresentation="dialog" keeps Dialog, "fullscreen" chooses fullscreen Dialog, and "bottom-sheet" chooses BottomSheet only for the touch-oriented range. Keep presentation as the deterministic override. Do not use this by default for AlertDialog or destructive confirmations.',
  origin: 'ported',
};
