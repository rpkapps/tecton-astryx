import {useState} from 'react';
import {Calendar} from '../Calendar.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import type {DateRange} from '../../../support/index.js';

export function CalendarRangeWithValue() {
  const [value, setValue] = useState<DateRange>({
    start: '2026-01-10',
    end: '2026-01-20',
  });

  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        {value.start && value.end
          ? `${value.start} → ${value.end}`
          : 'Pick a start and end date'}
      </Text>
      <Calendar
        mode="range"
        value={value}
        onChange={range => setValue(range)}
        focusDate="2026-01-01"
      />
    </Stack>
  );
}
