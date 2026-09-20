import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../../Icon/Icon.js';
import {NavIcon} from '../NavIcon.js';

export function NavIconShowcase() {
  return (
    <HStack gap={4}>
      <NavIcon icon={<Icon name="search" />} />
      <NavIcon icon={<Icon name="diamond-mark" />} />
      <NavIcon icon={<Icon name="diamond-mark" />} />
    </HStack>
  );
}
