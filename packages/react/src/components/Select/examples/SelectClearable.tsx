import {useState} from 'react';
import {Select} from '../Select.js';

export function SelectClearable() {
  const [value, setValue] = useState<string | null>('engineering');
  return (
    <Select
      label="Department"
      options={[
        {value: 'engineering', label: 'Engineering'},
        {value: 'design', label: 'Design'},
        {value: 'marketing', label: 'Marketing'},
        {value: 'sales', label: 'Sales'},
      ]}
      value={value}
      onChange={setValue}
      placeholder="Choose a department..."
      hasClear
    />
  );
}
