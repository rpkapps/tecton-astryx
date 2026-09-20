import {useState} from 'react';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../RadioGroup.js';

export function RadioGroupBasic() {
  const [grid, setGrid] = useState('25');

  return (
    <RadioGroup label="Grid increment" value={grid} onChange={setGrid}>
      <Radio value="12" label="12.5 m" />
      <Radio value="25" label="25 m" />
      <Radio value="50" label="50 m" />
    </RadioGroup>
  );
}
