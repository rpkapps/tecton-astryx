import {Stack} from '../../Stack/Stack.js';
import {Text} from '../Text.js';

export function TextShowcase() {
  return (
    <Stack direction="vertical" gap={2}>
      <Text variant="medium">Body: The bulk of content</Text>
      <Text variant="large">Large: Emphasized content</Text>
      <Text variant="smallStrong">Label: Form and chart labels</Text>
      <Text variant="small">Supporting: Helper text</Text>
      <Text variant="smallData">Code: const x = 42;</Text>
    </Stack>
  );
}
