'use client';

import {HStack, StackItem} from '@tecton/react/Layout';
import {Card} from '@tecton/react/Card';
import {Text} from '@tecton/react/Text';

export function StackItemShowcase() {
  return (
    <HStack gap={3} vAlign="center" width="100%" style={{maxWidth: 500}}>
      <StackItem size="static">
        <Card padding={3}>
          <Text type="supporting" color="secondary">
            Static Width
          </Text>
        </Card>
      </StackItem>
      <StackItem size="fill">
        <Card padding={3}>
          <Text type="supporting" color="secondary">
            Fills remaining space
          </Text>
        </Card>
      </StackItem>
      <StackItem size="static">
        <Card padding={3}>
          <Text type="supporting" color="secondary">
            Static Width
          </Text>
        </Card>
      </StackItem>
    </HStack>
  );
}
