import {useState} from 'react';
import {Calendar} from '../Calendar.js';
import type {IsoDateString as ISODateString} from '../../../support/index.js';

export function CalendarShowcase() {
  const [value, setValue] = useState<ISODateString | undefined>('2026-04-15');

  return <Calendar mode="single" value={value} onChange={setValue} />;
}
