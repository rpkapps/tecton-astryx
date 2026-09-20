import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {TextField} from '../TextField.js';

export function TextFieldStates() {
  const [error, setError] = useState('sarah@');
  const [warning, setWarning] = useState('sarah_chen');
  const [success, setSuccess] = useState('https://sarahchen.dev');
  const [errorOnly, setErrorOnly] = useState('test');

  return (
    <div style={{width: 300}}>
      <Stack direction="vertical" gap={3}>
        <TextField
          label="Error message"
          value={error}
          onChange={setError}
          placeholder="Enter a value"
          status={{
            type: 'error',
            message: 'Please enter a valid email address.',
          }}
        />
        <TextField
          label="Warning message"
          value={warning}
          onChange={setWarning}
          placeholder="Enter a value"
          status={{
            type: 'warning',
            message: 'This username is already taken — try adding a number.',
          }}
        />
        <TextField
          label="Success message"
          value={success}
          onChange={setSuccess}
          placeholder="Enter a value"
          status={{type: 'success', message: 'URL is valid and reachable.'}}
        />
        <TextField
          label="Status without message"
          value={errorOnly}
          onChange={setErrorOnly}
          placeholder="Enter a value"
          status={{type: 'error'}}
        />
        <TextField
          label="Disabled field"
          value=""
          onChange={() => {}}
          placeholder="Enter a value"
          isDisabled
        />
        <TextField label="Loading field" value="sarahc" onChange={() => {}} />
      </Stack>
    </div>
  );
}
