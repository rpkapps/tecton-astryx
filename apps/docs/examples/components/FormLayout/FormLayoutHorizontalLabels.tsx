'use client';

import {useState} from 'react';
import {FormLayout} from '@tecton/react/FormLayout';
import {TextInput} from '@tecton/react/TextInput';
import {Selector} from '@tecton/react/Selector';
import {TextArea} from '@tecton/react/TextArea';

export function FormLayoutHorizontalLabels() {
  const [displayName, setDisplayName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [bio, setBio] = useState('');

  return (
    <FormLayout direction="horizontal-labels">
      <TextInput
        label="Display Name"
        value={displayName}
        onChange={setDisplayName}
      />
      <TextInput label="Email" value={email} onChange={setEmail} />
      <Selector
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
