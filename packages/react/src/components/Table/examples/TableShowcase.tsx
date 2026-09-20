import {Card} from '../../Card/Card.js';
import {Table} from '../Table.js';
import type {TableColumn} from '../Table.js';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
}

const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Engineer',
    age: 30,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Designer',
    age: 25,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'PM',
    age: 35,
  },
];

const columns: TableColumn<User>[] = [
  {key: 'name', header: 'Name', width: {share: 1}},
  {key: 'email', header: 'Email', width: {share: 2}},
  {key: 'role', header: 'Role', width: {share: 1}},
  {key: 'age', header: 'Age', width: 80},
];

export function TableShowcase() {
  return (
    <Card width={600}>
      <Table data={users} columns={columns} idKey="id" hasHover />
    </Card>
  );
}
