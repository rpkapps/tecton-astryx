import {useState} from 'react';
import {TextField} from '../TextField.js';

export function TextFieldValidation() {
  const [depth, setDepth] = useState('abc');
  const isValid = /^\d*$/.test(depth);

  return (
    <TextField
      label="Top depth (m TVDSS)"
      value={depth}
      onChange={setDepth}
      status={
        isValid
          ? undefined
          : {type: 'error', message: 'Depth has to be a number.'}
      }
      width={240}
    />
  );
}
