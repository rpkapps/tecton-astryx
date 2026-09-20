import {useState} from 'react';
import {Switch} from '../Switch.js';

export function SwitchBasic() {
  const [isOn, setIsOn] = useState(true);

  return <Switch label="Show line guides" value={isOn} onChange={setIsOn} />;
}
