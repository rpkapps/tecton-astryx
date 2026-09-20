import {useState} from 'react';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../RadioGroup.js';

export function RadioGroupWithDescriptions() {
  const [value, setValue] = useState('');

  return (
    <RadioGroup
      label="Notification preference"
      description="Choose how you would like to be notified"
      value={value}
      onChange={setValue}
    >
      <Radio
        label="Email"
        value="email"
        description="Receive notifications via email"
      />
      <Radio
        label="SMS"
        value="sms"
        description="Standard messaging rates apply"
      />
      <Radio
        label="Push notification"
        value="push"
        description="Instant alerts on your device"
      />
    </RadioGroup>
  );
}
