'use client';

import {useState} from 'react';
import {Calendar, type DateRange} from '@tecton/react/Calendar';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function CalendarRangeWithValue() {
  const [value, setValue] = useState<DateRange>({
    start: '2026-01-10',
    end: '2026-01-20',
  });

  return (
    <Stack direction="vertical" gap={4} hAlign="center">
      <Text type="supporting" color="secondary">
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
