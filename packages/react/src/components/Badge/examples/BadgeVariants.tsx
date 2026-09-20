import {Badge} from '../Badge.js';
import {HStack} from '../../HStack/HStack.js';

export function BadgeVariants() {
  return (
    <HStack gap={1} wrap="wrap" align="center">
      <Badge label="Draft" />
      <Badge label="Running" variant="info" />
      <Badge label="Complete" variant="success" />
      <Badge label="Stale" variant="warning" />
      <Badge label="Failed" variant="error" />
      <Badge label="Nominated" variant="lime" />
    </HStack>
  );
}
