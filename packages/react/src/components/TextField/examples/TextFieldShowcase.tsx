import {useState} from 'react';
import {TextField} from '../TextField.js';

export function TextFieldShowcase() {
  const [value, setValue] = useState('');
  return (
    <div style={{width: 300}}>
      <TextField
        label="Name"
        value={value}
        onChange={setValue}
        placeholder="Enter your name"
      />
    </div>
  );
}
