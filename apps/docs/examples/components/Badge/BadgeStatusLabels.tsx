'use client';

import {Badge} from '@tecton/react/Badge';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function BadgeStatusLabels() {
  return (
    <Stack direction="vertical" gap={6}>
      <Stack direction="vertical" gap={2}>
        <Text type="supporting" color="secondary">
          System status
        </Text>
        <Stack direction="horizontal" gap={2} vAlign="center">
          <Badge variant="success" label="Active" />
          <Badge variant="warning" label="Pending" />
          <Badge variant="error" label="Failed" />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Text type="supporting" color="secondary">
          Workflow
        </Text>
        <Stack direction="horizontal" gap={2} vAlign="center">
          <Badge variant="neutral" label="Draft" />
          <Badge variant="info" label="In Review" />
        </Stack>
      </Stack>
    </Stack>
  );
}
