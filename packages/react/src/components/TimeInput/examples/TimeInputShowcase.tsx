import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {TimeInput} from '../TimeInput.js';
import type {IsoTimeString as ISOTimeString} from '../../../support/index.js';

export function TimeInputShowcase() {
  const [time, setTime] = useState<ISOTimeString | undefined>(undefined);
  return (
    <Stack direction="vertical" width="100%">
      <TimeInput
        label="Time"
        placeholder="Select a time"
        value={time}
        onChange={setTime}
      />
    </Stack>
  );
}
