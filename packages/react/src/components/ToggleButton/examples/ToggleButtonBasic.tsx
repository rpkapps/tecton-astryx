import {useState} from 'react';
import {ToggleButton} from '../ToggleButton.js';

export function ToggleButtonBasic() {
  const [isShown, setIsShown] = useState(true);

  return (
    <ToggleButton
      label="Show wells"
      icon="visibility-off"
      pressedIcon="visibility"
      isPressed={isShown}
      onPressedChange={setIsShown}
    />
  );
}
