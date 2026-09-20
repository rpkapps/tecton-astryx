import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {VisuallyHidden} from '../VisuallyHidden.js';

const columns = ['Backlog', 'In progress', 'Done'] as const;

export function VisuallyHiddenLiveRegion() {
  const [column, setColumn] = useState(0);
  const current = columns[column];

  function move() {
    setColumn(c => (c + 1) % columns.length);
  }

  return (
    <VStack gap={4}>
      <Text variant="small" color="secondary">
        Drag-and-drop and other visual-only changes are silent to screen
        readers. A live region narrates them.
      </Text>
      <HStack gap={3}>
        <Button label="Move task" variant="secondary" onClick={move} />
        <Text variant="medium">
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
