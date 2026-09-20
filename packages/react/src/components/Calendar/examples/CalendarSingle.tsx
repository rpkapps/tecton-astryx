import {useState} from 'react';
import {Calendar} from '../Calendar.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import type {IsoDateString as ISODateString} from '../../../support/index.js';

export function CalendarSingle() {
  const [value, setValue] = useState<ISODateString>('2026-01-15');

  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
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
