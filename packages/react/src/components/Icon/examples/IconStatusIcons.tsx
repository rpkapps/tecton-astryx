import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../Icon.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

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
        <HStack key={status.label} gap={2}>
          <Icon name={status.icon} size={16} />
          <Text variant="medium">{status.label}</Text>
        </HStack>
      ))}
    </VStack>
  );
}
