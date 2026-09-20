'use client';

// In production, use useToast() hook for proper positioning, stacking, and lifecycle.

import {useRef} from 'react';
import {Toast} from '@tecton/react/Toast';
import {useToast} from '@tecton/react/Toast';
import {Button} from '@tecton/react/Button';
import {VStack, HStack} from '@tecton/react/Layout';

export function ToastDismiss() {
  const toast = useToast();
  const dismissRef = useRef<(() => void) | null>(null);

  return (
    <VStack gap={3}>
      <Toast
        type="info"
        body="Uploading file…"
        isAutoHide={false}
        autoHideDuration={5000}
        isExiting={false}
        onDismiss={() => {}}
      />
      <HStack gap={3} vAlign="center">
        <Button
          label="Show toast"
          variant="secondary"
          size="sm"
          onClick={() => {
            dismissRef.current = toast({
              body: 'Uploading file…',
              isAutoHide: false,
            });
          }}
        />
        <Button
          label="Dismiss via code"
          variant="ghost"
          size="sm"
          onClick={() => {
            dismissRef.current?.();
            dismissRef.current = null;
          }}
        />
      </HStack>
    </VStack>
  );
}
