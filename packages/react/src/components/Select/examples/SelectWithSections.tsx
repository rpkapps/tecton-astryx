import {useState} from 'react';
import {Select} from '../Select.js';

export function SelectWithSections() {
  const [surface, setSurface] = useState('spekk');

  return (
    <Select
      label="Target surface"
      value={surface}
      onChange={setSurface}
      hasSearch
      width={240}
      options={[
        {
          type: 'section',
          title: 'Interpreted',
          options: [
            {value: 'spekk', label: 'Spekk fm top', icon: 'horizon'},
            {value: 'draupne', label: 'Draupne fm top', icon: 'horizon'},
          ],
        },
        {type: 'divider'},
        {
          type: 'section',
          title: 'Modelled',
          options: [{value: 'base-cret', label: 'Base Cretaceous'}],
        },
      ]}
    />
  );
}
