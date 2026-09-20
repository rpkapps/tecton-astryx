import {Badge} from '../Badge.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const COUNTS = [
  {variant: 'info' as const, label: '3', note: 'Messages'},
  {variant: 'error' as const, label: '99+', note: 'Alerts'},
  {variant: 'success' as const, label: '12', note: 'Completed'},
  {variant: 'warning' as const, label: '5', note: 'Pending'},
];

export function BadgeCountBadges() {
  return (
    <Stack direction="horizontal" gap={8}>
      {COUNTS.map(({variant, label, note}) => (
        <Stack key={note} direction="vertical" gap={2}>
          <Badge variant={variant} label={label} />
          <Text variant="small" color="secondary">
            {note}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
