import {Card} from '../Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function CardCallout() {
  return (
    <Stack direction="horizontal" gap={4}>
      <Card width={270} variant="muted">
        <Stack direction="vertical" gap={2}>
          <Heading level={3}>Tip</Heading>
          <Text variant="medium" color="secondary">
            Use the muted variant for callouts or supplementary information.
          </Text>
        </Stack>
      </Card>
      <Card width={270} variant="muted">
        <Stack direction="vertical" gap={2}>
          <Heading level={3}>Note</Heading>
          <Text variant="medium" color="secondary">
            Muted cards work well in sidebars or help panels.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
