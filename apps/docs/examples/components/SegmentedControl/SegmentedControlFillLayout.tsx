'use client';

import {useState} from 'react';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tecton/react/SegmentedControl';

export function SegmentedControlFillLayout() {
  const [value, setValue] = useState('weekly');
  return (
    <div style={{width: 400}}>
      <SegmentedControl
        value={value}
        onChange={setValue}
        label="Time range"
        layout="fill"
      >
        <SegmentedControlItem value="daily" label="Daily" />
        <SegmentedControlItem value="weekly" label="Weekly" />
        <SegmentedControlItem value="monthly" label="Monthly" />
      </SegmentedControl>
    </div>
  );
}
