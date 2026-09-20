import {useState} from 'react';
import {Switch} from '../Switch.js';

export function SwitchShowcase() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Switch
      label="Enable notifications"
      value={enabled}
      onChange={setEnabled}
    />
  );
}
