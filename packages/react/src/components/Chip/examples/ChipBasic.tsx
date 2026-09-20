import {Chip} from '../Chip.js';
import {HStack} from '../../HStack/HStack.js';

export function ChipBasic() {
  return (
    <HStack gap={1} align="center">
      <Chip label="Nominated" color="primary" icon="layers" />
      <Chip label="Ref case" />
      <Chip label="High risk" color="error" />
    </HStack>
  );
}
