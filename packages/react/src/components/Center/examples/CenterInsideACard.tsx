import {Card} from '../../Card/Card.js';
import {Center} from '../Center.js';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function CenterInsideACard() {
  return (
    <Card width={400}>
      <Center height={200}>
        <Stack direction="vertical" gap={2}>
          <Icon name={'folder-open'} size={24} />
          <Text variant="medium" weight="bold">
            No messages yet
          </Text>
          <Text variant="small" color="secondary">
            Messages from your team will appear here.
          </Text>
        </Stack>
      </Center>
    </Card>
  );
}
