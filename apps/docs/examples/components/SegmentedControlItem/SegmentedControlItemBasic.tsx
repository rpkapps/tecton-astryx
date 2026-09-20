'use client';

import {useState} from 'react';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tecton/react/SegmentedControl';

export function SegmentedControlItemBasic() {
  const [view, setView] = useState('board');

  return (
    <SegmentedControl value={view} onChange={setView} label="View mode">
      <SegmentedControlItem value="board" label="Board" />
      <SegmentedControlItem value="list" label="List" />
      <SegmentedControlItem value="timeline" label="Timeline" />
    </SegmentedControl>
  );
}
