'use client';

import {Center} from '@tecton/react/Center';
import {Stack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';

export function CenterShowcase() {
  return (
    <Center axis="both" width="100%" height={240}>
      <Stack direction="vertical" gap={2} hAlign="center">
        <Heading level={4}>Centered content</Heading>
        <Text type="body" color="secondary">
          Horizontally and vertically aligned.
        </Text>
      </Stack>
    </Center>
  );
}
