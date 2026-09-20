import {Button} from '../Button.js';
import {HStack} from '../../HStack/HStack.js';

export function ButtonVariants() {
  return (
    <HStack gap={2} align="center">
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Tertiary" variant="tertiary" />
      <Button label="Outlined" variant="outlined" />
      <Button label="Text only" variant="textOnly" />
    </HStack>
  );
}
