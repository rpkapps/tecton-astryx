import {useState} from 'react';
import {DateInput} from '../DateInput.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function DateInputWithDescription() {
  const [value, setValue] = useState<DateString | undefined>(undefined);

  return (
    <Stack direction="vertical" gap={4} width="100%">
      <Text variant="small" color="secondary">
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
