'use client';

import {
  Layout,
  LayoutContent,
  LayoutHeader,
  Card,
  VStack,
} from '@tecton/react/Layout';
import {Center} from '@tecton/react/Center';
import {Text, Heading} from '@tecton/react/Text';

export function LayoutContentBasic() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <Card variant="muted" />
          </LayoutHeader>
        }
        content={
          <LayoutContent role="main">
            <VStack gap={3}>
              <Heading level={5}>Main Content</Heading>
              <Text type="body" color="secondary">
                LayoutContent fills the remaining space and scrolls when its
                content overflows, while the header stays fixed.
              </Text>
            </VStack>
          </LayoutContent>
        }
      />
    </Center>
  );
}
