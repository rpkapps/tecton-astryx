import {TextField} from '../../TextField/TextField.js';
import {VStack} from '../VStack.js';

export function VStackBasic() {
  return (
    <VStack gap={3} width={240}>
      <TextField label="Model name" value="Facies Model 01" />
      <TextField label="Realisations" value="25" />
    </VStack>
  );
}
