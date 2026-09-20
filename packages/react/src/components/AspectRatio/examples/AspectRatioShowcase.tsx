import {AspectRatio} from '../AspectRatio.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const items = [
  {
    ratio: 1,
    label: '1 : 1',
    src: '/template-assets/light-home-square-1.png',
    alt: '1:1 square',
  },
  {
    ratio: 4 / 3,
    label: '4 : 3',
    src: '/template-assets/illustrative-horizontal-1.png',
    alt: '4:3 standard',
  },
  {
    ratio: 16 / 9,
    label: '16 : 9',
    src: '/template-assets/light-scene-horizontal-1.png',
    alt: '16:9 widescreen',
  },
];

export function AspectRatioShowcase() {
  return (
    <HStack gap={4}>
      {items.map(({ratio, label, src, alt}) => (
        <VStack key={label} gap={2}>
          <AspectRatio
            ratio={ratio}
            fit="cover"
            style={{
              height: 120,
              width: 'auto',
              borderRadius: 'var(--radius-container)',
            }}
          >
            <img src={src} alt={alt} />
          </AspectRatio>
          <Text variant="small" color="secondary">
            {label}
          </Text>
        </VStack>
      ))}
    </HStack>
  );
}
