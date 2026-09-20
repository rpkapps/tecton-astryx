import {useState} from 'react';
import {Checkbox} from '../../Checkbox/Checkbox.js';
import {CheckboxGroup} from '../../CheckboxGroup/CheckboxGroup.js';
import {FormLayout} from '../FormLayout.js';
import {Select} from '../../Select/Select.js';
import {TextField} from '../../TextField/TextField.js';

export function FormLayoutMixedControls() {
  const [name, setName] = useState('Maya Torres');
  const [role, setRole] = useState('editor');
  const [notifications, setNotifications] = useState(['email', 'push']);

  return (
    <FormLayout>
      <TextField label="Full Name" value={name} onChange={setName} />
      <Select
        label="Role"
        value={role}
        onChange={v => setRole(v as string)}
        options={[
          {label: 'Viewer', value: 'viewer'},
          {label: 'Editor', value: 'editor'},
          {label: 'Admin', value: 'admin'},
        ]}
      />
      <CheckboxGroup
        label="Notifications"
        value={notifications}
        onChange={setNotifications}
      >
        <Checkbox label="Email" value="email" />
        <Checkbox label="SMS" value="sms" />
        <Checkbox label="Push" value="push" />
      </CheckboxGroup>
    </FormLayout>
  );
}
