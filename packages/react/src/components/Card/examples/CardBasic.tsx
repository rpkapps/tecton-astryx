import {Card} from '../Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function CardBasic() {
  return (
    <Card maxWidth={320}>
      <VStack gap={1}>
        <Heading level={4}>Reduced DLS</Heading>
        <Text variant="small" color="secondary">
          A gentler build section, trading 3 days for a lower torque profile.
        </Text>
      </VStack>
    </Card>
  );
}
