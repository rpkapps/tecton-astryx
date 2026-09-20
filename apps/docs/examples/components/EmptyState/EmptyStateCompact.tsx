'use client';

import {EmptyState} from '@tecton/react/EmptyState';
import {Button} from '@tecton/react/Button';
import {HStack} from '@tecton/react/Layout';
import {Icon} from '@tecton/react/Icon';
import {FolderOpenIcon} from '@tecton/react/icons';

export function EmptyStateCompact() {
  return (
    <EmptyState
      icon={<Icon icon={FolderOpenIcon} size="lg" />}
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
