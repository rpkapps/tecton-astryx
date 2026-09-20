'use client';

import {FieldLabel} from '@tecton/react/Field';
import {VStack} from '@tecton/react/Layout';

export function FieldLabelBasic() {
  return (
    <VStack gap={4}>
      <FieldLabel label="Email address" inputID="email-input" isRequired />
      <FieldLabel
        label="Phone number"
        inputID="phone-input"
        isOptional
        description="Include country code for international numbers"
      />
    </VStack>
  );
}
