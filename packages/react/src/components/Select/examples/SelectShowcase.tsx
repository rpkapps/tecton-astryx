import {useState} from 'react';
import {Select} from '../Select.js';

export function SelectShowcase() {
  const [value, setValue] = useState<string | undefined>();
  return (
    <Select
      label="Fruit"
      options={['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple']}
      placeholder="Select a fruit..."
      value={value}
      onChange={setValue}
    />
  );
}
