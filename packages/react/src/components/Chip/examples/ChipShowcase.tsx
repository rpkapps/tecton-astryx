import {Chip} from '../Chip.js';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';

export function ChipShowcase() {
  return (
    <Stack direction="horizontal" gap={2}>
      <Chip label="Default" />
      <Chip label="Removable" color="blue" onRemove={() => {}} />
      <Chip
        label="Design"
        color="purple"
        icon={<Icon name={'numeric'} size={16} />}
      />
    </Stack>
  );
}
