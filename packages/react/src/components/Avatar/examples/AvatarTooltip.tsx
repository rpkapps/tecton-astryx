import {Avatar} from '../Avatar.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function AvatarTooltip() {
  return (
    <Stack direction="vertical" gap={5}>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Hover or focus to reveal each name
        </Text>
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
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Custom tooltip text
        </Text>
        <Avatar
          src="/template-assets/DATA-Itai-Jordaan.png"
          name="Itai Jordaan"
          size={40}
          tooltip="Itai Jordaan · Engineering Lead"
        />
      </Stack>
    </Stack>
  );
}
