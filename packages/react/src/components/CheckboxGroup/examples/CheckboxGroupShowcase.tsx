import {useState} from 'react';
import {Checkbox} from '../../Checkbox/Checkbox.js';
import {CheckboxGroup} from '../CheckboxGroup.js';

export function CheckboxGroupShowcase() {
  const [value, setValue] = useState<string[]>(['email']);
  return (
    <CheckboxGroup
      label="Notification preferences"
      description="Choose how you would like to be notified"
      value={value}
      onChange={setValue}
      hasDividers
    >
      <Checkbox
        label="Email"
        value="email"
        description="Weekly digest every Monday"
      />
      <Checkbox
        label="Push notification"
        value="push"
        description="Instant alerts on your device"
      />
      <Checkbox
        label="SMS"
        value="sms"
        description="Standard messaging rates apply"
      />
    </CheckboxGroup>
  );
}
