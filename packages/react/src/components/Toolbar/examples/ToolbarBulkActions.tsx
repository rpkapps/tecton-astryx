import {useState} from 'react';
import {Badge} from '../../Badge/Badge.js';
import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';
import {Table} from '../../Table/Table.js';
import {Toolbar} from '../Toolbar.js';
import {
  useTableSelection,
  useTableSelectionState,
} from '../../../support/index.js';

const DATA = [
  {id: '1', name: 'Alex Johnson', status: 'Active', role: 'Admin'},
  {id: '2', name: 'Sam Rivera', status: 'Active', role: 'Editor'},
  {id: '3', name: 'Jordan Lee', status: 'Invited', role: 'Viewer'},
  {id: '4', name: 'Taylor Kim', status: 'Active', role: 'Editor'},
  {id: '5', name: 'Casey Park', status: 'Active', role: 'Viewer'},
];

export function ToolbarBulkActions() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set(['1', '3', '5']),
  );

  const {selectionConfig} = useTableSelectionState({
    data: DATA,
    idKey: 'id',
    selectedKeys,
    setSelectedKeys,
  });

  const selectionPlugin = useTableSelection(selectionConfig);

  return (
    <Stack direction="vertical">
      {selectedKeys.size > 0 && (
        <Toolbar
          label="Bulk actions"
          size="sm"
          variant="muted"
          dividers={['bottom']}
          startContent={
            <>
              <Badge label={`${selectedKeys.size} selected`} />
              <Button
                label="Delete"
                variant="tertiary"
                icon={<Icon name={'delete'} />}
              />
              <Button
                label="Archive"
                variant="tertiary"
                icon={<Icon name={'folder'} />}
              />
            </>
          }
          endContent={
            <Button
              label="Deselect all"
              variant="tertiary"
              onClick={() => setSelectedKeys(new Set())}
            />
          }
        />
      )}
      <Table
        idKey="id"
        columns={[
          {key: 'name', header: 'Name'},
          {key: 'status', header: 'Status'},
          {key: 'role', header: 'Role'},
        ]}
        data={DATA}
        plugins={{selection: selectionPlugin}}
      />
    </Stack>
  );
}
