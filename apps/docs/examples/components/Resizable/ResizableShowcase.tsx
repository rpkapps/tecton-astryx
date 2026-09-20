'use client';

import {useResizable, ResizeHandle} from '@tecton/react/Resizable';
import {
  Card,
  Layout,
  LayoutContent,
  LayoutPanel,
  VStack,
} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';

export function ResizableShowcase() {
  const sidebar = useResizable({
    defaultSize: 200,
    minSize: 120,
    maxSize: 400,
  });

  return (
    <Card variant="muted" height={280} width={600}>
      <Layout
        height="fill"
        start={
          <>
            <LayoutPanel width={sidebar.size} hasDivider={false}>
              <VStack gap={2}>
                <Heading level={4}>Sidebar</Heading>
                <Text color="secondary">{Math.round(sidebar.size)}px wide</Text>
              </VStack>
            </LayoutPanel>
            <ResizeHandle
              direction="horizontal"
              hasDivider
              resizable={sidebar.props}
              label="Resize sidebar"
            />
          </>
        }
        content={
          <LayoutContent>
            <VStack gap={2}>
              <Heading level={4}>Content</Heading>
              <Text color="secondary">
                Drag the handle to resize the sidebar.
              </Text>
            </VStack>
          </LayoutContent>
        }
      />
    </Card>
  );
}
