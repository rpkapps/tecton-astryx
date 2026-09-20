'use client';

import {VStack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';

export function VStackBasic() {
  return (
    <VStack gap={3}>
      <Heading level={5}>Weekly Report</Heading>
      <Text type="body" color="secondary">
        VStack arranges its children in a vertical column.
      </Text>
      <Text type="body" color="secondary">
        The gap prop controls the spacing between each item.
      </Text>
    </VStack>
  );
}
