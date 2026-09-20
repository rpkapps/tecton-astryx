'use client';

import {Button} from '@tecton/react/Button';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const SIZES = [
  {size: 'sm' as const, label: 'Small'},
  {size: 'md' as const, label: 'Medium'},
  {size: 'lg' as const, label: 'Large'},
];

export function ButtonSizeVariants() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Primary
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center">
          {SIZES.map(({size, label}) => (
            <Button key={size} label={label} variant="primary" size={size} />
          ))}
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Secondary
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center">
          {SIZES.map(({size, label}) => (
            <Button key={size} label={label} variant="secondary" size={size} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
