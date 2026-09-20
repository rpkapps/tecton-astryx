import {useState} from 'react';
import {DateRangeInput} from '../DateRangeInput.js';
import {Stack} from '../../Stack/Stack.js';
import type {
  DateRange,
  IsoDateString as ISODateString,
} from '../../../support/index.js';

function daysAgo(n: number): ISODateString {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10) as ISODateString;
}

function today(): ISODateString {
  return new Date().toISOString().slice(0, 10) as ISODateString;
}

const presets = [
  {label: 'Last 7 days', getRange: () => ({start: daysAgo(7), end: today()})},
  {label: 'Last 30 days', getRange: () => ({start: daysAgo(30), end: today()})},
];

export function DateRangeInputShowcase() {
  const [range, setRange] = useState<DateRange | null>(null);

  return (
    <Stack direction="vertical" width="100%">
      <DateRangeInput
        label="Date range"
        value={range}
        onChange={setRange}
        presets={presets}
      />
    </Stack>
  );
}
