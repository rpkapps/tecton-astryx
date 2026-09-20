import {Avatar} from '../Avatar.js';
import {Stack} from '../../Stack/Stack.js';

export function AvatarWithImage() {
  return (
    <Stack direction="horizontal" gap={4}>
      <Avatar
        src="/template-assets/DATA-Ami-Pena.png"
        name="Ami Pena"
        size={18}
      />
      <Avatar
        src="/template-assets/DATA-Ana-Thomas.png"
        name="Ana Thomas"
        size={32}
      />
      <Avatar
        src="/template-assets/DATA-Daniela-Gimenez.png"
        name="Daniela Gimenez"
        size={40}
      />
      <Avatar
        src="/template-assets/DATA-Gabriela-Fernandez.png"
        name="Gabriela Fernandez"
        size={40}
      />
    </Stack>
  );
}
