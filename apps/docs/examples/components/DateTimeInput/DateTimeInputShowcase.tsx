'use client';

import {useState} from 'react';
import {DateTimeInput} from '@tecton/react/DateTimeInput';
import type {ISODateTimeString} from '@tecton/react/DateTimeInput';
import {Stack} from '@tecton/react/Layout';

export function DateTimeInputShowcase() {
  const [dateTime, setDateTime] = useState<ISODateTimeString | undefined>(
    undefined,
  );

  return (
    <Stack
      direction="vertical"
      width="100%"
      style={{minWidth: 240, maxWidth: 400}}
    >
      <DateTimeInput
        label="Meeting time"
        placeholder="Select a date"
        value={dateTime}
        onChange={setDateTime}
        hasClear
      />
    </Stack>
  );
}
