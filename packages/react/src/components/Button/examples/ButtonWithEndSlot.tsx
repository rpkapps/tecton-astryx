import {Button} from '../Button.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ButtonWithEndSlot() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Trailing badges for counts or status
      </Text>
      <Stack direction="horizontal" gap={3}>
        <Button label="Messages" variant="primary" />
        <Button label="Notifications" variant="secondary" />
        <Button label="Updates" variant="tertiary" />
      </Stack>
    </Stack>
  );
}
