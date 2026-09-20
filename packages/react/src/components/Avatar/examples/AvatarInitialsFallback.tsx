import {Avatar} from '../Avatar.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const NAMES = [
  {name: 'John Doe', note: 'First + last'},
  {name: 'Alice', note: 'Single name'},
  {name: 'Bob Smith Johnson', note: 'Multi-word'},
  {name: 'Dr. Sarah Connor', note: 'Prefixed'},
];

export function AvatarInitialsFallback() {
  return (
    <Stack direction="horizontal" gap={6}>
      {NAMES.map(({name, note}) => (
        <Stack key={name} direction="vertical" gap={2}>
          <Avatar name={name} size={40} />
          <Text variant="small" color="secondary">
            {note}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
