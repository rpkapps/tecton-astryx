'use client';

import {IconButton} from '@tecton/react/IconButton';
import {Icon} from '@tecton/react/Icon';
import {HStack} from '@tecton/react/Stack';

export function IconButtonTooltipIconButton() {
  return (
    <HStack gap={2}>
      <IconButton
        label="Search"
        icon={<Icon icon="search" color="inherit" />}
        variant="ghost"
        tooltip="Search items"
      />
      <IconButton
        label="Copy link"
        icon={<Icon icon="copy" color="inherit" />}
        variant="ghost"
        tooltip="Copy to clipboard"
      />
      <IconButton
        label="More options"
        icon={<Icon icon="moreHorizontal" color="inherit" />}
        variant="ghost"
        tooltip="More options"
      />
    </HStack>
  );
}
