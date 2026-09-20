'use client';

import {EmptyState} from '@tecton/react/EmptyState';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {SearchIcon} from '@tecton/react/icons';

export function EmptyStateShowcase() {
  return (
    <EmptyState
      icon={<Icon icon={SearchIcon} size="lg" />}
      title="No results found"
      description="Try adjusting your search or filters to find what you need."
      actions={<Button label="Clear filters" variant="secondary" />}
    />
  );
}
