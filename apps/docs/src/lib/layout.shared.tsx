import type {BaseLayoutProps} from 'fumadocs-ui/layouts/shared';

export const siteName = 'Tecton';
export const siteDescription =
  'The Tecton design system for React: foundations, components and live examples, printed from the package itself.';

/**
 * Options both shells are built from.
 *
 * The docs shell takes these as they are: its sidebar already lists every
 * section, so repeating them as header links would say the same thing twice.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <span
            aria-hidden
            className="size-4 rounded-[4px]"
            style={{background: 'var(--color-text-accent)'}}
          />
          {siteName}
        </span>
      ),
      transparentMode: 'none',
    },
  };
}

/** The landing page's header, which is the only navigation on that page. */
export function homeOptions(): BaseLayoutProps {
  return {
    ...baseOptions(),
    links: [
      {text: 'Guides', url: '/docs', active: 'nested-url'},
      {
        text: 'Foundations',
        url: '/docs/foundations/colour',
        active: 'nested-url',
      },
      {text: 'Components', url: '/docs/components', active: 'nested-url'},
      {text: 'Templates', url: '/docs/templates', active: 'nested-url'},
    ],
  };
}
