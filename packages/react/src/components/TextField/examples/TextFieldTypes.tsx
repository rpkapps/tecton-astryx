import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {TextField} from '../TextField.js';

export function TextFieldTypes() {
  const [password, setPassword] = useState('hunter42');
  const [email, setEmail] = useState('sarah@example.com');
  const [tooltip, setTooltip] = useState('');
  const [required, setRequired] = useState('');
  const [optional, setOptional] = useState('');
  const [described, setDescribed] = useState('');

  return (
    <div style={{width: 300}}>
      <Stack direction="vertical" gap={3}>
        <TextField
          label="Default field"
          value={described}
          onChange={setDescribed}
          placeholder="Enter your email"
          description="Descriptions can be used to provide additional information about a field."
        />
        <TextField
          type="password"
          label="Password field"
          value={password}
          onChange={setPassword}
          placeholder="Enter a value"
        />
        <TextField
          type="email"
          label="Email field"
          value={email}
          onChange={setEmail}
          placeholder="Enter a value"
        />
        <TextField
          label="Field tooltip"
          value={tooltip}
          onChange={setTooltip}
          placeholder="Enter your API key"
          labelTooltip="Your unique API key for authentication. Keep this secret!"
        />
        <TextField
          label="Required field"
          value={required}
          onChange={setRequired}
          placeholder="Enter your username"
          isRequired
        />
        <TextField
          label="Optional field"
          value={optional}
          onChange={setOptional}
          placeholder="Enter your nickname"
          isOptional
        />
      </Stack>
    </div>
  );
}
