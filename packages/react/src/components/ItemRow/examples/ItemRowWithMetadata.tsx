import {Badge} from '../../Badge/Badge.js';
import {Icon} from '../../Icon/Icon.js';
import {ItemRow} from '../ItemRow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ItemRowWithMetadata() {
  return (
    <Stack gap={0}>
      <ItemRow
        startContent={<Icon name="check" size={16} />}
        label="Build passed"
        description="Production deploy completed"
        endContent={<Text color="secondary">2m ago</Text>}
      />
      <ItemRow
        startContent={<Icon name="warning" size={16} />}
        label="High memory usage"
        description="Worker pool is above the warning threshold"
        endContent={<Badge label="Warning" variant="warning" />}
        isHighlighted
      />
      <ItemRow
        startContent={<Icon name="error" size={16} />}
        label="Sync failed"
        description="Retry after checking service credentials"
        endContent={<Badge label="Action" variant="error" />}
        isSelected
      />
    </Stack>
  );
}
