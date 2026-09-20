import {Button} from '../Button.js';
import {HStack} from '../../HStack/HStack.js';

export function ButtonWithIcon() {
  return (
    <HStack gap={2} align="center">
      <Button label="Add horizon" icon="add" variant="primary" />
      <Button label="Export" icon="export-upload" variant="secondary" />
      <Button label="Saving" variant="secondary" isLoading />
    </HStack>
  );
}
