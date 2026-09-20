'use client';

import {NavIcon} from '@tecton/react/NavIcon';
import {Icon} from '@tecton/react/Icon';
import {HStack} from '@tecton/react/Layout';

export function NavIconShowcase() {
  return (
    <HStack gap={4} vAlign="center">
      <NavIcon icon={<Icon icon="search" />} />
      <NavIcon icon={<Icon icon="calendar" />} />
      <NavIcon icon={<Icon icon="wrench" />} />
    </HStack>
  );
}
