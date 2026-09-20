'use client';

import {useStreamingText} from '@tecton/react/hooks';
import {Card} from '@tecton/react/Card';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const response =
  'Tecton hooks keep behavior reusable while components keep visuals consistent.';

export function UseStreamingTextHookUsage() {
  const displayedText = useStreamingText(response, false, {
    speed: 'fast',
  });

  return (
    <Card width={420} padding={4}>
      <VStack gap={2}>
        <Text type="body" weight="bold">
          Assistant response
        </Text>
        <Text type="body">{displayedText}</Text>
        <Text type="supporting" color="secondary">
          Complete
        </Text>
      </VStack>
    </Card>
  );
}
