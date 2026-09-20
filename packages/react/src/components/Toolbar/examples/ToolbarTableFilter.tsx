import {useState} from 'react';
import {MoreMenu} from '../../MoreMenu/MoreMenu.js';
import {Select} from '../../Select/Select.js';
import {Stack} from '../../Stack/Stack.js';
import {Table} from '../../Table/Table.js';
import {TextField} from '../../TextField/TextField.js';
import {Toolbar} from '../Toolbar.js';

export function ToolbarTableFilter() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);

  return (
    <Stack direction="vertical">
      <Toolbar
        label="Table filters"
        size="sm"
        dividers={['bottom']}
        startContent={
          <>
            <TextField
              label="Search"
              isLabelHidden
              placeholder="Search..."
              value={search}
              onChange={setSearch}
              startIcon={'search'}
            />
            <Select
              label="Status"
              isLabelHidden
              placeholder="Status"
              hasClear
              value={status}
              onChange={setStatus}
              options={['Open', 'In progress', 'Done']}
            />
            <Select
              label="Priority"
              isLabelHidden
              placeholder="Priority"
              hasClear
              value={priority}
              onChange={setPriority}
              options={['High', 'Medium', 'Low']}
            />
          </>
        }
        endContent={
          <MoreMenu
            items={[
              {label: 'Compact view'},
              {label: 'Comfortable view'},
              {label: 'Export CSV'},
            ]}
          />
        }
      />
      <Table
        idKey="id"
        columns={[
          {key: 'task', header: 'Task'},
          {key: 'status', header: 'Status'},
          {key: 'priority', header: 'Priority'},
        ]}
        data={[
          {id: '1', task: 'Fix login bug', status: 'Open', priority: 'High'},
          {
            id: '2',
            task: 'Update docs',
            status: 'In progress',
            priority: 'Medium',
          },
          {id: '3', task: 'Add unit tests', status: 'Open', priority: 'Low'},
        ]}
      />
    </Stack>
  );
}
