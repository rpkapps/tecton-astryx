'use client';

import {useState} from 'react';
import {Switch} from '@tecton/react/Switch';

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
