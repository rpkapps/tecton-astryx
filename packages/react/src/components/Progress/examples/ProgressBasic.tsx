import {Progress} from '../Progress.js';
import {VStack} from '../../VStack/VStack.js';

export function ProgressBasic() {
  return (
    <VStack gap={3} width={280}>
      <Progress label="Gridding horizons" value={62} hasValueLabel />
      <Progress label="Depth converting" isIndeterminate />
    </VStack>
  );
}
