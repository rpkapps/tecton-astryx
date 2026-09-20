import {Badge} from '../Badge.js';
import {Stack} from '../../Stack/Stack.js';

export function BadgeShowcase() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="horizontal" gap={2}>
        <Badge label="Neutral" variant="neutral" />
        <Badge label="Info" variant="info" />
        <Badge label="Success" variant="success" />
        <Badge label="Warning" variant="warning" />
        <Badge label="Error" variant="error" />
      </Stack>
      <Stack direction="horizontal" gap={2}>
        <Badge label="Blue" />
        <Badge label="Purple" />
        <Badge label="Pink" />
        <Badge label="Teal" />
        <Badge label="Orange" />
      </Stack>
    </Stack>
  );
}
