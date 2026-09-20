import {useState} from 'react';
import {Select} from '../../Select/Select.js';

const roles = [
  {value: 'admin', label: 'Admin'},
  {value: 'editor', label: 'Editor'},
  {value: 'viewer', label: 'Viewer'},
];

export function SelectChoiceBasic() {
  const [value, setValue] = useState<string | undefined>('editor');

  return (
    <Select
      label="Role"
      options={roles}
      value={value}
      onChange={setValue}
      placeholder="Assign a role..."
    />
  );
}
