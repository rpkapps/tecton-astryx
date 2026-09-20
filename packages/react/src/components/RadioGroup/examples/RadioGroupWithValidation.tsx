import {useState} from 'react';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../RadioGroup.js';

export function RadioGroupWithValidation() {
  const [value, setValue] = useState('');

  return (
    <RadioGroup
      label="Notification preference"
      isRequired
      status={
        value === ''
          ? {type: 'error', message: 'Please select a notification method'}
          : undefined
      }
      value={value}
      onChange={setValue}
    >
      <Radio label="Email" value="email" />
      <Radio label="SMS" value="sms" />
      <Radio label="Push notification" value="push" />
    </RadioGroup>
  );
}
