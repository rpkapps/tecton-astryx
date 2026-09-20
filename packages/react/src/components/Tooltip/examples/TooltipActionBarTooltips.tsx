import {Button} from '../../Button/Button.js';
import {Center} from '../../Center/Center.js';
import {HStack} from '../../HStack/HStack.js';
import {Tooltip} from '../Tooltip.js';

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
