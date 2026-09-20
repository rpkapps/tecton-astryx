import {Button} from '../../Button/Button.js';
import {EmptyState} from '../EmptyState.js';
import {Icon} from '../../Icon/Icon.js';

export function EmptyStateActions() {
  return (
    <EmptyState
      icon={<Icon name={'search'} size={24} />}
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
