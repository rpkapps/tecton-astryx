'use client';

import {IconButton} from '@tecton/react/IconButton';
import {Icon} from '@tecton/react/Icon';

export function IconButtonShowcase() {
  return (
    <IconButton
      label="Settings"
      icon={<Icon icon="wrench" color="inherit" />}
    />
  );
}
