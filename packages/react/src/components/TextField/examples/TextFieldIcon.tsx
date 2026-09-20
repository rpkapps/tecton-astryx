import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {TextField} from '../TextField.js';

export function TextFieldIcon() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{width: 300}}>
      <Stack direction="vertical" gap={3}>
        <TextField
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Sarah Chen"
          startIcon={'person'}
        />
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="sarah@company.com"
          startIcon={'reports-analytics'}
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          startIcon={'lock'}
        />
      </Stack>
    </div>
  );
}
