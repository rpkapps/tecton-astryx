import {Badge} from '../../Badge/Badge.js';
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
        <Chip
          label="Inbox"
          color="blue"
          endContent={<Badge variant="info" label={12} />}
        />
        <Chip label="Reviews" color="purple" endContent={<Badge label={3} />} />
        <Chip
          label="Resolved"
          color="green"
          endContent={<Badge variant="success" label="Done" />}
        />
      </Stack>
    </Stack>
  );
}
