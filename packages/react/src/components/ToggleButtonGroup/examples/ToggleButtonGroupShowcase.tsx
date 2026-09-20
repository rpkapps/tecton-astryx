import {useState} from 'react';
import {ToggleButtonGroup} from '../ToggleButtonGroup.js';
import {ToggleButtonGroupSegment} from '../../ToggleButtonGroupSegment/ToggleButtonGroupSegment.js';

export function ToggleButtonGroupShowcase() {
  const [value, setValue] = useState('grid');
  return (
    <ToggleButtonGroup value={value} onChange={setValue} label="View mode">
      <ToggleButtonGroupSegment value="grid" label="Grid" />
      <ToggleButtonGroupSegment value="list" label="List" />
      <ToggleButtonGroupSegment value="table" label="Table" />
    </ToggleButtonGroup>
  );
}
