import {Button} from '../Button.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const SIZES = [
  {size: 'sm' as const, label: 'Small'},
  {size: 'md' as const, label: 'Medium'},
  {size: 'lg' as const, label: 'Large'},
];

export function ButtonSizeVariants() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Primary
        </Text>
        <Stack direction="horizontal" gap={3}>
          {SIZES.map(({size, label}) => (
            <Button key={size} label={label} variant="primary" size={size} />
          ))}
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Secondary
        </Text>
        <Stack direction="horizontal" gap={3}>
          {SIZES.map(({size, label}) => (
            <Button key={size} label={label} variant="secondary" size={size} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
