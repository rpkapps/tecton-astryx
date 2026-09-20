import {Center} from '../Center.js';
import {Heading} from '../../Heading/Heading.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function CenterShowcase() {
  return (
    <Center axis="both" width="100%" height={240}>
      <Stack direction="vertical" gap={2}>
        <Heading level={4}>Centered content</Heading>
        <Text variant="medium" color="secondary">
          Horizontally and vertically aligned.
        </Text>
      </Stack>
    </Center>
  );
}
