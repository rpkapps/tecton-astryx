import {HStack} from '../../HStack/HStack.js';
import {StatusDot} from '../StatusDot.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

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
        <HStack key={variant} gap={2}>
          <StatusDot variant={variant} label={label} />
          <Text variant="medium">{label}</Text>
        </HStack>
      ))}
    </VStack>
  );
}
