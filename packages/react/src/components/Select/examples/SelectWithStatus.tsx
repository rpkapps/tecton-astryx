import {useState} from 'react';
import {Select} from '../Select.js';
import {VStack} from '../../VStack/VStack.js';

export function SelectWithStatus() {
  const [value1, setValue1] = useState<string | undefined>();
  const [value2, setValue2] = useState<string | undefined>('viewer');
  const [value3, setValue3] = useState<string | undefined>('admin');
  return (
    <div style={{width: 300}}>
      <VStack gap={6}>
        <Select
          label="Role"
          options={[
            {value: 'admin', label: 'Admin'},
            {value: 'editor', label: 'Editor'},
            {value: 'viewer', label: 'Viewer'},
          ]}
          value={value1}
          onChange={setValue1}
          placeholder="Choose a role..."
          status={{type: 'error', message: 'Please select a role'}}
        />
        <Select
          label="Role"
          options={[
            {value: 'admin', label: 'Admin'},
            {value: 'editor', label: 'Editor'},
            {value: 'viewer', label: 'Viewer'},
          ]}
          value={value2}
          onChange={setValue2}
          status={{type: 'warning', message: 'Viewer has limited access'}}
        />
        <Select
          label="Role"
          options={[
            {value: 'admin', label: 'Admin'},
            {value: 'editor', label: 'Editor'},
            {value: 'viewer', label: 'Viewer'},
          ]}
          value={value3}
          onChange={setValue3}
          status={{type: 'success'}}
        />
      </VStack>
    </div>
  );
}
