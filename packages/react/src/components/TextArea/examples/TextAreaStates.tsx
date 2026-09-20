import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {TextArea} from '../TextArea.js';

export function TextAreaStates() {
  const [requiredValue, setRequiredValue] = useState('');

  return (
    <Stack direction="vertical" gap={4}>
      <TextArea
        label="Required field"
        value={requiredValue}
        onChange={setRequiredValue}
        placeholder="Describe the issue..."
        isRequired
      />
      <TextArea
        label="Disabled field"
        value="This field is disabled and cannot be edited."
        onChange={() => {}}
        isDisabled
      />
      <TextArea
        label="Loading field"
        value=""
        onChange={() => {}}
        placeholder="Generating summary..."
        isLoading
      />
    </Stack>
  );
}
