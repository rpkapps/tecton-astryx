import {useState} from 'react';
import {ToggleButtonGroup} from '../../ToggleButtonGroup/ToggleButtonGroup.js';
import {ToggleButtonGroupSegment} from '../ToggleButtonGroupSegment.js';

export function ToggleButtonGroupSegmentBasic() {
  const [view, setView] = useState('board');

  return (
    <ToggleButtonGroup value={view} onChange={setView} label="View mode">
      <ToggleButtonGroupSegment value="board" label="Board" />
      <ToggleButtonGroupSegment value="list" label="List" />
      <ToggleButtonGroupSegment value="timeline" label="Timeline" />
    </ToggleButtonGroup>
  );
}
