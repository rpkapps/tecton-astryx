'use client';

import {Spinner} from '@tecton/react/Spinner';
import {HStack} from '@tecton/react/Layout';

export function SpinnerOnMedia() {
  return (
    <HStack gap={4} vAlign="center">
      <Spinner shade="default" />
      <div
        style={{
          backgroundColor: '#1a1a2e',
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Spinner shade="onMedia" />
      </div>
    </HStack>
  );
}
