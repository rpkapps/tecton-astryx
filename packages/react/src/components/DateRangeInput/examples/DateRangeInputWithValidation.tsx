import {useState} from 'react';
import {DateRangeInput} from '../DateRangeInput.js';
import {Stack} from '../../Stack/Stack.js';
import type {DateRange} from '../../../support/index.js';

export function DateRangeInputWithValidation() {
  const [errorRange, setErrorRange] = useState<DateRange | null>({
    start: '2026-01-01',
    end: '2026-01-31',
  });
  const [warningRange, setWarningRange] = useState<DateRange | null>({
    start: '2026-06-01',
    end: '2026-06-30',
  });
  const [successRange, setSuccessRange] = useState<DateRange | null>({
    start: '2026-03-01',
    end: '2026-03-31',
  });

  return (
    <Stack direction="vertical" gap={4} width="100%">
      <DateRangeInput
        label="Booking period"
        value={errorRange}
        onChange={setErrorRange}
        status={{
          type: 'error',
          message: 'Selected dates are no longer available',
        }}
      />
      <DateRangeInput
        label="Preferred period"
        value={warningRange}
        onChange={setWarningRange}
        status={{
          type: 'warning',
          message: 'High demand — limited availability',
        }}
      />
      <DateRangeInput
        label="Confirmed period"
        value={successRange}
        onChange={setSuccessRange}
        status={{type: 'success', message: 'Dates confirmed and available'}}
      />
    </Stack>
  );
}
