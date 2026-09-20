import {Chip} from '../Chip.js';
import {Stack} from '../../Stack/Stack.js';

export function ChipShowcase() {
  return (
    <Stack direction="horizontal" gap={2}>
      <Chip label="Default" />
      <Chip label="Removable" color="info" onRemove={() => {}} />
      <Chip label="Design" color="primary" icon="numeric" />
    </Stack>
  );
}
