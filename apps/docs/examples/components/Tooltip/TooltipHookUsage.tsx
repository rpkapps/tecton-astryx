'use client';

import {useTooltip} from '@tecton/react/Tooltip';
import {Button} from '@tecton/react/Button';
import {Center} from '@tecton/react/Center';

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
