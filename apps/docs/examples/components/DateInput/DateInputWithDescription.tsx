'use client';

import {useState} from 'react';
import {DateInput} from '@tecton/react/DateInput';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function DateInputWithDescription() {
  const [value, setValue] = useState<DateString | undefined>(undefined);

  return (
    <Stack
      direction="vertical"
      gap={4}
      width="100%"
      style={{minWidth: 240, maxWidth: 400}}
    >
      <Text type="supporting" color="secondary">
        Helper text explains what the field expects
      </Text>
      <DateInput
        label="Start date"
        description="Your subscription begins on this date"
        placeholder="Select a start date"
        value={value}
        onChange={setValue}
      />
    </Stack>
  );
}
