import {HStack} from '../../HStack/HStack.js';
import {Progress} from '../Progress.js';

export function ProgressOnMedia() {
  return (
    <HStack gap={4}>
      <Progress shade="default" />
      <div
        style={{
          backgroundColor: '#1a1a2e',
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Progress shade="onMedia" />
      </div>
    </HStack>
  );
}
