import {MoreMenu} from '../MoreMenu.js';

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
            {label: 'Edit', icon: 'edit-square', onClick: () => {}},
            {
              label: 'Duplicate',
              icon: 'copy',
              onClick: () => {},
            },
          ],
        },
        {
          type: 'section',
          title: 'Danger zone',
          items: [{label: 'Delete', icon: 'delete', onClick: () => {}}],
        },
      ]}
    />
  );
}
