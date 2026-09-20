import {HStack} from '../../HStack/HStack.js';
import {NavIcon} from '../NavIcon.js';

export function NavIconBasic() {
  return (
    <HStack gap={4}>
      <NavIcon icon="search" />
      <NavIcon icon="diamond-mark" />
    </HStack>
  );
}
