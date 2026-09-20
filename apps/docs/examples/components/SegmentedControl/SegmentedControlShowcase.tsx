'use client';

import {useState} from 'react';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tecton/react/SegmentedControl';

export function SegmentedControlShowcase() {
  const [value, setValue] = useState('grid');
  return (
    <SegmentedControl value={value} onChange={setValue} label="View mode">
      <SegmentedControlItem value="grid" label="Grid" />
      <SegmentedControlItem value="list" label="List" />
      <SegmentedControlItem value="table" label="Table" />
    </SegmentedControl>
  );
}
