'use client';

import {Tooltip} from '@tecton/react/Tooltip';
import {Button} from '@tecton/react/Button';

export function TooltipShowcase() {
  return (
    <Tooltip content="This is a helpful tooltip" placement="above">
      <Button label="Hover me" />
    </Tooltip>
  );
}
