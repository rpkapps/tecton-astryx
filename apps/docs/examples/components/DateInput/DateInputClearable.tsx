'use client';

import {useState} from 'react';
import {DateInput} from '@tecton/react/DateInput';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function DateInputClearable() {
  const [value, setValue] = useState<DateString | undefined>(
    '2026-04-06' as DateString,
  );

  return (
    <Stack
      direction="vertical"
      gap={4}
      width="100%"
      style={{minWidth: 240, maxWidth: 400}}
    >
      <Text type="supporting" color="secondary">
        {value ? `Selected: ${value}` : 'No date selected'}
      </Text>
      <DateInput
        label="Event date"
        description="Pick a date for your event"
        placeholder="Select a date"
        value={value}
        onChange={setValue}
        hasClear
      />
    </Stack>
  );
}
