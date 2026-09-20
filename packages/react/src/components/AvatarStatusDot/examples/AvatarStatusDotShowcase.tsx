import {Avatar} from '../../Avatar/Avatar.js';
import {HStack} from '../../HStack/HStack.js';

export function AvatarStatusDotShowcase() {
  return (
    <HStack gap={4}>
      <Avatar name="Online User" size={40} />
      <Avatar name="Away User" size={40} />
      <Avatar name="Busy User" size={40} />
    </HStack>
  );
}
