import {Alert} from '../Alert.js';
import {Stack} from '../../Stack/Stack.js';

export function AlertShowcase() {
  return (
    <Stack direction="vertical" gap={3}>
      <Alert status="info" title="A new software update is available." />
      <Alert status="success" title="Your changes have been saved." />
      <Alert
        status="warning"
        title="Your trial expires in 3 days."
        description="Upgrade to keep access to all features."
      />
      <Alert
        status="error"
        title="Payment failed."
        description="Update your billing information to continue."
      />
    </Stack>
  );
}
