import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../../Icon/Icon.js';
import {IconButton} from '../IconButton.js';

export function IconButtonTooltipIconButton() {
  return (
    <HStack gap={2}>
      <IconButton
        label="Search"
        icon={<Icon name="search" />}
        variant="tertiary"
        tooltip="Search items"
      />
      <IconButton
        label="Copy link"
        icon={<Icon name="copy" />}
        variant="tertiary"
        tooltip="Copy to clipboard"
      />
      <IconButton
        label="More options"
        icon={<Icon name="diamond-mark" />}
        variant="tertiary"
        tooltip="More options"
      />
    </HStack>
  );
}
