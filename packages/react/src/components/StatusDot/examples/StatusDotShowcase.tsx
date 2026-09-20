import {HStack} from '../../HStack/HStack.js';
import {StatusDot} from '../StatusDot.js';

export function StatusDotShowcase() {
  return (
    <HStack gap={2}>
      <StatusDot variant="success" label="Positive" />
      <StatusDot variant="warning" label="Warning" />
      <StatusDot variant="error" label="Negative" />
      <StatusDot variant="accent" label="Info" />
      <StatusDot variant="neutral" label="Neutral" />
    </HStack>
  );
}
