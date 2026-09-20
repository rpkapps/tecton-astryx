'use client';

import {Tooltip} from '@tecton/react/Tooltip';
import {Button} from '@tecton/react/Button';
import {HStack} from '@tecton/react/Layout';
import {Center} from '@tecton/react/Center';

export function TooltipActionBarTooltips() {
  return (
    <Center>
      <HStack gap={4}>
        <Tooltip content="Save your changes" placement="above">
          <Button label="Save" />
        </Tooltip>
        <Tooltip content="Discard changes" placement="above">
          <Button label="Cancel" />
        </Tooltip>
        <Tooltip content="Delete permanently" placement="above">
          <Button label="Delete" variant="destructive" />
        </Tooltip>
      </HStack>
    </Center>
  );
}
