import {Avatar} from '../Avatar.js';
import {Stack} from '../../Stack/Stack.js';

export function AvatarShowcase() {
  return (
    <Stack direction="horizontal" gap={4}>
      <Avatar
        src="/template-assets/DATA-Ana-Thomas.png"
        name="Ana Thomas"
        size={40}
      />
      <Avatar
        src="/template-assets/DATA-Drew-Young.png"
        name="Drew Young"
        size={40}
      />
      <Avatar
        src="/template-assets/DATA-Jihoo-Song.png"
        name="Jihoo Song"
        size={40}
      />
      <Avatar
        src="/template-assets/DATA-Nam-Tran.png"
        name="Nam Tran"
        size={40}
      />
    </Stack>
  );
}
