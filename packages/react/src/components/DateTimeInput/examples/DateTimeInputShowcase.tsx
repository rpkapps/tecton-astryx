import {useState} from 'react';
import {DateTimeInput} from '../DateTimeInput.js';
import {Stack} from '../../Stack/Stack.js';
import type {IsoDateTimeString as ISODateTimeString} from '../../../support/index.js';

export function DateTimeInputShowcase() {
  const [dateTime, setDateTime] = useState<ISODateTimeString | undefined>(
    undefined,
  );

  return (
    <Stack direction="vertical" width="100%">
      <DateTimeInput
        label="Meeting time"
        placeholder="Select a date"
        value={dateTime}
        onChange={setDateTime}
        hasClear
      />
    </Stack>
  );
}
