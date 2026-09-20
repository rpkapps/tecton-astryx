import {FieldMessage} from '../FieldMessage.js';
import {VStack} from '../../VStack/VStack.js';

export function FieldMessageShowcase() {
  return (
    <VStack gap={4}>
      <FieldMessage
        type="error"
        message="This field is required"
        variant="detached"
      />
      <FieldMessage
        type="warning"
        message="This username is already taken by another team"
        variant="detached"
      />
      <FieldMessage
        type="success"
        message="Your changes have been saved"
        variant="detached"
      />
    </VStack>
  );
}
