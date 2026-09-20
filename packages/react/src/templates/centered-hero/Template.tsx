import type {CSSProperties} from 'react';
import {AspectRatio} from '../../components/AspectRatio/AspectRatio.js';
import {Button} from '../../components/Button/Button.js';
import {HStack} from '../../components/HStack/HStack.js';
import {Heading} from '../../components/Heading/Heading.js';
import {Layout} from '../../components/Layout/Layout.js';
import {LayoutContent} from '../../components/LayoutContent/LayoutContent.js';
import {Section} from '../../components/Section/Section.js';
import {Text} from '../../components/Text/Text.js';
import {VStack} from '../../components/VStack/VStack.js';

const IMAGE_URL = '/template-assets/light-scene-horizontal-1.png';

const heroImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};
const heroFrame: CSSProperties = {
  maxWidth: 1200,
  marginInline: 'auto',
  borderRadius: 'var(--radius-page)',
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
            <Section variant="transparent" padding={0}>
              <AspectRatio ratio={16 / 9} style={heroFrame}>
                <img
                  style={heroImage}
                  src={IMAGE_URL}
                  alt="A bright, colorful lifestyle scene"
                />
              </AspectRatio>
            </Section>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
