import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../../Icon/Icon.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {VisuallyHidden} from '../VisuallyHidden.js';

const stats = [
  {label: 'Revenue', value: '$48.2k', delta: '+12%', direction: 'up'},
  {label: 'Churn', value: '2.1%', delta: '-4%', direction: 'down'},
] as const;

export function VisuallyHiddenSupplementaryContext() {
  return (
    <HStack gap={4} wrap="wrap">
      {stats.map(({label, value, delta, direction}) => (
        <Card key={label} variant="muted">
          <VStack gap={1}>
            <Text variant="small" color="secondary">
              {label}
            </Text>
            <Text variant="display3">{value}</Text>
            <HStack gap={1}>
              <Icon
                name={direction === 'up' ? 'arrow-up' : 'arrow-down'}
                size={16}
              />
              <Text variant="medium">
                {delta}
                {/* The arrow is decorative; spell out the trend for AT. */}
                <VisuallyHidden>
                  {direction === 'up' ? ' increase' : ' decrease'} from last
                  month
                </VisuallyHidden>
              </Text>
            </HStack>
          </VStack>
        </Card>
      ))}
    </HStack>
  );
}
