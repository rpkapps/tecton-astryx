import {useState} from 'react';
import {ToggleButtonGroup} from '../ToggleButtonGroup.js';
import {ToggleButtonGroupSegment} from '../../ToggleButtonGroupSegment/ToggleButtonGroupSegment.js';

export function ToggleButtonGroupFillLayout() {
  const [value, setValue] = useState('weekly');
  return (
    <div style={{width: 400}}>
      <ToggleButtonGroup
        value={value}
        onChange={setValue}
        label="Time range"
        layout="fill"
      >
        <ToggleButtonGroupSegment value="daily" label="Daily" />
        <ToggleButtonGroupSegment value="weekly" label="Weekly" />
        <ToggleButtonGroupSegment value="monthly" label="Monthly" />
      </ToggleButtonGroup>
    </div>
  );
}
