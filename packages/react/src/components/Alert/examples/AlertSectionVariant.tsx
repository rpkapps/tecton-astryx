import {Alert} from '../Alert.js';
import {Button} from '../../Button/Button.js';
import {Stack} from '../../Stack/Stack.js';

export function AlertSectionVariant() {
  return (
    <Stack direction="vertical" gap={3}>
      <Alert
        status="warning"
        title="Scheduled downtime"
        description="All services will be unavailable on Sunday from 2:00–4:00 AM."
        container="section"
        isDismissable
      />
      <Alert
        status="info"
        title="Welcome to the new dashboard"
        description="We have redesigned the layout based on your feedback."
        container="section"
        endContent={
          <Button label="Take a tour" variant="secondary" size="sm" />
        }
      />
    </Stack>
  );
}
