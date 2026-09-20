import {useState} from 'react';
import {ToggleButtonGroup} from '../ToggleButtonGroup.js';
import {ToggleButtonGroupSegment} from '../../ToggleButtonGroupSegment/ToggleButtonGroupSegment.js';

export function ToggleButtonGroupDisabledItem() {
  const [value, setValue] = useState('hourly');
  return (
    <ToggleButtonGroup
      value={value}
      onChange={setValue}
      label="Data granularity"
    >
      <ToggleButtonGroupSegment value="hourly" label="Hourly" />
      <ToggleButtonGroupSegment value="daily" label="Daily" />
      <ToggleButtonGroupSegment value="weekly" label="Weekly" isDisabled />
    </ToggleButtonGroup>
  );
}
