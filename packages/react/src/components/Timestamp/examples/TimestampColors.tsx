import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {Timestamp} from '../Timestamp.js';

const DATE = '2026-02-19T17:00:00Z';

export function TimestampColors() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Primary
        </Text>
        <Timestamp value={DATE} format="date_time" color="primary" />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Secondary
        </Text>
        <Timestamp value={DATE} format="date_time" color="secondary" />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Disabled
        </Text>
        <Timestamp value={DATE} format="date_time" color="disabled" />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Accent
        </Text>
        <Timestamp value={DATE} format="date_time" color="accent" />
      </Stack>
    </Stack>
  );
}
