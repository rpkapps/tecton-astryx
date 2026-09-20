/* Ported by apps/docs/scripts/port-examples.mjs. Do not edit by hand. */
export const doc = {
  slug: 'theme-showcase',
  type: 'page',
  name: 'Theme Showcase',
  displayName: 'Theme Showcase',
  description:
    'Several unrelated product surfaces rendered together on one canvas so a token change can be judged across contexts at once. A comparison harness rather than a layout to ship. Theme, tokens, palette, typography, styling, or design system preview.',
  isReady: true,
  // Surfaced via the Themes page "Open in Playground" action, not the
  // Templates gallery, so keep it out of the overview + playground menu.
  // No `category` — it's hidden from the overview gallery (the only consumer
  // of `category`), and 'Showcase' isn't part of the TemplateCategory taxonomy.
  isHiddenFromOverview: true,
};
