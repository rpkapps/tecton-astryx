'use client';

import {ClickableCard} from '@tecton/react/ClickableCard';
import {Stack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';
import {Button} from '@tecton/react/Button';

export function ClickableCardWithNestedButton() {
  return (
    <ClickableCard label="Product" href="#" width={320}>
      <Stack direction="vertical" gap={3}>
        <Stack direction="vertical" gap={1}>
          <Heading level={4}>Wireless Headphones</Heading>
          <Text type="body" color="secondary">
            $79.99
          </Text>
        </Stack>
        <Button label="Add to cart" onClick={() => {}} variant="primary" />
      </Stack>
    </ClickableCard>
  );
}
