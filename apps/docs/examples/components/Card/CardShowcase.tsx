'use client';

import {Card} from '@tecton/react/Card';
import {Stack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';

export function CardShowcase() {
  return (
    <Card width={320}>
      <Stack direction="vertical" gap={2}>
        <Heading level={4}>Card title</Heading>
        <Text type="body" color="secondary">
          Cards group related content with a border and background. Use them for
          profiles, settings panels, or data summaries.
        </Text>
      </Stack>
    </Card>
  );
}
