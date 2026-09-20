'use client';

import {Link} from '@tecton/react/Link';
import {VStack} from '@tecton/react/Layout';

export function LinkExternalLinks() {
  return (
    <VStack gap={2}>
      <Link href="https://github.com" isExternalLink isStandalone>
        GitHub
      </Link>
      <Link href="https://developer.mozilla.org" isExternalLink isStandalone>
        MDN Web Docs
      </Link>
      <Link href="https://react.dev" isExternalLink hasUnderline isStandalone>
        React Documentation
      </Link>
    </VStack>
  );
}
