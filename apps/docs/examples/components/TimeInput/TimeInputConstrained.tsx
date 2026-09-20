'use client';

import {useState} from 'react';
import {TimeInput} from '@tecton/react/TimeInput';
import {Stack} from '@tecton/react/Layout';

export function TimeInputConstrained() {
  const [evening, setEvening] = useState(undefined);

  return (
    <Stack direction="vertical" gap={3}>
      <TimeInput
        label="Dinner reservation"
        min={'17:00' as never}
        max={'22:00' as never}
        description="Evening seating: 5 PM – 10 PM"
        placeholder="Select reservation time"
        value={evening as never}
        onChange={setEvening as never}
        hasClear
      />
    </Stack>
  );
}
