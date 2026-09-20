'use client';

import {useState} from 'react';
import {TextInput} from '@tecton/react/TextInput';
import {Stack} from '@tecton/react/Layout';
import {LockIcon, PersonIcon, ReportsAnalyticsIcon} from '@tecton/react/icons';

export function TextInputIcon() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{width: 300}}>
      <Stack direction="vertical" gap={3}>
        <TextInput
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Sarah Chen"
          startIcon={PersonIcon}
        />
        <TextInput
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="sarah@company.com"
          startIcon={ReportsAnalyticsIcon}
        />
        <TextInput
          type="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          startIcon={LockIcon}
        />
      </Stack>
    </div>
  );
}
