'use client';

import {Divider} from '@tecton/react/Divider';
import {Stack} from '@tecton/react/Layout';

export function DividerShowcase() {
  return (
    <Stack direction="vertical" gap={4} style={{width: 500}}>
      <Divider variant="subtle" />
      <Divider variant="strong" />
      <Divider label="or" />
    </Stack>
  );
}
