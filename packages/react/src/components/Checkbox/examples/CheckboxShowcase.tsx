import {useState} from 'react';
import {Checkbox} from '../Checkbox.js';
import {CheckboxGroup} from '../../CheckboxGroup/CheckboxGroup.js';

export function CheckboxShowcase() {
  const [value, setValue] = useState<string[]>(['updates', 'security']);

  return (
    <CheckboxGroup
      label="Email preferences"
      value={value}
      onChange={setValue}
      hasDividers
    >
      <Checkbox
        label="Product updates"
        value="updates"
        description="New features and improvements"
      />
      <Checkbox
        label="Security alerts"
        value="security"
        description="Important account security notifications"
      />
      <Checkbox
        label="Marketing"
        value="marketing"
        description="Tips, offers, and promotions"
      />
      <Checkbox
        label="Beta program"
        value="beta"
        description="Currently closed to new members"
        isDisabled
      />
    </CheckboxGroup>
  );
}
