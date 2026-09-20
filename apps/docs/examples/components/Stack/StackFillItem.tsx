'use client';

import {Stack, StackItem} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Button} from '@tecton/react/Button';
import {Avatar} from '@tecton/react/Avatar';

const USERS = [
  {name: 'Olivia Chen', role: 'Engineering Lead'},
  {name: 'Marcus Rivera', role: 'Product Designer'},
  {name: 'Aisha Patel', role: 'Marketing Manager'},
];

export function StackFillItem() {
  return (
    <Stack direction="vertical" gap={3} width="100%" style={{maxWidth: 300}}>
      {USERS.map(user => (
        <Stack key={user.name} direction="horizontal" gap={3} vAlign="center">
          <StackItem size="static">
            <Avatar name={user.name} size="md" />
          </StackItem>
          <StackItem size="fill">
            <Stack direction="vertical" gap={0}>
              <Text type="body" weight="bold">
                {user.name}
              </Text>
              <Text type="supporting" color="secondary">
                {user.role}
              </Text>
            </Stack>
          </StackItem>
          <StackItem size="static">
            <Button label="View" variant="secondary" size="sm" />
          </StackItem>
        </Stack>
      ))}
    </Stack>
  );
}
