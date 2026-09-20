'use client';

import {VisuallyHidden} from '@tecton/react/VisuallyHidden';
import {Card} from '@tecton/react/Card';
import {HStack, VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {ArrowDownIcon, ArrowUpIcon} from '@tecton/react/icons';

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
            <Text type="supporting" color="secondary">
              {label}
            </Text>
            <Text type="display-3">{value}</Text>
            <HStack gap={1} vAlign="center">
              <Icon
                icon={direction === 'up' ? ArrowUpIcon : ArrowDownIcon}
                size="sm"
                color={direction === 'up' ? 'accent' : 'secondary'}
              />
              <Text type="body">
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
