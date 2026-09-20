import {useState} from 'react';
import {Center} from '../../Center/Center.js';
import {Icon} from '../../Icon/Icon.js';
import {ToggleButtonGroup} from '../../ToggleButtonGroup/ToggleButtonGroup.js';
import {ToggleButtonGroupSegment} from '../ToggleButtonGroupSegment.js';

export function ToggleButtonGroupSegmentShowcase() {
  const [view, setView] = useState('board');

  return (
    <Center>
      <ToggleButtonGroup value={view} onChange={setView} label="View mode">
        <ToggleButtonGroupSegment
          value="board"
          label="Board"
          icon={<Icon name="diamond-mark" />}
        />
        <ToggleButtonGroupSegment
          value="list"
          label="List"
          icon={<Icon name="menu" />}
        />
        <ToggleButtonGroupSegment
          value="timeline"
          label="Timeline"
          icon={<Icon name="diamond-mark" />}
        />
        <ToggleButtonGroupSegment
          value="chart"
          label="Chart"
          icon={<Icon name="diamond-mark" />}
          isDisabled
        />
      </ToggleButtonGroup>
    </Center>
  );
}
