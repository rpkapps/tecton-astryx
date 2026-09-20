import {Chip} from '../Chip.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChipIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Icons identify the token category
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Chip label="Sarah Chen" color="info" icon="person" />
        <Chip label="Featured" color="warning" icon="crown" />
        <Chip label="Design" color="primary" icon="numeric" />
        <Chip label="Verified" color="success" icon="lock" />
      </Stack>
    </Stack>
  );
}
