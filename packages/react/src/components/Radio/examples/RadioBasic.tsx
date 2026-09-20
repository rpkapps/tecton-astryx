import {useState} from 'react';
import {RadioGroup} from '../../RadioGroup/RadioGroup.js';
import {Radio} from '../Radio.js';

export function RadioBasic() {
  const [method, setMethod] = useState('sgs');

  return (
    <RadioGroup label="Method" value={method} onChange={setMethod}>
      <Radio
        value="sgs"
        label="Sequential Gaussian"
        description="Honours the variogram and the well data."
      />
      <Radio value="ti" label="Truncated indicator" />
    </RadioGroup>
  );
}
