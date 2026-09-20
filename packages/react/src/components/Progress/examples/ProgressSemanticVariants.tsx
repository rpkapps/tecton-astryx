import {Progress} from '../Progress.js';
import {VStack} from '../../VStack/VStack.js';

export function ProgressSemanticVariants() {
  return (
    <VStack gap={4} width="100%">
      <Progress value={60} label="Accent" variant="accent" hasValueLabel />
      <Progress value={80} label="Positive" variant="success" hasValueLabel />
      <Progress value={50} label="Warning" variant="warning" hasValueLabel />
      <Progress value={92} label="Negative" variant="error" hasValueLabel />
      <Progress value={35} label="Neutral" variant="neutral" hasValueLabel />
    </VStack>
  );
}
