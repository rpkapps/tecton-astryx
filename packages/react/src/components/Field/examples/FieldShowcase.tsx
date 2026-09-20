import {useState} from 'react';
import {Field} from '../Field.js';
import {Stack} from '../../Stack/Stack.js';
import {TextField} from '../../TextField/TextField.js';

export function FieldShowcase() {
  const [email, setEmail] = useState('');

  const status =
    email.length > 0 && !email.includes('@')
      ? {type: 'error' as const, message: 'Enter a valid email address.'}
      : undefined;

  return (
    <Stack direction="vertical" gap={3}>
      <Field
        label="Email"
        inputID="field-email"
        description="We will never share your email."
        isRequired
        status={status}
      >
        <TextField
          label="Email"
          isLabelHidden
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
      </Field>
    </Stack>
  );
}
