import {Divider} from '../Divider.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function DividerBasic() {
  return (
    <VStack gap={2}>
      <Text>Top depth</Text>
      <Divider variant="subtle" />
      <Text>Bottom depth</Text>
      <Divider variant="medium" />
      <Text>Gross thickness</Text>
      <Divider variant="strong" />
      <Text>Net to gross</Text>
    </VStack>
  );
}
