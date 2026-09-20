import {useState} from 'react';
import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../../Icon/Icon.js';
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
        icon={<Icon name="copy" />}
        variant="primary"
        isLoading={loadingId === 'copy'}
        onClick={() => handleClick('copy')}
      />
      <IconButton
        label="Search"
        icon={<Icon name="search" />}
        isLoading={loadingId === 'search'}
        onClick={() => handleClick('search')}
      />
      <IconButton
        label="Close"
        icon={<Icon name="close" />}
        variant="tertiary"
        isLoading={loadingId === 'close'}
        onClick={() => handleClick('close')}
      />
    </HStack>
  );
}
