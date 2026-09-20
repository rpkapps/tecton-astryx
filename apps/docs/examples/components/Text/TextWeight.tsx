'use client';

import {Text} from '@tecton/react/Text';
import {Stack} from '@tecton/react/Stack';

const WEIGHTS = [
  {weight: 'normal' as const, label: 'Normal'},
  {weight: 'medium' as const, label: 'Medium'},
  {weight: 'semibold' as const, label: 'Semibold'},
  {weight: 'bold' as const, label: 'Bold'},
];

export function TextWeight() {
  return (
    <Stack direction="vertical" gap={3}>
      {WEIGHTS.map(({weight, label}) => (
        <Text key={weight} type="body" weight={weight} display="block">
          {label}
        </Text>
      ))}
    </Stack>
  );
}
