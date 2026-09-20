import {useState} from 'react';
import {TextField} from '../TextField.js';

export function TextFieldBasic() {
  const [name, setName] = useState('');

  return (
    <TextField
      label="Horizon name"
      value={name}
      onChange={setName}
      placeholder="Type here"
      description="Shown wherever the horizon is listed."
      width={240}
    />
  );
}
