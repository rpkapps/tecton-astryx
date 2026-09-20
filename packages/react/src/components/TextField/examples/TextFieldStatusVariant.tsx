import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {TextField} from '../TextField.js';

export function TextFieldStatusVariant() {
  const [attached, setAttached] = useState('sarah@');
  const [detached, setDetached] = useState('sarah@');

  return (
    <div style={{width: 640}}>
      <Stack direction="horizontal" gap={5}>
        <Stack direction="vertical" gap={2}>
          <Text variant="smallStrong">attached (default)</Text>
          <TextField
            label="Email"
            value={attached}
            onChange={setAttached}
            placeholder="you@example.com"
            status={{
              type: 'error',
              message: 'Please enter a valid email address.',
            }}
          />
          <Text variant="small">
            Message overlaps directly below the input.
          </Text>
        </Stack>
        <Stack direction="vertical" gap={2}>
          <Text variant="smallStrong">detached</Text>
          <TextField
            label="Email"
            value={detached}
            onChange={setDetached}
            placeholder="you@example.com"
            status={{
              type: 'error',
              message: 'Please enter a valid email address.',
            }}
          />
          <Text variant="small">
            Message floats below as a separate element with spacing.
          </Text>
        </Stack>
      </Stack>
    </div>
  );
}
