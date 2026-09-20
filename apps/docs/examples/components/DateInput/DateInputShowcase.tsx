'use client';

import {useState} from 'react';
import {DateInput} from '@tecton/react/DateInput';
import {Stack} from '@tecton/react/Layout';

type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function DateInputShowcase() {
  const [date, setDate] = useState<DateString | undefined>(undefined);

  return (
    <Stack
      direction="vertical"
      width="100%"
      style={{minWidth: 240, maxWidth: 400}}
    >
      <DateInput
        label="Start date"
        placeholder="Select a date"
        value={date}
        onChange={setDate}
        hasClear
      />
    </Stack>
  );
}
