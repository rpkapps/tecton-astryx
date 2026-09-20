import {Button} from '../../Button/Button.js';
import {EmptyState} from '../EmptyState.js';

export function EmptyStateShowcase() {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description="Try adjusting your search or filters to find what you need."
      actions={<Button label="Clear filters" variant="secondary" />}
    />
  );
}
