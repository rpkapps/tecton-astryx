import {useState} from 'react';
import {FormLayout} from '../FormLayout.js';
import {Select} from '../../Select/Select.js';
import {TextArea} from '../../TextArea/TextArea.js';
import {TextField} from '../../TextField/TextField.js';

export function FormLayoutHorizontalLabels() {
  const [displayName, setDisplayName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [bio, setBio] = useState('');

  return (
    <FormLayout direction="horizontal-labels">
      <TextField
        label="Display Name"
        value={displayName}
        onChange={setDisplayName}
      />
      <TextField label="Email" value={email} onChange={setEmail} />
      <Select
        label="Timezone"
        value={timezone}
        onChange={v => setTimezone(v as string)}
        options={[
          {label: 'Pacific Time', value: 'America/Los_Angeles'},
          {label: 'Eastern Time', value: 'America/New_York'},
          {label: 'UTC', value: 'UTC'},
        ]}
      />
      <TextArea label="Bio" value={bio} onChange={setBio} rows={3} />
    </FormLayout>
  );
}
