import {Button} from '../../Button/Button.js';
import {ButtonGroup} from '../ButtonGroup.js';
import {IconButton} from '../../IconButton/IconButton.js';
import {Stack} from '../../Stack/Stack.js';

export function ButtonGroupShowcase() {
  return (
    <Stack direction="horizontal" gap={6}>
      <ButtonGroup label="Clipboard actions">
        <Button label="Copy" icon="copy" />
        <Button label="Cut" icon="design" />
        <Button label="Paste" icon="copy" />
      </ButtonGroup>
      <ButtonGroup label="Save options">
        <Button label="Save" variant="primary" />
        <IconButton
          label="Save options"
          variant="primary"
          icon="chevron-down"
        />
      </ButtonGroup>
    </Stack>
  );
}
