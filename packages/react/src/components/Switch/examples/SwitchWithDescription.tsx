import {useState} from 'react';
import {Switch} from '../Switch.js';

export function SwitchWithDescription() {
  const [value, setValue] = useState(false);
  return (
    <Switch
      label="Dark mode"
      description="Switch to a darker color scheme."
      value={value}
      onChange={setValue}
    />
  );
}
