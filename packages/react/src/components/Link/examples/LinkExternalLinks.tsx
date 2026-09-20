import {Link} from '../Link.js';
import {VStack} from '../../VStack/VStack.js';

export function LinkExternalLinks() {
  return (
    <VStack gap={2}>
      <Link href="https://github.com">GitHub</Link>
      <Link href="https://developer.mozilla.org">MDN Web Docs</Link>
      <Link href="https://react.dev">React Documentation</Link>
    </VStack>
  );
}
