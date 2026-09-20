import {useState} from 'react';
import {DateInput} from '../DateInput.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function DateInputClearable() {
  const [value, setValue] = useState<DateString | undefined>(
    '2026-04-06' as DateString,
  );

  return (
    <Stack direction="vertical" gap={4} width="100%">
      <Text variant="small" color="secondary">
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
