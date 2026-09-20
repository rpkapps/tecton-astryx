import {useState} from 'react';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../RadioGroup.js';

export function RadioGroupShowcase() {
  const [value, setValue] = useState('');
  return (
    <RadioGroup
      label="Notification preference"
      value={value}
      onChange={setValue}
    >
      <Radio label="Email" value="email" />
      <Radio label="SMS" value="sms" />
      <Radio label="Push notification" value="push" />
    </RadioGroup>
  );
}
