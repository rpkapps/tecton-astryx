'use client';

import {MoreMenu} from '@tecton/react/MoreMenu';
import {CopyIcon, DeleteIcon, EditSquareIcon} from '@tecton/react/icons';

export function MoreMenuWithSections() {
  return (
    <MoreMenu
      variant="secondary"
      label="Document actions"
      items={[
        {
          type: 'section',
          title: 'Actions',
          items: [
            {label: 'Edit', icon: EditSquareIcon, onClick: () => {}},
            {
              label: 'Duplicate',
              icon: CopyIcon,
              onClick: () => {},
            },
          ],
        },
        {
          type: 'section',
          title: 'Danger zone',
          items: [{label: 'Delete', icon: DeleteIcon, onClick: () => {}}],
        },
      ]}
    />
  );
}
