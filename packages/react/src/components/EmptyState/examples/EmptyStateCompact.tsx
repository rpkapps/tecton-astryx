import {Button} from '../../Button/Button.js';
import {EmptyState} from '../EmptyState.js';
import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../../Icon/Icon.js';

export function EmptyStateCompact() {
  return (
    <EmptyState
      icon={<Icon name={'folder-open'} size={24} />}
      title="No notifications"
      description="You're all caught up. New notifications will appear here."
      actions={
        <HStack gap={2}>
          <Button label="Settings" variant="secondary" size="sm" />
          <Button label="Refresh" variant="primary" size="sm" />
        </HStack>
      }
      isCompact
    />
  );
}
