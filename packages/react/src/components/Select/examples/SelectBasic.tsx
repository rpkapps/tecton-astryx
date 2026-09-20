import {useState} from 'react';
import {Select} from '../Select.js';

export function SelectBasic() {
  const [model, setModel] = useState('facies-01');

  return (
    <Select
      label="Model name"
      value={model}
      onChange={setModel}
      width={240}
      options={[
        {value: 'facies-01', label: 'Facies Model 01'},
        {value: 'facies-02', label: 'Facies Model 02'},
        {value: 'facies-03', label: 'Facies Model 03', isDisabled: true},
      ]}
    />
  );
}
