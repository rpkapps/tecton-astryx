import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {TimeInput} from '../TimeInput.js';

export function TimeInputFormats() {
  const [time24h, setTime24h] = useState('14:30');
  const [timeSec, setTimeSec] = useState('14:30:45');

  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Format variations for different contexts
      </Text>
      <Stack direction="vertical" gap={3}>
        <TimeInput
          label="24-hour"
          value={time24h as never}
          onChange={setTime24h as never}
          hourFormat="24h"
        />
        <TimeInput
          label="With seconds"
          value={timeSec as never}
          onChange={setTimeSec as never}
          hasSeconds
        />
      </Stack>
    </Stack>
  );
}
