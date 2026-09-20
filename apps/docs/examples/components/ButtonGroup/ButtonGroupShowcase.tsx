'use client';

import {ButtonGroup} from '@tecton/react/ButtonGroup';
import {Button} from '@tecton/react/Button';
import {IconButton} from '@tecton/react/IconButton';
import {Stack} from '@tecton/react/Layout';
import {Icon} from '@tecton/react/Icon';
import {ChevronDownIcon, CopyIcon, DesignIcon} from '@tecton/react/icons';

export function ButtonGroupShowcase() {
  return (
    <Stack direction="horizontal" gap={6} vAlign="center">
      <ButtonGroup label="Clipboard actions">
        <Button label="Copy" icon={<Icon icon={CopyIcon} />} />
        <Button label="Cut" icon={<Icon icon={DesignIcon} />} />
        <Button label="Paste" icon={<Icon icon={CopyIcon} />} />
      </ButtonGroup>
      <ButtonGroup label="Save options">
        <Button label="Save" variant="primary" />
        <IconButton
          label="Save options"
          variant="primary"
          icon={<Icon icon={ChevronDownIcon} />}
        />
      </ButtonGroup>
    </Stack>
  );
}
