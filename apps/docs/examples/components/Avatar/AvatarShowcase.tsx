'use client';

import {Avatar, AvatarStatusDot} from '@tecton/react/Avatar';
import {Stack} from '@tecton/react/Layout';

export function AvatarShowcase() {
  return (
    <Stack direction="horizontal" gap={4} vAlign="center">
      <Avatar
        src="/template-assets/DATA-Ana-Thomas.png"
        name="Ana Thomas"
        size="xl"
        status={<AvatarStatusDot variant="success" label="Online" />}
      />
      <Avatar
        src="/template-assets/DATA-Drew-Young.png"
        name="Drew Young"
        size="xl"
      />
      <Avatar
        src="/template-assets/DATA-Jihoo-Song.png"
        name="Jihoo Song"
        size="xl"
      />
      <Avatar
        src="/template-assets/DATA-Nam-Tran.png"
        name="Nam Tran"
        size="xl"
        status={<AvatarStatusDot variant="error" label="Busy" />}
      />
    </Stack>
  );
}
