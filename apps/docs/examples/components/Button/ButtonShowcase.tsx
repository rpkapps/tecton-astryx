'use client';

import {Button} from '@tecton/react/Button';
import {Stack} from '@tecton/react/Layout';

export function ButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3} vAlign="center">
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Destructive" variant="destructive" />
    </Stack>
  );
}
