import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {TextField} from '../TextField.js';

export function TextFieldSizes() {
  const [sm, setSm] = useState('');
  const [md, setMd] = useState('');
  const [lg, setLg] = useState('');

  return (
    <div style={{width: 300}}>
      <Stack direction="vertical" gap={3}>
        <TextField
          label="Small"
          value={sm}
          onChange={setSm}
          placeholder="Enter a value"
          size="sm"
        />
        <TextField
          label="Medium"
          value={md}
          onChange={setMd}
          placeholder="Enter a value"
          size="md"
        />
        <TextField
          label="Large"
          value={lg}
          onChange={setLg}
          placeholder="Enter a value"
          size="md"
        />
      </Stack>
    </div>
  );
}
