import {Avatar} from '../../Avatar/Avatar.js';
import {Badge} from '../../Badge/Badge.js';
import {Card} from '../../Card/Card.js';
import {Carousel} from '../Carousel.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const TEAM = [
  {name: 'Alice Chen', role: 'Engineering Lead', color: 'blue' as const},
  {name: 'Bob Smith', role: 'Product Designer', color: 'purple' as const},
  {name: 'Carol Davis', role: 'Product Manager', color: 'green' as const},
  {name: 'Andrew Thomas', role: 'Design Manager', color: 'red' as const},
  {name: 'Gina Wilson', role: 'Software Engineer', color: 'orange' as const},
];

export function CarouselSnap() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text variant="medium" weight="bold">
        Team members
      </Text>
      <Carousel gap={2} hasSnap hasButtons aria-label="Team members">
        {TEAM.map(person => (
          <Card key={person.name} width={180} minHeight={140}>
            <Stack direction="vertical" gap={3}>
              <Avatar name={person.name} size={40} />
              <Stack direction="vertical" gap={1}>
                <Text variant="medium" weight="bold">
                  {person.name}
                </Text>
                <Badge variant={person.color} label={person.role} />
              </Stack>
            </Stack>
          </Card>
        ))}
      </Carousel>
    </Stack>
  );
}
