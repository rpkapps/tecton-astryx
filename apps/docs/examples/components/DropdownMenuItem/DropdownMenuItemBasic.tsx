'use client';

import {DropdownMenu, DropdownMenuItem} from '@tecton/react/DropdownMenu';

export function DropdownMenuItemBasic() {
  return (
    <DropdownMenu button={{label: 'Actions'}}>
      <DropdownMenuItem
        label="Edit"
        description="Modify this item"
        onClick={() => {}}
      />
      <DropdownMenuItem
        label="Duplicate"
        description="Create a copy"
        onClick={() => {}}
      />
      <DropdownMenuItem
        label="Delete"
        description="This action cannot be undone"
        onClick={() => {}}
      />
    </DropdownMenu>
  );
}
