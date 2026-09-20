'use client';

import {FieldStatus} from '@tecton/react/FieldStatus';
import {VStack} from '@tecton/react/Layout';

export function FieldStatusBasic() {
  return (
    <VStack gap={4}>
      <FieldStatus
        type="error"
        message="This field is required"
        variant="detached"
      />
      <FieldStatus
        type="success"
        message="Your changes have been saved"
        variant="detached"
      />
    </VStack>
  );
}
