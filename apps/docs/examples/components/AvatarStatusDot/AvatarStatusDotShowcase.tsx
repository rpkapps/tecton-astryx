'use client';

import {Avatar, AvatarStatusDot} from '@tecton/react/Avatar';
import {HStack} from '@tecton/react/Layout';

export function AvatarStatusDotShowcase() {
  return (
    <HStack gap={4} vAlign="center">
      <Avatar
        name="Online User"
        size="xl"
        status={<AvatarStatusDot variant="success" label="Online" />}
      />
      <Avatar
        name="Away User"
        size="xl"
        status={<AvatarStatusDot variant="neutral" label="Away" />}
      />
      <Avatar
        name="Busy User"
        size="xl"
        status={<AvatarStatusDot variant="error" label="Busy" />}
      />
    </HStack>
  );
}
