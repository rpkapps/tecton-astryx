'use client';

import {DropdownMenu} from '@tecton/react/DropdownMenu';

export function DropdownMenuShowcase() {
  return (
    <DropdownMenu
      button={{label: 'Actions'}}
      items={[
        {label: 'Edit', onClick: () => {}},
        {label: 'Duplicate', onClick: () => {}},
        {label: 'Delete', onClick: () => {}},
      ]}
    />
  );
}
