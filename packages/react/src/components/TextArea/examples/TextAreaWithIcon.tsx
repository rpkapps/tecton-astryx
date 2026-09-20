import {useState} from 'react';
import {TextArea} from '../TextArea.js';

export function TextAreaWithIcon() {
  const [value, setValue] = useState('');

  return (
    <div style={{width: 400}}>
      <TextArea
        label="Meeting notes"
        description="Capture key decisions and action items."
        value={value}
        onChange={setValue}
        placeholder="What was discussed?"
        startIcon={'edit-square'}
      />
    </div>
  );
}
