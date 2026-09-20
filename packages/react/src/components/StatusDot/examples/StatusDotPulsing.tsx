import {HStack} from '../../HStack/HStack.js';
import {StatusDot} from '../StatusDot.js';

export function StatusDotPulsing() {
  return (
    <HStack gap={2}>
      <StatusDot variant="success" label="Live" isPulsing />
      <StatusDot variant="warning" label="Processing" isPulsing />
      <StatusDot variant="error" label="Error" isPulsing />
      <StatusDot variant="accent" label="Processing" isPulsing />
      <StatusDot variant="neutral" label="Error" isPulsing />
    </HStack>
  );
}
