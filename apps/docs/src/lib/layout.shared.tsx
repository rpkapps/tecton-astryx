import type {BaseLayoutProps} from 'fumadocs-ui/layouts/shared';

export const siteName = 'Tecton';
export const siteDescription =
  'The Tecton design system for React: foundations, components and live examples, printed from the package itself.';

/** Options both the docs shell and the landing page shell are built from. */
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
