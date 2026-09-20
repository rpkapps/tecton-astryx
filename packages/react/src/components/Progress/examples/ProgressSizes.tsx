import {HStack} from '../../HStack/HStack.js';
import {Progress} from '../Progress.js';

export function ProgressSizes() {
  return (
    <HStack gap={4}>
      <Progress size="sm" />
      <Progress size="md" />
      <Progress size="md" />
      <Progress size="xl" />
    </HStack>
  );
}
