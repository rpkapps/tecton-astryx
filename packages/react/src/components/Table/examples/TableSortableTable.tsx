import {Table} from '../Table.js';
import type {TableColumn} from '../Table.js';
import {
  useTableSortable,
  useTableSortableState,
} from '../../../support/index.js';

interface Employee extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'Engineer',
    age: 32,
  },
  {id: '2', name: 'Bob', email: 'bob@example.com', role: 'Designer', age: 28},
  {
    id: '3',
    name: 'Charlie',
    email: 'charlie@example.com',
    role: 'Manager',
    age: 45,
  },
  {
    id: '4',
    name: 'Diana',
    email: 'diana@example.com',
    role: 'Engineer',
    age: 37,
  },
  {id: '5', name: 'Eve', email: 'eve@example.com', role: 'Admin', age: 29},
];

const columns: TableColumn<Employee>[] = [
  {key: 'name', header: 'Name', width: {share: 1}, sortable: true},
  {key: 'email', header: 'Email', width: {share: 2}, sortable: true},
  {key: 'role', header: 'Role', width: {share: 1}, sortable: true},
  {key: 'age', header: 'Age', width: 80, sortable: true},
];

export function TableSortableTable() {
  const {sortedData, sortConfig} = useTableSortableState<Employee>({
    data: employees,
    defaultSort: [{sortKey: 'name', direction: 'ascending'}],
  });

  const sortablePlugin = useTableSortable<Employee>(sortConfig);

  return (
    <Table
      data={sortedData}
      columns={columns}
      idKey="id"
      plugins={{sortable: sortablePlugin}}
    />
  );
}
