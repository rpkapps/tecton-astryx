'use client';

import {useState} from 'react';
import {VisuallyHidden} from '@tecton/react/VisuallyHidden';
import {Button} from '@tecton/react/Button';
import {HStack, VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const columns = ['Backlog', 'In progress', 'Done'] as const;

export function VisuallyHiddenLiveRegion() {
  const [column, setColumn] = useState(0);
  const current = columns[column];

  function move() {
    setColumn(c => (c + 1) % columns.length);
  }

  return (
    <VStack gap={4} hAlign="start">
      <Text type="supporting" color="secondary">
        Drag-and-drop and other visual-only changes are silent to screen
        readers. A live region narrates them.
      </Text>
      <HStack gap={3} vAlign="center">
        <Button label="Move task" variant="secondary" onClick={move} />
        <Text type="body">
          Task is in{' '}
          <Text as="span" weight="bold">
            {current}
          </Text>
        </Text>
      </HStack>
      <VisuallyHidden as="div" aria-live="polite">
        {`Task moved to ${current}`}
      </VisuallyHidden>
    </VStack>
  );
}
