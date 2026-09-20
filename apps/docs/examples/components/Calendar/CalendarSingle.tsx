'use client';

import {useState} from 'react';
import {Calendar, type ISODateString} from '@tecton/react/Calendar';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function CalendarSingle() {
  const [value, setValue] = useState<ISODateString>('2026-01-15');

  return (
    <Stack direction="vertical" gap={4} hAlign="center">
      <Text type="supporting" color="secondary">
        {value ? `Selected: ${value}` : 'Pick a date'}
      </Text>
      <Calendar
        mode="single"
        value={value}
        onChange={val => setValue(val)}
        focusDate="2026-01-01"
      />
    </Stack>
  );
}
