import {Avatar} from '../Avatar.js';
import {Stack} from '../../Stack/Stack.js';

export function AvatarWithStatus() {
  return (
    <Stack direction="horizontal" gap={4}>
      <Avatar
        src="/template-assets/DATA-Itai-Jordaan.png"
        name="Itai Jordaan"
        size={40}
      />
      <Avatar
        src="/template-assets/DATA-Margot-Schroder.png"
        name="Margot Schroder"
        size={40}
      />
      <Avatar
        src="/template-assets/DATA-Pablo-Morales.png"
        name="Pablo Morales"
        size={40}
      />
    </Stack>
  );
}
