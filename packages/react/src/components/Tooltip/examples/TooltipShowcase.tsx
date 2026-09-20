import {Button} from '../../Button/Button.js';
import {Tooltip} from '../Tooltip.js';

export function TooltipShowcase() {
  return (
    <Tooltip content="This is a helpful tooltip" placement="above">
      <Button label="Hover me" />
    </Tooltip>
  );
}
