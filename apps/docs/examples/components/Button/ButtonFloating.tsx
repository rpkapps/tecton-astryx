'use client';

import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {AddIcon} from '@tecton/react/icons';

const VARIANTS = [
  {variant: 'primary' as const, label: 'Primary'},
  {variant: 'secondary' as const, label: 'Secondary'},
  {variant: 'ghost' as const, label: 'Ghost'},
  {variant: 'destructive' as const, label: 'Destructive'},
];

export function ButtonFloating() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Floating action buttons — raised above content with `elevation="med"`
      </Text>
      <Stack direction="horizontal" gap={3} vAlign="center">
        {VARIANTS.map(({variant, label}) => (
          <Button
            key={variant}
            label={label}
            variant={variant}
            icon={<Icon icon={AddIcon} />}
            elevation="med"
          />
        ))}
      </Stack>
    </Stack>
  );
}
