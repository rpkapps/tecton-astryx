import {MoreMenu} from '../MoreMenu.js';

export function MoreMenuWithDividers() {
  return (
    <MoreMenu
      variant="secondary"
      items={[
        {label: 'Edit', icon: 'edit-square', onClick: () => {}},
        {label: 'Duplicate', icon: 'copy', onClick: () => {}},
        {type: 'divider'},
        {label: 'Delete', icon: 'delete', onClick: () => {}},
      ]}
    />
  );
}
