import type {CSSProperties} from 'react';
import {AspectRatio} from '../../components/AspectRatio/AspectRatio.js';
import {Button} from '../../components/Button/Button.js';
import {Grid} from '../../components/Grid/Grid.js';
import {HStack} from '../../components/HStack/HStack.js';
import {Heading} from '../../components/Heading/Heading.js';
import {Layout} from '../../components/Layout/Layout.js';
import {LayoutContent} from '../../components/LayoutContent/LayoutContent.js';
import {Text} from '../../components/Text/Text.js';
import {VStack} from '../../components/VStack/VStack.js';

const IMAGES = [
  {
    src: '/template-assets/colorful-home-horizontal-1.png',
    alt: 'Colorful home interior with vibrant decor',
  },
  {
    src: '/template-assets/colorful-lifestyle-horizontal-1.png',
    alt: 'Colorful lifestyle portrait with natural lighting',
  },
  {
    src: '/template-assets/colorful-lifestyle-horizontal-2.png',
    alt: 'Colorful lifestyle scene with warm tones',
  },
];

// NOTE: The only custom styling here is image fill + corner radius. It exists
// because Astryx has no image primitive — AspectRatio exposes no objectFit or
// radius props and there's no Image. Tracked in issue #2582; replace these
// with component props once it lands.
// Fills the AspectRatio box. No objectFit prop on AspectRatio (#2582).
const galleryImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};
// Rounds the image corners. No radius prop on AspectRatio (#2582).
const galleryImageClip: CSSProperties = {
  borderRadius: 'var(--radius-container)',
};

export function Template() {
  return (
    <Layout
      content={
        <LayoutContent padding={6}>
          <VStack gap={10}>
            <VStack gap={6}>
              <VStack gap={3}>
                <Heading level={1} variant="display2" align="center">
                  Little joys, everywhere you go
                </Heading>
                <Text variant="medium" color="secondary" align="center">
                  Sometimes all it takes is one small thing to turn your whole
                  day around.
                </Text>
              </VStack>
              <HStack gap={3}>
                <Button label="Get started" variant="primary" />
                <Button label="Learn more" variant="secondary" />
              </HStack>
            </VStack>
            <Grid columns={{minWidth: 200, repeat: 'fit'}} gap={4}>
              {IMAGES.map(image => (
                <AspectRatio
                  key={image.src}
                  ratio={4 / 5}
                  style={galleryImageClip}
                >
                  <img style={galleryImage} src={image.src} alt={image.alt} />
                </AspectRatio>
              ))}
            </Grid>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
