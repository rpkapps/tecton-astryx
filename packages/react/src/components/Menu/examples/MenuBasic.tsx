import {Menu} from '../Menu.js';

export function MenuBasic() {
  return (
    <Menu
      label="Actions"
      items={[
        {label: 'Open', icon: 'open-in-new', shortcut: '⌘O'},
        {label: 'Rename', icon: 'edit-square'},
        {label: 'Export', icon: 'export-upload'},
        {type: 'divider'},
        {label: 'Delete', icon: 'delete', isDestructive: true},
      ]}
    />
  );
}
