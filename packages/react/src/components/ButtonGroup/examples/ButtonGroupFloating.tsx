import {Button} from '../../Button/Button.js';
import {ButtonGroup} from '../ButtonGroup.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ButtonGroupFloating() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text variant="small" color="secondary">
        The whole group shares one raised surface — a floating action bar
      </Text>
      <ButtonGroup label="Zoom controls" elevation="med">
        <Button label="Zoom out" />
        <Button label="Reset" />
        <Button label="Zoom in" />
      </ButtonGroup>
    </Stack>
  );
}
