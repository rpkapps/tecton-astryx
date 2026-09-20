'use client';

import {useState} from 'react';
import {Switch} from '@tecton/react/Switch';

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
