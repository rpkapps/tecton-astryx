import {useState} from 'react';
import {Switch} from '../Switch.js';

export function SwitchDisabled() {
  const [value, setValue] = useState(false);
  return (
    <Switch
      label="Premium feature"
      description="Upgrade to enable this option"
      value={value}
      onChange={setValue}
      isDisabled
    />
  );
}
