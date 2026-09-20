import {useState} from 'react';
import {DateTimeInput} from '../DateTimeInput.js';
import {Stack} from '../../Stack/Stack.js';
import type {IsoDateTimeString as ISODateTimeString} from '../../../support/index.js';

export function DateTimeInputWithValidation() {
  const [errorVal, setErrorVal] = useState<ISODateTimeString | undefined>(
    '2026-01-25T09:00' as ISODateTimeString,
  );
  const [warningVal, setWarningVal] = useState<ISODateTimeString | undefined>(
    '2026-12-25T14:00' as ISODateTimeString,
  );
  const [successVal, setSuccessVal] = useState<ISODateTimeString | undefined>(
    '2026-03-10T10:30' as ISODateTimeString,
  );

  return (
    <Stack direction="vertical" gap={4}>
      <DateTimeInput
        label="Meeting time"
        value={errorVal}
        onChange={setErrorVal}
        status={{type: 'error', message: 'This time slot is already booked'}}
      />
      <DateTimeInput
        label="Preferred time"
        value={warningVal}
        onChange={setWarningVal}
        status={{type: 'warning', message: 'This falls outside business hours'}}
      />
      <DateTimeInput
        label="Start time"
        value={successVal}
        onChange={setSuccessVal}
        status={{type: 'success', message: 'Time confirmed'}}
      />
    </Stack>
  );
}
