'use client';

import {Token} from '@tecton/react/Token';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {
  CrownIcon,
  LockIcon,
  NumericIcon,
  PersonIcon,
} from '@tecton/react/icons';

export function TokenIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Icons identify the token category
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Token
          label="Sarah Chen"
          color="blue"
          icon={<Icon icon={PersonIcon} size="sm" color="inherit" />}
        />
        <Token
          label="Featured"
          color="yellow"
          icon={<Icon icon={CrownIcon} size="sm" color="inherit" />}
        />
        <Token
          label="Design"
          color="purple"
          icon={<Icon icon={NumericIcon} size="sm" color="inherit" />}
        />
        <Token
          label="Verified"
          color="green"
          icon={<Icon icon={LockIcon} size="sm" color="inherit" />}
        />
      </Stack>
    </Stack>
  );
}
