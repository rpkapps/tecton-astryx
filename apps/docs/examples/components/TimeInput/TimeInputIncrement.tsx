'use client';

import {useState} from 'react';
import {TimeInput} from '@tecton/react/TimeInput';
import {Stack} from '@tecton/react/Layout';

export function TimeInputIncrement() {
  const [slot, setSlot] = useState('09:00');

  return (
    <Stack direction="vertical" gap={3}>
      <TimeInput
        label="Appointment slot"
        increment={15}
        description="Use arrow keys to change by 15 minutes"
        value={slot as never}
        onChange={setSlot as never}
        hasClear
      />
    </Stack>
  );
}
