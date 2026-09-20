import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../../Icon/Icon.js';
import {IconButton} from '../IconButton.js';

export function IconButtactionBar() {
  return (
    <HStack gap={1}>
      <IconButton
        label="Search"
        icon={<Icon name="search" />}
        variant="tertiary"
      />
      <IconButton label="Copy" icon={<Icon name="copy" />} variant="tertiary" />
      <IconButton label="Info" icon={<Icon name="info" />} variant="tertiary" />
      <IconButton label="Menu" icon={<Icon name="menu" />} variant="tertiary" />
      <IconButton
        label="Close"
        icon={<Icon name="close" />}
        variant="tertiary"
      />
    </HStack>
  );
}
