import {Icon} from '../Icon.js';
import {HStack} from '../../HStack/HStack.js';

export function IconSizes() {
  return (
    <HStack gap={2} align="center">
      <Icon name="horizon" size={16} />
      <Icon name="horizon" size={20} />
      <Icon name="horizon" size={24} />
      <Icon name="horizon" size={24} variant="filled" />
    </HStack>
  );
}
