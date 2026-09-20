import {useState} from 'react';
import {TextArea} from '../TextArea.js';

export function TextAreaShowcase() {
  const [value, setValue] = useState('');
  return (
    <div style={{width: 400}}>
      <TextArea
        label="Description"
        value={value}
        onChange={setValue}
        placeholder="Enter a description..."
      />
    </div>
  );
}
