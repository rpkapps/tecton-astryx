'use client';

import {Card} from '@tecton/react/Card';
import {Stack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';

export function CardWithSimpleContent() {
  return (
    <Card width={360}>
      <Stack direction="vertical" gap={2}>
        <Heading level={3}>Project Overview</Heading>
        <Text type="body" color="secondary">
          This project tracks the redesign of the onboarding flow. The goal is
          to reduce drop-off by 15% in Q2.
        </Text>
        <Text type="supporting" color="secondary">
          Last updated 2 hours ago
        </Text>
      </Stack>
    </Card>
  );
}
