import {useState, type CSSProperties} from 'react';
import {Center} from '../../components/Center/Center.js';
import {Grid} from '../../components/Grid/Grid.js';
import {Heading} from '../../components/Heading/Heading.js';
import {Layout} from '../../components/Layout/Layout.js';
import {LayoutContent} from '../../components/LayoutContent/LayoutContent.js';
import {Section} from '../../components/Section/Section.js';
import {Tab} from '../../components/Tab/Tab.js';
import {Tabs} from '../../components/Tabs/Tabs.js';
import {Text} from '../../components/Text/Text.js';
import {VStack} from '../../components/VStack/VStack.js';
const imageWrapper: CSSProperties = {
  position: 'relative',
  aspectRatio: '3/2',
  borderRadius: 'var(--radius-container)',
  overflow: 'clip',
};
const imgFill: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

// ─── Gallery Data ───────────────────────────────────────────────────────────

type Category = 'all' | 'lifestyle' | 'scene' | 'home';

interface GalleryImage {
  src: string;
  alt: string;
  category: Category;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/template-assets/moody-scene-horizontal-1.png',
    alt: 'Moody scene landscape',
    category: 'scene',
  },
  {
    src: '/template-assets/moody-lifestyle-vertical-1.png',
    alt: 'Moody lifestyle portrait',
    category: 'lifestyle',
  },
  {
    src: '/template-assets/moody-home-vertical-1.png',
    alt: 'Moody home interior',
    category: 'home',
  },
  {
    src: '/template-assets/moody-scene-horizontal-2.png',
    alt: 'Moody scene vista',
    category: 'scene',
  },
  {
    src: '/template-assets/moody-lifestyle-vertical-2.png',
    alt: 'Moody lifestyle scene',
    category: 'lifestyle',
  },
  {
    src: '/template-assets/moody-lifestyle-horizontal-1.png',
    alt: 'Moody lifestyle horizontal',
    category: 'lifestyle',
  },
  {
    src: '/template-assets/moody-scene-vertical-1.png',
    alt: 'Moody scene vertical',
    category: 'scene',
  },
  {
    src: '/template-assets/moody-home-vertical-2.png',
    alt: 'Moody home vertical',
    category: 'home',
  },
  {
    src: '/template-assets/moody-home-horizontal-1.png',
    alt: 'Moody home horizontal',
    category: 'home',
  },
  {
    src: '/template-assets/moody-scene-vertical-2.png',
    alt: 'Moody scene vertical',
    category: 'scene',
  },
];

// ─── Main Page ──────────────────────────────────────────────────────────────

export function Template() {
  const [filter, setFilter] = useState<Category>('all');

  const filteredImages =
    filter === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={0}>
          <Center axis="horizontal">
            <VStack gap={8}>
              {/* Header */}
              <Center axis="horizontal">
                <Section variant="transparent" maxWidth={680} padding={0}>
                  <VStack gap={4}>
                    <VStack gap={2}>
                      <Heading level={1}>
                        Make every day a little more delightful, one detail at a
                        time.
                      </Heading>
                      <Text variant="medium" color="secondary">
                        We believe the smallest details are the ones that matter
                        most. A little color, a thoughtful touch, a moment that
                        catches your eye and makes you pause; that&apos;s what
                        turns an ordinary day into something worth remembering.
                      </Text>
                    </VStack>

                    <Tabs
                      value={filter}
                      onChange={v => setFilter(v as Category)}
                    >
                      <Tab value="all" label="All" />
                      <Tab value="lifestyle" label="Lifestyle" />
                      <Tab value="scene" label="Scenery" />
                      <Tab value="home" label="Home" />
                    </Tabs>
                  </VStack>
                </Section>
              </Center>

              {/* Gallery Grid */}
              <Grid columns={{minWidth: 260, repeat: 'fit'}} gap={4}>
                {filteredImages.map((image, i) => (
                  <div key={i} style={imageWrapper}>
                    <img src={image.src} alt={image.alt} style={imgFill} />
                  </div>
                ))}
              </Grid>
            </VStack>
          </Center>
        </LayoutContent>
      }
    />
  );
}
