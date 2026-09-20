'use client';

import {useState} from 'react';
import {Calendar} from '@tecton/react/Calendar';
import type {ISODateString} from '@tecton/react/Calendar';

export function CalendarShowcase() {
  const [value, setValue] = useState<ISODateString | undefined>('2026-04-15');

  return <Calendar mode="single" value={value} onChange={setValue} />;
}
