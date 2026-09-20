import {Avatar} from '../../Avatar/Avatar.js';
import {Button} from '../../Button/Button.js';
import {Stack} from '../Stack.js';
import {StackItem} from '../../StackItem/StackItem.js';
import {Text} from '../../Text/Text.js';

const USERS = [
  {name: 'Olivia Chen', role: 'Engineering Lead'},
  {name: 'Marcus Rivera', role: 'Product Designer'},
  {name: 'Aisha Patel', role: 'Marketing Manager'},
];

export function StackFillItem() {
  return (
    <Stack direction="vertical" gap={3} width="100%">
      {USERS.map(user => (
        <Stack key={user.name} direction="horizontal" gap={3}>
          <StackItem size="static">
            <Avatar name={user.name} size={32} />
          </StackItem>
          <StackItem size="fill">
            <Stack direction="vertical" gap={0}>
              <Text variant="medium" weight="bold">
                {user.name}
              </Text>
              <Text variant="small" color="secondary">
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
