import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Stack} from '../Stack.js';
import {Text} from '../../Text/Text.js';

export function StackAlignment() {
  return (
    <Stack direction="vertical" gap={3} width="100%">
      <Card padding={4}>
        <Stack direction="vertical" gap={4}>
          <Text variant="small" color="secondary">
            Start (left)
          </Text>
          <Stack direction="horizontal" gap={1}>
            <Button label="Cancel" variant="secondary" size="sm" />
            <Button label="Save" variant="primary" size="sm" />
          </Stack>
        </Stack>
      </Card>
      <Card padding={4}>
        <Stack direction="vertical" gap={4}>
          <Text variant="small" color="secondary">
            Center
          </Text>
          <Stack direction="horizontal" gap={1}>
            <Button label="Cancel" variant="secondary" size="sm" />
            <Button label="Save" variant="primary" size="sm" />
          </Stack>
        </Stack>
      </Card>
      <Card padding={4}>
        <Stack direction="vertical" gap={4}>
          <Text variant="small" color="secondary">
            End (right)
          </Text>
          <Stack direction="horizontal" gap={1}>
            <Button label="Cancel" variant="secondary" size="sm" />
            <Button label="Save" variant="primary" size="sm" />
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
