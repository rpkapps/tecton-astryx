import {Stack} from '../Stack.js';
import {Text} from '../../Text/Text.js';

export function StackBasic() {
  return (
    <Stack direction="vertical" gap={2}>
      <Text>Volume — Survey 2</Text>
      <Text>Top depth — 2,525 m</Text>
      <Text>Bottom depth — 2,639 m</Text>
    </Stack>
  );
}
