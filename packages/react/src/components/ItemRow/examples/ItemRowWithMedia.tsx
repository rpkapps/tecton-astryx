import {Avatar} from '../../Avatar/Avatar.js';
import {Badge} from '../../Badge/Badge.js';
import {Icon} from '../../Icon/Icon.js';
import {ItemRow} from '../ItemRow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ItemRowWithMedia() {
  return (
    <Stack gap={0}>
      <ItemRow
        startContent={<Avatar name="Ada Lovelace" size={24} />}
        label="Ada Lovelace"
        description="Design systems engineer"
        endContent={<Badge label="Owner" />}
        onClick={() => {}}
      />
      <ItemRow
        startContent={<Avatar name="Grace Hopper" size={24} />}
        label="Grace Hopper"
        description="Compiler platform"
        endContent={<Text color="secondary">Online</Text>}
        onClick={() => {}}
      />
      <ItemRow
        startContent={<Icon name="info" size={16} />}
        label="Review handoff notes"
        description="Updated guidance is ready for the team"
        endContent={<Badge label="New" />}
        onClick={() => {}}
      />
    </Stack>
  );
}
