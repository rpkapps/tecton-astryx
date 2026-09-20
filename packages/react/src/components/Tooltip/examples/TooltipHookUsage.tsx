import {Button} from '../../Button/Button.js';
import {Center} from '../../Center/Center.js';
import {useTooltip} from '../../../support/index.js';

export function TooltipHookUsage() {
  const tooltip = useTooltip({
    placement: 'above',
    delay: 100,
  });

  return (
    <Center>
      <Button
        label="Using hook directly"
        ref={tooltip.ref}
        aria-describedby={tooltip.describedBy}
      />
      {tooltip.renderTooltip('Tooltip via hook')}
    </Center>
  );
}
