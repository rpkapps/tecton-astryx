import {useState} from 'react';
import {InputGroup} from '../InputGroup.js';
import {InputGroupText} from '../../InputGroupText/InputGroupText.js';
import {Stack} from '../../Stack/Stack.js';
import {TextField} from '../../TextField/TextField.js';

export function InputGroupShowcase() {
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');

  return (
    <Stack direction="vertical" gap={4} width="100%">
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <TextField
          label="Amount"
          isLabelHidden
          value={price}
          onChange={setPrice}
          placeholder="0.00"
        />
      </InputGroup>
      <InputGroup label="Website">
        <InputGroupText>https://</InputGroupText>
        <TextField
          label="URL"
          isLabelHidden
          value={url}
          onChange={setUrl}
          placeholder="example"
        />
        <InputGroupText>.com</InputGroupText>
      </InputGroup>
    </Stack>
  );
}
