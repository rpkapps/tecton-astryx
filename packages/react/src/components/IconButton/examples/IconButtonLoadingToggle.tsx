import {useState} from 'react';
import {HStack} from '../../HStack/HStack.js';
import {IconButton} from '../IconButton.js';

export function IconButtonLoadingToggle() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleClick(id: string) {
    setLoadingId(id);
    setTimeout(() => setLoadingId(null), 1500);
  }

  return (
    <HStack gap={2}>
      <IconButton
        label="Copy"
        icon="copy"
        variant="primary"
        isLoading={loadingId === 'copy'}
        onClick={() => handleClick('copy')}
      />
      <IconButton
        label="Search"
        icon="search"
        isLoading={loadingId === 'search'}
        onClick={() => handleClick('search')}
      />
      <IconButton
        label="Close"
        icon="close"
        variant="tertiary"
        isLoading={loadingId === 'close'}
        onClick={() => handleClick('close')}
      />
    </HStack>
  );
}
