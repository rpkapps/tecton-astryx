'use client';

import {Icon} from '@tecton/react/Icon';
import {HStack, VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const colors = [
  'blue',
  'red',
  'green',
  'gray',
  'cyan',
  'teal',
  'yellow',
  'orange',
  'pink',
  'purple',
] as const;

export function IconNonSemanticColors() {
  return (
    <HStack gap={4} wrap="wrap">
      {colors.map(color => (
        <VStack key={color} gap={1} hAlign="center">
          <Icon icon="search" color={color} />
          <Text type="supporting">{color}</Text>
        </VStack>
      ))}
    </HStack>
  );
}
