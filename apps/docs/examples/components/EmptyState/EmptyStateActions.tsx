'use client';

import {EmptyState} from '@tecton/react/EmptyState';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {SearchIcon} from '@tecton/react/icons';

export function EmptyStateActions() {
  return (
    <EmptyState
      icon={<Icon icon={SearchIcon} size="lg" />}
      title="No results found"
      description="Try adjusting your search terms or clearing filters to see more results."
      actions={
        <>
          <Button label="Go back" variant="secondary" />
          <Button label="Clear filters" variant="primary" />
        </>
      }
    />
  );
}
