import {Card} from '../../Card/Card.js';
import {Carousel} from '../Carousel.js';
import {Heading} from '../../Heading/Heading.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const ITEMS = [
  {title: 'Design', body: 'Create wireframes and prototypes.'},
  {title: 'Develop', body: 'Build components and pages.'},
  {title: 'Test', body: 'Write tests and fix bugs.'},
  {title: 'Deploy', body: 'Ship to production.'},
  {title: 'Monitor', body: 'Track performance and errors.'},
];

export function CarouselShowcase() {
  return (
    <Carousel
      gap={2}
      hasSnap
      hasButtons={false}
      aria-label="Workflow steps"
      style={{maxWidth: 500}}
    >
      {ITEMS.map(item => (
        <Card key={item.title} padding={3}>
          <Stack direction="vertical" gap={1}>
            <Heading level={5}>{item.title}</Heading>
            <Text variant="small" color="secondary">
              {item.body}
            </Text>
          </Stack>
        </Card>
      ))}
    </Carousel>
  );
}
