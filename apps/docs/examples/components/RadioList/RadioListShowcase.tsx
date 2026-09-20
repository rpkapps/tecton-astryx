'use client';

import {useState} from 'react';
import {RadioList, RadioListItem} from '@tecton/react/RadioList';

export function RadioListShowcase() {
  const [value, setValue] = useState('');
  return (
    <RadioList
      label="Notification preference"
      value={value}
      onChange={setValue}
    >
      <RadioListItem label="Email" value="email" />
      <RadioListItem label="SMS" value="sms" />
      <RadioListItem label="Push notification" value="push" />
    </RadioList>
  );
}
