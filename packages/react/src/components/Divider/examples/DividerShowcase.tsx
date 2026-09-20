import {Divider} from '../Divider.js';
import {Stack} from '../../Stack/Stack.js';

export function DividerShowcase() {
  return (
    <Stack direction="vertical" gap={4}>
      <Divider variant="subtle" />
      <Divider variant="strong" />
      <Divider label="or" />
    </Stack>
  );
}
