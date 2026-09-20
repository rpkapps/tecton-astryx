import {Menu} from '../Menu.js';

export function MenuShowcase() {
  return (
    <Menu
      button={{label: 'Actions'}}
      items={[
        {label: 'Edit', onClick: () => {}},
        {label: 'Duplicate', onClick: () => {}},
        {label: 'Delete', onClick: () => {}},
      ]}
    />
  );
}
