import {Card} from '../../Card/Card.js';
import {Carousel} from '../Carousel.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

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
    <Stack direction="vertical" gap={3}>
      <Text variant="medium" weight="bold">
        Browse features
      </Text>
      <Carousel gap={2} hasSnap aria-label="Feature cards">
        {FEATURES.map(item => (
          <Card key={item.title} width={200} minHeight={100}>
            <Stack direction="vertical" gap={1}>
              <Text variant="medium" weight="bold">
                {item.title}
              </Text>
              <Text variant="small" color="secondary">
                {item.desc}
              </Text>
            </Stack>
          </Card>
        ))}
      </Carousel>
    </Stack>
  );
}
