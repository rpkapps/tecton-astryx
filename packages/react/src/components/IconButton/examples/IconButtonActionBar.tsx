import {HStack} from '../../HStack/HStack.js';
import {IconButton} from '../IconButton.js';

export function IconButtactionBar() {
  return (
    <HStack gap={1}>
      <IconButton label="Search" icon="search" variant="tertiary" />
      <IconButton label="Copy" icon="copy" variant="tertiary" />
      <IconButton label="Info" icon="info" variant="tertiary" />
      <IconButton label="Menu" icon="menu" variant="tertiary" />
      <IconButton label="Close" icon="close" variant="tertiary" />
    </HStack>
  );
}
