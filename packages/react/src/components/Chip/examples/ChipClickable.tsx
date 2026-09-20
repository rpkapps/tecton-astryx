import {Chip} from '../Chip.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChipClickable() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Click a token to view details
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Chip label="Bug" color="red" onClick={() => {}} />
        <Chip label="Feature" color="blue" onClick={() => {}} />
        <Chip label="Enhancement" color="green" onClick={() => {}} />
        <Chip label="Documentation" color="gray" onClick={() => {}} />
      </Stack>
    </Stack>
  );
}
