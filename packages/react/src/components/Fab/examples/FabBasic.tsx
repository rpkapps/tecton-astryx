import {Fab} from '../Fab.js';
import {HStack} from '../../HStack/HStack.js';

export function FabBasic() {
  return (
    <HStack gap={3} align="center">
      <Fab label="New well plan" icon="add" />
      <Fab label="New well plan" icon="add" shape="extended" />
    </HStack>
  );
}
