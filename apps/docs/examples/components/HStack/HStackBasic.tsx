'use client';

import {HStack} from '@tecton/react/Layout';
import {Badge} from '@tecton/react/Badge';

export function HStackBasic() {
  return (
    <HStack gap={2} vAlign="center">
      <Badge label="React" />
      <Badge label="TypeScript" />
      <Badge label="Node.js" />
    </HStack>
  );
}
