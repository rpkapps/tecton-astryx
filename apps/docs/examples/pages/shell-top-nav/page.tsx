'use client';

import * as stylex from '@stylexjs/stylex';
import {AppShell} from '@tecton/react/AppShell';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuItem,
  TopNavMegaMenuFeaturedCard,
} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Icon} from '@tecton/react/Icon';
import type {IconType} from '@tecton/react/Icon';
import {IconButton} from '@tecton/react/IconButton';
import {Button} from '@tecton/react/Button';
import {Badge} from '@tecton/react/Badge';
import {Card} from '@tecton/react/Card';
import {Grid} from '@tecton/react/Grid';
import {Stack, VStack} from '@tecton/react/Stack';
import {
  ChristmasTreeIcon,
  CrownIcon,
  DesignIcon,
  ElectricityIcon,
  HomeIcon,
  LayersIcon,
  MapIcon,
  MoneyIcon,
  NumericIcon,
  PersonIcon,
  Robot2Icon,
  SearchIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from '@tecton/react/icons';

const styles = stylex.create({
  // Cap + center the page body so wide screens show whitespace gutters.
  contentMax: {maxWidth: 1100, marginInline: 'auto'},
  // Lock both mega-menu panels to an identical size. Without this, Shop and
  // Brands size to their own content (different widths); since both anchor to
  // the centered nav, switching between them resizes the panel — which reads
  // as flashing/jumping. Fixed item + featured widths make the panels
  // pixel-identical so the transition is seamless.
  megaItems: {gridColumn: '1 / -1', width: 520},
  megaFeatured: {width: 240},
});

type MegaItem = {name: string; tagline: string; icon: IconType};

// Shop and Brands each render 8 items — the mega menu's built-in 2-column grid
// lays them out as 2 columns × 4 rows, alongside a featured card.
const SHOP_ITEMS: MegaItem[] = [
  {name: 'New Arrivals', tagline: 'The latest drops', icon: Robot2Icon},
  {name: 'Womenswear', tagline: 'Dresses, knitwear & more', icon: DesignIcon},
  {name: 'Menswear', tagline: 'Shirts, tailoring & more', icon: NumericIcon},
  {name: 'Home', tagline: 'Bedding, lighting & décor', icon: HomeIcon},
  {
    name: 'Beauty',
    tagline: 'Skincare, fragrance & makeup',
    icon: PersonIcon,
  },
  {
    name: 'Accessories',
    tagline: 'Bags, hats & sunglasses',
    icon: MoneyIcon,
  },
  {name: 'Sale', tagline: 'Up to 50% off', icon: MoneyIcon},
  {name: 'Gift Cards', tagline: 'The perfect present', icon: ChristmasTreeIcon},
];

const BRAND_ITEMS: MegaItem[] = [
  {name: 'Aether', tagline: 'Performance essentials', icon: Robot2Icon},
  {name: 'Northwind', tagline: 'Outdoor & technical', icon: LayersIcon},
  {name: 'Loomwell', tagline: 'Everyday knitwear', icon: ElectricityIcon},
  {name: 'Verdant', tagline: 'Sustainable basics', icon: VisibilityIcon},
  {name: 'Studio Mara', tagline: 'Modern tailoring', icon: CrownIcon},
  {name: 'Atelier Kos', tagline: 'Limited ateliers', icon: ElectricityIcon},
  {name: 'Rue & Co', tagline: 'City streetwear', icon: MapIcon},
  {name: 'Halden', tagline: 'Minimal staples', icon: VisibilityOffIcon},
];

const CATEGORY_TILES = [
  'New Arrivals',
  'Womenswear',
  'Menswear',
  'Home & Living',
  'Beauty',
  'Accessories',
];

// Wraps the 8 items in a fixed-width 2-column grid so every mega menu's item
// area is exactly the same width regardless of its content.
function MegaItems({items}: {items: MegaItem[]}) {
  return (
    <Stack xstyle={styles.megaItems}>
      <Grid columns={2} gap={2}>
        {items.map(item => (
          <TopNavMegaMenuItem
            key={item.name}
            title={item.name}
            description={item.tagline}
            icon={<Icon icon={item.icon} size="md" color="secondary" />}
            href="#"
          />
        ))}
      </Grid>
    </Stack>
  );
}

// Pins the featured card to a fixed width so both panels match exactly.
function MegaFeatured(props: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  linkLabel: string;
  linkHref: string;
}) {
  return (
    <Stack xstyle={styles.megaFeatured}>
      <TopNavMegaMenuFeaturedCard {...props} />
    </Stack>
  );
}

export function Page() {
  return (
    <AppShell
      variant="surface"
      contentPadding={6}
      topNav={
        <TopNav
          label="Lumen storefront navigation"
          heading={
            <TopNavHeading
              heading="Lumen"
              logo={<NavIcon icon={<Icon icon={MoneyIcon} size="sm" />} />}
              headingHref="#"
            />
          }
          centerContent={
            <>
              <TopNavMegaMenu
                label="Shop"
                items={<MegaItems items={SHOP_ITEMS} />}
                featured={
                  <MegaFeatured
                    title="The Autumn Edit"
                    description="Layering staples in warm, earthy tones."
                    image="/template-assets/texture-beige-horizontal-1.png"
                    imageAlt="Autumn collection lookbook"
                    linkLabel="Shop the edit"
                    linkHref="#autumn-edit"
                  />
                }
              />
              <TopNavMegaMenu
                label="Brands"
                items={<MegaItems items={BRAND_ITEMS} />}
                featured={
                  <MegaFeatured
                    title="Meet Studio Mara"
                    description="Modern tailoring, made to last."
                    image="/template-assets/texture-beige-horizontal-2.png"
                    imageAlt="Studio Mara lookbook"
                    linkLabel="Discover the label"
                    linkHref="#studio-mara"
                  />
                }
              />
              <TopNavItem label="Sale" href="#" />
              <TopNavItem label="Service" href="#" />
            </>
          }
          endContent={
            <>
              <IconButton
                label="Search products"
                tooltip="Search"
                variant="ghost"
                icon={<Icon icon={SearchIcon} size="sm" />}
              />
              <Button label="Sign in" variant="ghost" />
              <Button
                label="Checkout"
                variant="primary"
                icon={<Icon icon={MoneyIcon} size="sm" />}
                endContent={<Badge label={3} />}
              />
            </>
          }
        />
      }
    >
      <VStack gap={10} xstyle={styles.contentMax}>
        <Card variant="muted" padding={0} width="100%" height={360} />

        {[0, 1, 2].map(section => (
          <VStack key={section} gap={4}>
            <Card variant="muted" padding={0} width={200} height={24} />
            <Grid columns={{minWidth: 160, repeat: 'fit'}} gap={4}>
              {CATEGORY_TILES.map(tile => (
                <VStack key={tile} gap={2}>
                  <Card variant="muted" padding={0} width="100%" height={120} />
                  <Card variant="muted" padding={0} width="60%" height={14} />
                </VStack>
              ))}
            </Grid>
          </VStack>
        ))}
      </VStack>
    </AppShell>
  );
}
