'use client';

import {useState} from 'react';
import {MultiSelector} from '@tecton/react/MultiSelector';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Brazil',
  'India',
  'Mexico',
];

export function MultiSelectorSearchableMultiSelector() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div style={{width: 300}}>
      <MultiSelector
        label="Countries"
        options={countries}
        value={value}
        onChange={setValue}
        hasSearch
        hasSelectAll
        placeholder="Select countries..."
      />
    </div>
  );
}
