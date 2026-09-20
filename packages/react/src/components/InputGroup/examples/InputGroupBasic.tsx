import {useState} from 'react';
import {InputGroup} from '../InputGroup.js';
import {InputGroupText} from '../../InputGroupText/InputGroupText.js';
import {TextField} from '../../TextField/TextField.js';

export function InputGroupBasic() {
  const [price, setPrice] = useState('');

  return (
    <div style={{width: 320}}>
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <TextField
          label="Amount"
          isLabelHidden
          value={price}
          onChange={setPrice}
          placeholder="0.00"
        />
        <InputGroupText>USD</InputGroupText>
      </InputGroup>
    </div>
  );
}
