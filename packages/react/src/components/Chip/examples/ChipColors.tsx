import {Chip} from '../Chip.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const COLORS = [
  {color: 'default' as const, label: 'Default'},
  {color: 'red' as const, label: 'Red'},
  {color: 'orange' as const, label: 'Orange'},
  {color: 'yellow' as const, label: 'Yellow'},
  {color: 'green' as const, label: 'Green'},
  {color: 'teal' as const, label: 'Teal'},
  {color: 'cyan' as const, label: 'Cyan'},
  {color: 'blue' as const, label: 'Blue'},
  {color: 'purple' as const, label: 'Purple'},
  {color: 'pink' as const, label: 'Pink'},
  {color: 'gray' as const, label: 'Gray'},
];

export function ChipColors() {
  return (
    <Stack direction="vertical" gap={10} width="100%">
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Default
        </Text>
        <Stack direction="horizontal" gap={1} wrap="wrap">
          {COLORS.map(({color, label}) => (
            <Chip key={color} label={label} color={color} />
          ))}
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Disabled
        </Text>
        <Stack direction="horizontal" gap={1} wrap="wrap">
          {COLORS.map(({color, label}) => (
            <Chip key={color} label={label} color={color} isDisabled />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
