import {Chip} from '../Chip.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChipEndContent() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Trailing badges for counts or status
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Chip label="Inbox" color="info" />
        <Chip label="Reviews" color="primary" />
        <Chip label="Resolved" color="success" />
      </Stack>
    </Stack>
  );
}
