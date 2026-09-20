/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  id: 'BannerCollapsibleContent',
  type: 'block',
  exampleFor: 'Banner',
  name: 'Banner — Collapsible',
  displayName: 'Banner — Collapsible',
  description:
    'Combine an action button, dismiss control, and a collapsible detail area in one banner. Children sit behind the toggle by default; `collapsible={{defaultIsOpen: true}}` starts it open, and `collapsible={false}` drops the toggle entirely. Use for complex notifications like config changes or deployment summaries.',
  isReady: true,
  aspectRatio: 16 / 9,
  componentsUsed: ['Banner', 'Button', 'List', 'Layout', 'Text'],
};
