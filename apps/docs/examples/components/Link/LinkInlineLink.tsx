'use client';

import {Link} from '@tecton/react/Link';
import {Text} from '@tecton/react/Text';

export function LinkInlineLink() {
  return (
    <Text type="body">
      Read the <Link href="#">documentation</Link> for more information about
      using Astryx components.
    </Text>
  );
}
