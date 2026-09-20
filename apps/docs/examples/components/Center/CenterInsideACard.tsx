'use client';

import {Center} from '@tecton/react/Center';
import {Card} from '@tecton/react/Card';
import {Stack} from '@tecton/react/Layout';
import {Icon} from '@tecton/react/Icon';
import {Text} from '@tecton/react/Text';
import {FolderOpenIcon} from '@tecton/react/icons';

export function CenterInsideACard() {
  return (
    <Card width={400}>
      <Center height={200}>
        <Stack direction="vertical" gap={2} hAlign="center">
          <Icon icon={FolderOpenIcon} size="lg" color="secondary" />
          <Text type="body" weight="bold">
            No messages yet
          </Text>
          <Text type="supporting" color="secondary">
            Messages from your team will appear here.
          </Text>
        </Stack>
      </Center>
    </Card>
  );
}
