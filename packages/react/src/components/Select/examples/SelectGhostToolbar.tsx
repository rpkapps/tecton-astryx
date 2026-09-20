import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {Select} from '../Select.js';

export function SelectGhostToolbar() {
  const [view, setView] = useState<string | undefined>('week');
  const [density, setDensity] = useState<string | undefined>('comfortable');

  return (
    <HStack align="center" gap={2}>
      <Button label="Today" variant="tertiary" />
      <Select
        label="Calendar view"
        isLabelHidden
        options={[
          {value: 'day', label: 'Day'},
          {value: 'week', label: 'Week'},
          {value: 'month', label: 'Month'},
        ]}
        value={view}
        onChange={setView}
      />
      <Select
        label="Density"
        isLabelHidden
        options={[
          {value: 'compact', label: 'Compact'},
          {value: 'comfortable', label: 'Comfortable'},
          {value: 'spacious', label: 'Spacious'},
        ]}
        value={density}
        onChange={setDensity}
        status={{type: 'warning', message: 'This setting affects all users'}}
      />
      <Button label="Export" variant="tertiary" />
    </HStack>
  );
}
