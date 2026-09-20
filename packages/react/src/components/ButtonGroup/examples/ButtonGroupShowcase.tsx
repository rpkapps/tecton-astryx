import {Button} from '../../Button/Button.js';
import {ButtonGroup} from '../ButtonGroup.js';
import {Icon} from '../../Icon/Icon.js';
import {IconButton} from '../../IconButton/IconButton.js';
import {Stack} from '../../Stack/Stack.js';

export function ButtonGroupShowcase() {
  return (
    <Stack direction="horizontal" gap={6}>
      <ButtonGroup label="Clipboard actions">
        <Button label="Copy" icon={<Icon name={'copy'} />} />
        <Button label="Cut" icon={<Icon name={'design'} />} />
        <Button label="Paste" icon={<Icon name={'copy'} />} />
      </ButtonGroup>
      <ButtonGroup label="Save options">
        <Button label="Save" variant="primary" />
        <IconButton
          label="Save options"
          variant="primary"
          icon={<Icon name={'chevron-down'} />}
        />
      </ButtonGroup>
    </Stack>
  );
}
