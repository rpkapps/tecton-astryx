import {useState} from 'react';
import {Radio} from '../Radio.js';
import {RadioGroup} from '../../RadioGroup/RadioGroup.js';

export function RadioShowcase() {
  const [value, setValue] = useState('standard');

  return (
    <RadioGroup label="Shipping method" value={value} onChange={setValue}>
      <Radio
        label="Standard"
        value="standard"
        description="5–7 business days"
      />
      <Radio label="Express" value="express" description="2–3 business days" />
      <Radio
        label="Overnight"
        value="overnight"
        description="Next business day"
      />
      <Radio
        label="Same day"
        value="sameday"
        description="Not available in your area"
        isDisabled
      />
    </RadioGroup>
  );
}
