'use client';

import {Text} from '@tecton/react/Text';

export function TextInline() {
  return (
    <Text type="body" display="block">
      Design tokens are <Text type="code">themeable</Text> and shared across
      every surface.
    </Text>
  );
}
