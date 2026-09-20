import {IconButton} from '../../IconButton/IconButton.js';
import {Tooltip} from '../Tooltip.js';

export function TooltipBasic() {
  return (
    <Tooltip content="Dog-leg severity, in degrees per 30 m">
      <IconButton label="About DLS" icon="info" variant="textOnly" />
    </Tooltip>
  );
}
