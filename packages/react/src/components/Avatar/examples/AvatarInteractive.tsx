import {Avatar} from '../Avatar.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function AvatarInteractive() {
  return (
    <Stack direction="horizontal" gap={6}>
      <Stack direction="vertical" gap={2}>
        <Avatar
          src="/template-assets/DATA-Itai-Jordaan.png"
          name="Itai Jordaan"
          size={40}
          href="https://example.com/people/itai-jordaan"
        />
        <Text variant="small" color="secondary">
          Link (href)
        </Text>
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Avatar
          src="/template-assets/DATA-Margot-Schroder.png"
          name="Margot Schroder"
          size={40}
          onClick={() => window.alert('Opening Margot Schroder’s profile')}
        />
        <Text variant="small" color="secondary">
          Button (onClick)
        </Text>
      </Stack>
    </Stack>
  );
}
