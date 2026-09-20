import {Avatar} from '../../Avatar/Avatar.js';
import {HStack} from '../../HStack/HStack.js';

export function AvatarStatusDotVariants() {
  return (
    <HStack gap={4}>
      <Avatar name="Ana Silva" size={40} />
      <Avatar name="Ben Okafor" size={40} />
      <Avatar name="Cleo Marsh" size={40} />
    </HStack>
  );
}
