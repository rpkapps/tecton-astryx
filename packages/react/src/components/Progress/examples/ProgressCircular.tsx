import {Progress} from '../Progress.js';
import {HStack} from '../../HStack/HStack.js';

export function ProgressCircular() {
  return (
    <HStack gap={3} align="center">
      <Progress
        label="Realisations"
        variant="circular"
        value={75}
        hasValueLabel
      />
      <Progress label="Realisations" variant="circular" value={40} size={16} />
      <Progress label="Working" variant="circular" isIndeterminate />
    </HStack>
  );
}
