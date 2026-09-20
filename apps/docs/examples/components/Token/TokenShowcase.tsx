'use client';

import {Token} from '@tecton/react/Token';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {NumericIcon} from '@tecton/react/icons';

export function TokenShowcase() {
  return (
    <Stack direction="horizontal" gap={2} vAlign="center">
      <Token label="Default" />
      <Token label="Removable" color="blue" onRemove={() => {}} />
      <Token
        label="Design"
        color="purple"
        icon={<Icon icon={NumericIcon} size="sm" color="inherit" />}
      />
    </Stack>
  );
}
