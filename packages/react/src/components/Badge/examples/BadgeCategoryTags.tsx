import {Badge} from '../Badge.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function BadgeCategoryTags() {
  return (
    <Stack direction="vertical" gap={6}>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Teams
        </Text>
        <Stack direction="horizontal" gap={2}>
          <Badge label="Design" />
          <Badge label="DevOps" />
          <Badge label="Backend" />
          <Badge label="Marketing" />
          <Badge label="Engineering" />
          <Badge label="Research" />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Priority
        </Text>
        <Stack direction="horizontal" gap={2}>
          <Badge label="Urgent" />
          <Badge label="Critical" />
          <Badge label="Review" />
        </Stack>
      </Stack>
    </Stack>
  );
}
