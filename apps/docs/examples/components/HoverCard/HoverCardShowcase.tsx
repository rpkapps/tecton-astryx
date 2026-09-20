'use client';

import {HoverCard} from '@tecton/react/HoverCard';
import {Button} from '@tecton/react/Button';
import {Stack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';
import {Avatar} from '@tecton/react/Avatar';

export function HoverCardShowcase() {
  return (
    <HoverCard
      placement="above"
      content={
        <Stack direction="vertical" gap={2} style={{width: 240}}>
          <Stack direction="horizontal" gap={2} vAlign="center">
            <Avatar name="Jane Doe" size="lg" />
            <Stack direction="vertical" gap={0}>
              <Heading level={5}>Jane Doe</Heading>
              <Text type="supporting" color="secondary">
                Software Engineer
              </Text>
            </Stack>
          </Stack>
          <Text type="body" color="secondary">
            Building great products with great people.
          </Text>
        </Stack>
      }
    >
      <Button label="@janedoe" variant="ghost" />
    </HoverCard>
  );
}
