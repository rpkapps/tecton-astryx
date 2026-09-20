import {Text} from '../Text.js';
import {VStack} from '../../VStack/VStack.js';

export function TextVariants() {
  return (
    <VStack gap={1}>
      <Text variant="large">Large — a lead-in line</Text>
      <Text variant="medium">Medium — body copy</Text>
      <Text variant="mediumStrong">Medium strong — a field label</Text>
      <Text variant="small" color="secondary">
        Small — supporting copy
      </Text>
      <Text variant="mediumData" hasTabularNumbers>
        2,525 m &middot; 13,359 ft MD &middot; 68%
      </Text>
      <Text variant="tiny" color="secondary">
        Tiny — a unit or a caption
      </Text>
    </VStack>
  );
}
