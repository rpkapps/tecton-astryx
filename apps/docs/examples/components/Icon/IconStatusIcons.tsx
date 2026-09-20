'use client';

import {Icon} from '@tecton/react/Icon';
import {VStack, HStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const statuses = [
  {
    icon: 'success' as const,
    color: 'success' as const,
    label: 'Deployed successfully',
  },
  {
    icon: 'warning' as const,
    color: 'warning' as const,
    label: 'Build has warnings',
  },
  {icon: 'error' as const, color: 'error' as const, label: 'Pipeline failed'},
  {
    icon: 'info' as const,
    color: 'accent' as const,
    label: 'New version available',
  },
] as const;

export function IconStatusIcons() {
  return (
    <VStack gap={3}>
      {statuses.map(status => (
        <HStack key={status.label} gap={2} vAlign="center">
          <Icon icon={status.icon} color={status.color} size="sm" />
          <Text type="body">{status.label}</Text>
        </HStack>
      ))}
    </VStack>
  );
}
