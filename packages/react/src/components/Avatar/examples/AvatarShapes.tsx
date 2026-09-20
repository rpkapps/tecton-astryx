import {Avatar} from '../Avatar.js';
import {HStack} from '../../HStack/HStack.js';

export function AvatarShapes() {
  return (
    <HStack gap={2} align="center">
      <Avatar name="Ingrid Halvorsen" shape="circle" />
      <Avatar name="Ola Nordmann" shape="rounded" />
      <Avatar name="Sofia Reyes" shape="square" />
    </HStack>
  );
}
