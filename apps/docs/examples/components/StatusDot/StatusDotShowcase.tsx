'use client';

import {StatusDot} from '@tecton/react/StatusDot';
import {HStack} from '@tecton/react/Layout';

export function StatusDotShowcase() {
  return (
    <HStack gap={2} vAlign="center">
      <StatusDot variant="success" label="Positive" />
      <StatusDot variant="warning" label="Warning" />
      <StatusDot variant="error" label="Negative" />
      <StatusDot variant="accent" label="Info" />
      <StatusDot variant="neutral" label="Neutral" />
    </HStack>
  );
}
