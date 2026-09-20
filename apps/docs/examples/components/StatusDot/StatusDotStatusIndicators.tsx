'use client';

import {StatusDot} from '@tecton/react/StatusDot';
import {VStack, HStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const statuses = [
  {variant: 'success', label: 'Online'},
  {variant: 'warning', label: 'Away'},
  {variant: 'error', label: 'Offline'},
  {variant: 'neutral', label: 'Unknown'},
] as const;

export function StatusDotStatusIndicators() {
  return (
    <VStack gap={2}>
      {statuses.map(({variant, label}) => (
        <HStack key={variant} gap={2} vAlign="center">
          <StatusDot variant={variant} label={label} />
          <Text type="body">{label}</Text>
        </HStack>
      ))}
    </VStack>
  );
}
