import {Button} from '../Button.js';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const VARIANTS = [
  {variant: 'primary' as const, label: 'Primary'},
  {variant: 'secondary' as const, label: 'Secondary'},
  {variant: 'ghost' as const, label: 'Ghost'},
  {variant: 'destructive' as const, label: 'Destructive'},
];

export function ButtonFloating() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Floating action buttons — raised above content with `elevation="med"`
      </Text>
      <Stack direction="horizontal" gap={3}>
        {VARIANTS.map(({variant, label}) => (
          <Button
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
