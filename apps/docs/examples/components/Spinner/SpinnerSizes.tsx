'use client';

import {Spinner} from '@tecton/react/Spinner';
import {HStack} from '@tecton/react/Layout';

export function SpinnerSizes() {
  return (
    <HStack gap={4} vAlign="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </HStack>
  );
}
