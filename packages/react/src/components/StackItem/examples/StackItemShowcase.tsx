import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {StackItem} from '../StackItem.js';
import {Text} from '../../Text/Text.js';

export function StackItemShowcase() {
  return (
    <HStack gap={3} width="100%">
      <StackItem size="static">
        <Card padding={3}>
          <Text variant="small" color="secondary">
            Static Width
          </Text>
        </Card>
      </StackItem>
      <StackItem size="fill">
        <Card padding={3}>
          <Text variant="small" color="secondary">
            Fills remaining space
          </Text>
        </Card>
      </StackItem>
      <StackItem size="static">
        <Card padding={3}>
          <Text variant="small" color="secondary">
            Static Width
          </Text>
        </Card>
      </StackItem>
    </HStack>
  );
}
