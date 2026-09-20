import {Icon} from '../../Icon/Icon.js';
import {IconButton} from '../IconButton.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const VARIANTS = [
  {variant: 'primary' as const, label: 'Primary'},
  {variant: 'secondary' as const, label: 'Secondary'},
  {variant: 'ghost' as const, label: 'Ghost'},
  {variant: 'destructive' as const, label: 'Destructive'},
];

export function IconButtonFloating() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        FABs are usually icon-only — raise one with `elevation="high"`
      </Text>
      <Stack direction="horizontal" gap={3}>
        {VARIANTS.map(({variant, label}) => (
          <IconButton
            key={variant}
            label={label}
            variant={variant}
            icon={<Icon name={'add'} />}
          />
        ))}
      </Stack>
    </Stack>
  );
}
