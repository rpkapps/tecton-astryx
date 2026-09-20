import {useState} from 'react';
import {Calendar} from '../Calendar.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import type {IsoDateString as ISODateString} from '../../../support/index.js';

const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

export function CalendarConstraints() {
  const [value, setValue] = useState<ISODateString | undefined>(undefined);

  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Jan 10 – Mar 20, weekdays only
      </Text>
      <Calendar
        mode="single"
        min={'2026-01-10' as ISODateString}
        max={'2026-03-20' as ISODateString}
        dateConstraints={[isWeekday]}
        value={value}
        onChange={val => setValue(val)}
        focusDate={'2026-01-01' as ISODateString}
      />
    </Stack>
  );
}
