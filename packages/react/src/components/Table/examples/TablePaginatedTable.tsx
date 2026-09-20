import {useState} from 'react';
import {Section} from '../../Section/Section.js';
import {Table} from '../Table.js';
import type {TableColumn} from '../Table.js';
import {
  paginateRows as paginateData,
  useTablePagination,
} from '../../../support/index.js';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
}

const names = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Brown',
  'Diana Prince',
  'Eve Davis',
  'Frank Miller',
  'Grace Lee',
  'Hank Wilson',
  'Ivy Chen',
  'Jack Turner',
  'Karen White',
  'Leo Garcia',
  'Mia Thompson',
  'Noah Martinez',
  'Olivia Clark',
  'Paul Harris',
  'Quinn Walker',
  'Rachel Adams',
  'Sam Robinson',
  'Tina Scott',
];

const roles = ['Engineer', 'Designer', 'Manager', 'Admin', 'Analyst'];

const users: User[] = names.map((name, i) => ({
  id: String(i + 1),
  name,
  email: `${name.split(' ')[0].toLowerCase()}@example.com`,
  role: roles[i % roles.length],
}));

const columns: TableColumn<User>[] = [
  {key: 'name', header: 'Name', width: {share: 1}},
  {key: 'email', header: 'Email', width: {share: 2}},
  {key: 'role', header: 'Role', width: {share: 1}},
];

export function TablePaginatedTable() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const plugin = useTablePagination<User>({
    page,
    onPageChange: setPage,
    totalItems: users.length,
    pageSize,
  });

  return (
    <Section>
      <Table
        data={paginateData(users, page, pageSize)}
        columns={columns}
        idKey="id"
        plugins={{pagination: plugin}}
      />
    </Section>
  );
}
