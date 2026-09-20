import {useState} from 'react';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../RadioGroup.js';

export function RadioGroupHorizontalLayout() {
  const [value, setValue] = useState('md');

  return (
    <RadioGroup
      label="Size"
      orientation="horizontal"
      value={value}
      onChange={setValue}
    >
      <Radio label="Small" value="sm" />
      <Radio label="Medium" value="md" />
      <Radio label="Large" value="lg" />
    </RadioGroup>
  );
}
