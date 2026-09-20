/**
 * The component gallery.
 *
 * Ported from the upstream docsite's `src/app/(docs)/components/page.tsx`: one
 * section per category, in upstream's own order, each a responsive grid of
 * 16:10 tiles that render the component's showcase. A category with nothing in
 * it is skipped rather than printed empty.
 *
 * Tiles are pages, and a page is a module: `Chat` has one tile, not one per
 * part, because the part is documented on the module's page.
 */

import {Fragment, useMemo} from 'react';
import {ClickableCard} from '@tecton/react/ClickableCard';
import {Divider} from '@tecton/react/Divider';
import {Grid} from '@tecton/react/Grid';
import {VStack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';
import {componentIndex} from '@/generated/componentIndex';
import {ShowcaseThumbnail} from './showcase-thumbnail';

/** Upstream's category order; anything empty is skipped. */
const CATEGORIES = [
  'Action',
  'Chat',
  'Container',
  'Content',
  'Data Visualization',
  'Feedback & Status',
  'Form Controls',
  'Layout',
  'Navigation',
  'Overlay',
  'Table & List',
  'Utility',
] as const;

interface Tile {
  name: string;
  displayName: string;
  href: string;
  category: string;
}

export function ComponentGallery() {
  const grouped = useMemo(() => {
    const tiles: Tile[] = componentIndex
      .filter(entry => !entry.isHiddenFromOverview)
      .filter(entry => !entry.isHook)
      .filter(entry => entry.group !== 'Utilities')
      .filter(entry => entry.category != null)
      .map(entry => ({
        name: entry.name,
        displayName: entry.displayName,
        href: `/docs/components/${entry.name}/`,
        category: entry.category as string,
      }));

    return CATEGORIES.map(category => ({
      category,
      items: tiles
        .filter(tile => tile.category === category)
        .sort((a, b) => a.displayName.localeCompare(b.displayName)),
    })).filter(group => group.items.length > 0);
  }, []);

  return (
    <div className="not-prose grid gap-10">
      {grouped.map(({category, items}) => (
        <Fragment key={category}>
          <Divider />
          <VStack gap={4}>
            <Heading level={2}>{category}</Heading>
            <Grid columns={{minWidth: 260, repeat: 'fill'}} gap={3} rowGap={4}>
              {items.map(item => (
                // `data-component` is the handle the tests reach the tile by:
                // a ClickableCard's anchor is an empty overlay, so the preview
                // inside the card is not reachable through the link.
                <VStack key={item.name} gap={1} data-component={item.name}>
                  <ClickableCard
                    label={item.displayName}
                    href={item.href}
                    padding={0}
                    variant="transparent"
                  >
                    <ShowcaseThumbnail name={item.name} />
                  </ClickableCard>
                  <Text type="supporting">{item.displayName}</Text>
                </VStack>
              ))}
            </Grid>
          </VStack>
        </Fragment>
      ))}
    </div>
  );
}
