'use client';

import {StatusDot} from '@tecton/react/StatusDot';
import {HStack} from '@tecton/react/Layout';

export function StatusDotPulsing() {
  return (
    <HStack gap={2} vAlign="center">
      <StatusDot variant="success" label="Live" isPulsing />
      <StatusDot variant="warning" label="Processing" isPulsing />
      <StatusDot variant="error" label="Error" isPulsing />
      <StatusDot variant="accent" label="Processing" isPulsing />
      <StatusDot variant="neutral" label="Error" isPulsing />
    </HStack>
  );
}
