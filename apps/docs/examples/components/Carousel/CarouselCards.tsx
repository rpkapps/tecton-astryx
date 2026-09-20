'use client';

import {Carousel} from '@tecton/react/Carousel';
import {Card} from '@tecton/react/Card';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const FEATURES = [
  {
    title: 'Design System',
    desc: 'Tokens, components, and patterns',
  },
  {
    title: 'Documentation',
    desc: 'API reference and usage guides',
  },
  {
    title: 'Sandbox',
    desc: 'Visual testing and previews',
  },
  {
    title: 'Library',
    desc: 'Component and hook information',
  },
  {
    title: 'Contributing',
    desc: 'Open source development',
  },
];

export function CarouselCards() {
  return (
    <Stack direction="vertical" gap={3} style={{maxWidth: 520, padding: 8}}>
      <Text type="body" weight="bold">
        Browse features
      </Text>
      <Carousel gap={2} hasSnap aria-label="Feature cards">
        {FEATURES.map(item => (
          <Card key={item.title} width={200} minHeight={100}>
            <Stack direction="vertical" gap={1}>
              <Text type="body" weight="bold">
                {item.title}
              </Text>
              <Text type="supporting" color="secondary">
                {item.desc}
              </Text>
            </Stack>
          </Card>
        ))}
      </Carousel>
    </Stack>
  );
}
