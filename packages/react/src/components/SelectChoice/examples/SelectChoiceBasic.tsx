import {useState} from 'react';
import {Select} from '../../Select/Select.js';
import {SelectChoice} from '../SelectChoice.js';

const descriptions: Record<string, string> = {
  admin: 'Full access to all resources',
  editor: 'Can edit and publish content',
  viewer: 'Read-only access',
};

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
      renderOption={option => (
        <SelectChoice
          label={option.label}
          description={descriptions[option.value]}
        />
      )}
    />
  );
}
