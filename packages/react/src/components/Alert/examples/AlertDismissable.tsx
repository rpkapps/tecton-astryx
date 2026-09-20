import {Alert} from '../Alert.js';
import {Stack} from '../../Stack/Stack.js';

export function AlertDismissable() {
  return (
    <Stack direction="vertical" gap={3}>
      <Alert
        status="success"
        title="Deployment complete"
        description="Version 3.2.0 is now live in production."
        isDismissable
      />
      <Alert
        status="warning"
        title="Scheduled maintenance tonight"
        description="The system will be briefly unavailable from 2:00–3:00 AM."
        isDismissable
      />
      <Alert
        status="info"
        title="New feature available"
        description="Try the new dashboard layout in Settings."
        isDismissable
      />
    </Stack>
  );
}
