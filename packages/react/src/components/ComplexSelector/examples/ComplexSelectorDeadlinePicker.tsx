import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {DateInput} from '../../DateInput/DateInput.js';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../../RadioGroup/RadioGroup.js';
import {TimeInput} from '../../TimeInput/TimeInput.js';
import {VStack} from '../../VStack/VStack.js';

type ISODate =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
type ISOTime = string & {readonly __brand: 'ISOTimeString'};

interface Deadline {
  preset: 'today' | 'next-week' | 'custom';
  date: ISODate;
  time: ISOTime;
}

const presetLabels: Record<Deadline['preset'], string> = {
  today: 'Today',
  'next-week': 'Next week',
  custom: 'Custom date',
};

function formatDeadline(value: Deadline) {
  if (value.preset === 'custom') {
    return `${value.date} at ${value.time}`;
  }
  return presetLabels[value.preset];
}

export function ComplexSelectorDeadlinePicker() {
  const [value, setValue] = useState<Deadline>({
    preset: 'today',
    date: '2026-04-06' as ISODate,
    time: '17:00' as ISOTime,
  });

  return (
    <ComplexSelector<Deadline>
      label="Deadline"
      description="Choose a preset or set a custom date and time."
      value={value}
      onChange={setValue}
      triggerLabel={formatDeadline(value)}
      style={{width: 320}}
    >
      {(selectedValue, onChange, close) => {
        const set = (patch: Partial<Deadline>) =>
          onChange({...selectedValue, ...patch});

        return (
          <VStack gap={4}>
            <RadioGroup
              label="When is it due?"
              value={selectedValue.preset}
              onChange={preset => set({preset: preset as Deadline['preset']})}
            >
              <Radio label="Today" value="today" />
              <Radio label="Next week" value="next-week" />
              <Radio label="Custom date" value="custom" />
            </RadioGroup>

            {selectedValue.preset === 'custom' && (
              <VStack gap={3}>
                <DateInput
                  label="Date"
                  value={selectedValue.date}
                  onChange={date => date && set({date})}
                />
                <TimeInput
                  label="Time"
                  value={selectedValue.time}
                  onChange={time => time && set({time})}
                />
              </VStack>
            )}

            <Button label="Apply" variant="primary" onClick={close} />
          </VStack>
        );
      }}
    </ComplexSelector>
  );
}
