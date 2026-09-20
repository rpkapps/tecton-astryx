import {Card} from '../Card.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const VARIANTS = [
  {variant: 'default' as const, label: 'General', note: '4 tasks due today'},
  {
    variant: 'muted' as const,
    label: 'Archived',
    note: 'No activity in 30 days',
  },
  {variant: 'blue' as const, label: 'Engineering', note: '12 open issues'},
  {variant: 'green' as const, label: 'Marketing', note: '3 campaigns active'},
  {variant: 'orange' as const, label: 'Urgent', note: '2 items need review'},
  {variant: 'purple' as const, label: 'Design', note: '5 drafts in progress'},
];

export function CardVariants() {
  return (
    <Stack direction="horizontal" gap={3}>
      {VARIANTS.map(({variant, label, note}) => (
        <Card key={variant} variant={variant} width={160}>
          <Stack direction="vertical" gap={1}>
            <Text variant="medium" weight="bold">
              {label}
            </Text>
            <Text variant="small" color="secondary">
              {note}
            </Text>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
