import {Avatar} from '../../Avatar/Avatar.js';
import {Badge} from '../../Badge/Badge.js';
import {Icon} from '../../Icon/Icon.js';
import {ItemRow} from '../ItemRow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ItemRowShowcase() {
  return (
    <Stack gap={0}>
      <ItemRow
        startContent={<Avatar name="Alice Johnson" size={40} />}
        label="Alice Johnson"
        description="Engineering Lead"
        endContent={<Badge label="Admin" />}
        onClick={() => {}}
      />
      <ItemRow
        startContent={<Icon name={'notifications'} size={16} />}
        label="Build completed successfully"
        description="Pipeline #4521 — all 42 tests passed"
        endContent={<Text color="secondary">5h ago</Text>}
        descriptionLines={1}
        onClick={() => {}}
      />
      <ItemRow
        startContent={<Icon name={'reports-analytics'} size={16} />}
        label="design-spec.pdf"
        description="Modified 2 hours ago"
        endContent={<Text color="secondary">2.4 MB</Text>}
        isSelected
        onClick={() => {}}
      />
      <ItemRow
        startContent={<Icon name={'person'} size={16} />}
        label="Compact menu item"
        density="compact"
        onClick={() => {}}
      />
    </Stack>
  );
}
