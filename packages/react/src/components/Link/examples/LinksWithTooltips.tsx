import {HStack} from '../../HStack/HStack.js';
import {Link} from '../Link.js';

export function LinksWithTooltips() {
  return (
    <HStack gap={4}>
      <Link href="#" tooltip="Configure your account settings" isStandalone>
        Settings
      </Link>
      <Link href="#" tooltip="View and edit your profile" isStandalone>
        Profile
      </Link>
      <Link
        href="#"
        tooltip="Get help and support"
        color="secondary"
        isStandalone
      >
        Help
      </Link>
    </HStack>
  );
}
