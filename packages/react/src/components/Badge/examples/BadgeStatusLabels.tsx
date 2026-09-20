import {Badge} from '../Badge.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function BadgeStatusLabels() {
  return (
    <Stack direction="vertical" gap={6}>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          System status
        </Text>
        <Stack direction="horizontal" gap={2}>
          <Badge variant="success" label="Active" />
          <Badge variant="warning" label="Pending" />
          <Badge variant="error" label="Failed" />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Workflow
        </Text>
        <Stack direction="horizontal" gap={2}>
          <Badge variant="neutral" label="Draft" />
          <Badge variant="info" label="In Review" />
        </Stack>
      </Stack>
    </Stack>
  );
}
