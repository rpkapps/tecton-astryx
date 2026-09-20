import {Link} from '../Link.js';
import {VStack} from '../../VStack/VStack.js';

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
