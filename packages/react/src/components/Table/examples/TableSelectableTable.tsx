import {useState} from 'react';
import {Table} from '../Table.js';
import type {TableColumn} from '../Table.js';
import {
  useTableSelection,
  useTableSelectionState,
} from '../../../support/index.js';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  {id: '1', name: 'Alice', email: 'alice@example.com', role: 'Engineer'},
  {id: '2', name: 'Bob', email: 'bob@example.com', role: 'Designer'},
  {id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'Manager'},
  {id: '4', name: 'Diana', email: 'diana@example.com', role: 'Engineer'},
  {id: '5', name: 'Eve', email: 'eve@example.com', role: 'Admin'},
];

const columns: TableColumn<User>[] = [
  {key: 'name', header: 'Name', width: {share: 1}},
  {key: 'email', header: 'Email', width: {share: 2}},
  {key: 'role', header: 'Role', width: {share: 1}},
];

export function TableSelectableTable() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const {selectionConfig} = useTableSelectionState<User>({
    data: users,
    idKey: 'id',
    selectedKeys,
    setSelectedKeys,
  });
  const selectionPlugin = useTableSelection<User>(selectionConfig);

  return (
    <Table
      data={users}
      columns={columns}
      idKey="id"
      plugins={{selection: selectionPlugin}}
    />
  );
}
