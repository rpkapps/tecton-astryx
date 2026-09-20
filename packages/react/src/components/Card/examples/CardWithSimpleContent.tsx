import {Card} from '../Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function CardWithSimpleContent() {
  return (
    <Card width={360}>
      <Stack direction="vertical" gap={2}>
        <Heading level={3}>Project Overview</Heading>
        <Text variant="medium" color="secondary">
          This project tracks the redesign of the onboarding flow. The goal is
          to reduce drop-off by 15% in Q2.
        </Text>
        <Text variant="small" color="secondary">
          Last updated 2 hours ago
        </Text>
      </Stack>
    </Card>
  );
}
