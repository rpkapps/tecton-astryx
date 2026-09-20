import {useState} from 'react';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../RadioGroup.js';
import {Text} from '../../Text/Text.js';

export function RadioGroupPricingTier() {
  const [value, setValue] = useState('');

  return (
    <RadioGroup label="Plan" value={value} onChange={setValue}>
      <Radio
        label="Free"
        value="free"
        endContent={
          <Text variant="medium" color="secondary">
            $0/mo
          </Text>
        }
      />
      <Radio
        label="Pro"
        value="pro"
        endContent={
          <Text variant="medium" color="secondary">
            $9/mo
          </Text>
        }
      />
      <Radio
        label="Enterprise"
        value="enterprise"
        endContent={
          <Text variant="medium" color="secondary">
            Custom
          </Text>
        }
      />
    </RadioGroup>
  );
}
