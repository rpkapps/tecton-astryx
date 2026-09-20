import {useState} from 'react';
import {Checkbox} from '../Checkbox.js';
import {Stack} from '../../Stack/Stack.js';

export function CheckboxStatusVariations() {
  const [error, setError] = useState<boolean | 'indeterminate'>(false);
  const [warning, setWarning] = useState<boolean | 'indeterminate'>(true);
  const [success, setSuccess] = useState<boolean | 'indeterminate'>(true);

  return (
    <Stack direction="vertical" gap={4}>
      <Checkbox
        label="Error"
        description="Required field that has not been accepted."
        value={error}
        onChange={setError}
        status={{
          type: 'error',
          message: 'You must accept the terms to continue',
        }}
      />
      <Checkbox
        label="Warning"
        description="Enabled setting with a side effect to be aware of."
        value={warning}
        onChange={setWarning}
        status={{
          type: 'warning',
          message: 'This data may be shared with partners',
        }}
      />
      <Checkbox
        label="Success"
        description="Confirmed setting that has been verified."
        value={success}
        onChange={setSuccess}
        status={{type: 'success', message: 'Your email has been verified'}}
      />
    </Stack>
  );
}
