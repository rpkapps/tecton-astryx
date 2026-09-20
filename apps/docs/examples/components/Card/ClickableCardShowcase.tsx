'use client';

import {ClickableCard} from '@tecton/react/ClickableCard';
import {Stack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';

export function ClickableCardShowcase() {
  return (
    <ClickableCard label="Settings" href="#" width={320}>
      <Stack direction="vertical" gap={2}>
        <Heading level={4}>Settings</Heading>
        <Text type="body" color="secondary">
          Click anywhere on this card to navigate. Nested buttons and links work
          independently.
        </Text>
      </Stack>
    </ClickableCard>
  );
}
