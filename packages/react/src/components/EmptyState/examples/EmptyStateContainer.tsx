import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {EmptyState} from '../EmptyState.js';

export function EmptyStateContainer() {
  return (
    <Card>
      <EmptyState
        icon="folder-new"
        title="No projects yet"
        description="Create your first project to start organizing your work. You can invite team members after."
        actions={
          <>
            <Button label="Import" variant="secondary" />
            <Button label="Create project" variant="primary" />
          </>
        }
      />
    </Card>
  );
}
