import {HStack} from '../../HStack/HStack.js';
import {IconButton} from '../IconButton.js';

export function IconButtonTooltipIconButton() {
  return (
    <HStack gap={2}>
      <IconButton
        label="Search"
        icon="search"
        variant="tertiary"
        tooltip="Search items"
      />
      <IconButton
        label="Copy link"
        icon="copy"
        variant="tertiary"
        tooltip="Copy to clipboard"
      />
      <IconButton
        label="More options"
        icon="diamond-mark"
        variant="tertiary"
        tooltip="More options"
      />
    </HStack>
  );
}
