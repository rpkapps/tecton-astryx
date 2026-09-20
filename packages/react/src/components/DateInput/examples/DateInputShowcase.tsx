import {useState} from 'react';
import {DateInput} from '../DateInput.js';
import {Stack} from '../../Stack/Stack.js';

type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function DateInputShowcase() {
  const [date, setDate] = useState<DateString | undefined>(undefined);

  return (
    <Stack direction="vertical" width="100%">
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
