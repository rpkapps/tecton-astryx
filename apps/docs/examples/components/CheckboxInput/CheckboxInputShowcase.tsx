'use client';

import {useState} from 'react';
import {CheckboxInput} from '@tecton/react/CheckboxInput';
import {Stack} from '@tecton/react/Layout';

export function CheckboxInputShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <Stack direction="vertical" gap={2}>
      <CheckboxInput
        label="Checked"
        value={notifications}
        onChange={setNotifications}
      />
      <CheckboxInput
        label="Unchecked"
        value={marketing}
        onChange={setMarketing}
      />
    </Stack>
  );
}
