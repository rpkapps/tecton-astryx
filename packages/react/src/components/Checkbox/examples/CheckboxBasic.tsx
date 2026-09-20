import {useState} from 'react';
import {Checkbox} from '../Checkbox.js';

export function CheckboxBasic() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Checkbox
      label="Include uncertainty range"
      description="Draws the P10–P90 band on every curve."
      value={isChecked}
      onChange={setIsChecked}
    />
  );
}
