'use client';

/**
 * The "start here" tiles on `/docs`: every section the site has, printed from
 * the same registries the sidebar is built from.
 */

import Link from 'next/link';
import {Card} from '@tecton/react/Card';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {componentRegistry} from '@/generated/componentRegistry';
import {templateRegistry} from '@/generated/templateRegistry';
import {guideRegistry} from '@/generated/guideRegistry';
import {foundationPages} from '@/generated/foundationPages';

export function DocsIndex() {
  const tiles = [
    ...guideRegistry.map(guide => ({
      href: `/docs/${guide.name}`,
      title: guide.title,
      description: guide.description,
      group: 'Guides',
    })),
    ...foundationPages.map(page => ({
      href: `/docs/foundations/${page.name}`,
      title: page.title,
      description: 'Printed from the built theme.',
      group: 'Foundations',
    })),
    {
      href: '/docs/components',
      title: 'Components',
      description: `All ${componentRegistry.length} modules, each with live examples.`,
      group: 'Library',
    },
    {
      href: '/docs/templates',
      title: 'Templates',
      description: `${templateRegistry.length} whole pages, assembled from Tecton components.`,
      group: 'Library',
    },
  ];

  const groups = [...new Set(tiles.map(tile => tile.group))];

  return (
    <div className="not-prose grid gap-8">
      {groups.map(group => (
        <section key={group} className="grid gap-3">
          <h3 className="text-sm font-semibold tracking-wide text-fd-muted-foreground uppercase">
            {group}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tiles
              .filter(tile => tile.group === group)
              .map(tile => (
                <Link
                  key={tile.href}
                  href={tile.href}
                  className="rounded-lg no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                >
                  <Card variant="muted" minHeight={96}>
                    <VStack gap={1}>
                      <Text weight="bold">{tile.title}</Text>
                      <Text type="supporting" color="secondary">
                        {tile.description}
                      </Text>
                    </VStack>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
