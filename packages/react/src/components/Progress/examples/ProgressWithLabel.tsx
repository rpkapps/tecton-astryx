import {HStack} from '../../HStack/HStack.js';
import {Progress} from '../Progress.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function ProgressWithLabel() {
  return (
    <HStack gap={8}>
      <Progress size="md" label="Loading..." />
      <Progress
        size="md"
        label={
          <VStack gap={0}>
            <Text variant="medium" weight="bold">
              Fetching data
            </Text>
            <Text variant="small" color="secondary">
              This may take a moment
            </Text>
          </VStack>
        }
        aria-label="Fetching data"
      />
    </HStack>
  );
}
