import {Button} from '../Button.js';
import {Stack} from '../../Stack/Stack.js';

export function ButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3}>
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost" variant="tertiary" />
      <Button label="Destructive" variant="destructive" />
    </Stack>
  );
}
