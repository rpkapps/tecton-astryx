import {Chip} from '../Chip.js';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChipIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Icons identify the token category
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Chip
          label="Sarah Chen"
          color="blue"
          icon={<Icon name={'person'} size={16} />}
        />
        <Chip
          label="Featured"
          color="yellow"
          icon={<Icon name={'crown'} size={16} />}
        />
        <Chip
          label="Design"
          color="purple"
          icon={<Icon name={'numeric'} size={16} />}
        />
        <Chip
          label="Verified"
          color="green"
          icon={<Icon name={'lock'} size={16} />}
        />
      </Stack>
    </Stack>
  );
}
