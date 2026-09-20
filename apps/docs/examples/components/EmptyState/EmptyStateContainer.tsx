'use client';

import {EmptyState} from '@tecton/react/EmptyState';
import {Button} from '@tecton/react/Button';
import {Card} from '@tecton/react/Card';
import {Icon} from '@tecton/react/Icon';
import {FolderNewIcon} from '@tecton/react/icons';

export function EmptyStateContainer() {
  return (
    <Card>
      <EmptyState
        icon={<Icon icon={FolderNewIcon} size="lg" />}
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
