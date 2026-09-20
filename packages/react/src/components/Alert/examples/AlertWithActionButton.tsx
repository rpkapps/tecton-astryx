import {Alert} from '../Alert.js';
import {Stack} from '../../Stack/Stack.js';

export function AlertWithActionButton() {
  return (
    <Stack direction="vertical" gap={3}>
      <Alert
        status="info"
        title="Your trial expires in 3 days"
        description="Upgrade now to keep access to all features."
      />
      <Alert
        status="warning"
        title="API key expires soon"
        description="Generate a new key before December 1 to avoid service interruption."
      />
      <Alert
        status="error"
        title="Payment failed"
        description="We could not process your last payment."
      />
    </Stack>
  );
}
