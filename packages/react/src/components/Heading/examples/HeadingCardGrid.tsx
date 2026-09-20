import {Card} from '../../Card/Card.js';
import {Heading} from '../Heading.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function HeadingCardGrid() {
  return (
    <Card width={300}>
      <VStack gap={2}>
        <Heading level={3}>Card Title</Heading>
        <Text variant="medium" maxLines={2} display="block">
          This is a card description that might be quite long and needs to be
          truncated after two lines to keep the card compact and uniform.
        </Text>
        <Text variant="small" display="block">
          Updated 1 hour ago
        </Text>
      </VStack>
    </Card>
  );
}
