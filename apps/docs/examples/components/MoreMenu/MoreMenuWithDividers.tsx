'use client';

import {MoreMenu} from '@tecton/react/MoreMenu';
import {CopyIcon, DeleteIcon, EditSquareIcon} from '@tecton/react/icons';

export function MoreMenuWithDividers() {
  return (
    <MoreMenu
      variant="secondary"
      items={[
        {label: 'Edit', icon: EditSquareIcon, onClick: () => {}},
        {label: 'Duplicate', icon: CopyIcon, onClick: () => {}},
        {type: 'divider'},
        {label: 'Delete', icon: DeleteIcon, onClick: () => {}},
      ]}
    />
  );
}
