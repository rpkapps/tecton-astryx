import {FieldMessage} from '../FieldMessage.js';
import {VStack} from '../../VStack/VStack.js';

export function FieldMessageBasic() {
  return (
    <VStack gap={4}>
      <FieldMessage
        type="error"
        message="This field is required"
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
