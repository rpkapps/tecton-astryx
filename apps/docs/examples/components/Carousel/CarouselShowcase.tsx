'use client';

import {Carousel} from '@tecton/react/Carousel';
import {Card} from '@tecton/react/Card';
import {Stack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';

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
        <Card key={item.title} padding={3} style={{minWidth: 200}}>
          <Stack direction="vertical" gap={1}>
            <Heading level={5}>{item.title}</Heading>
            <Text type="supporting" color="secondary">
              {item.body}
            </Text>
          </Stack>
        </Card>
      ))}
    </Carousel>
  );
}
