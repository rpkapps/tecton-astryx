import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../Icon.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const colors = [
  'blue',
  'red',
  'green',
  'gray',
  'cyan',
  'teal',
  'yellow',
  'orange',
  'pink',
  'purple',
] as const;

export function IconNonSemanticColors() {
  return (
    <HStack gap={4} wrap="wrap">
      {colors.map(color => (
        <VStack key={color} gap={1}>
          <Icon name="search" />
          <Text variant="small">{color}</Text>
        </VStack>
      ))}
    </HStack>
  );
}
