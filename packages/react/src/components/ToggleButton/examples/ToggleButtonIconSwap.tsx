import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {ToggleButton} from '../ToggleButton.js';

export function ToggleButtonIconSwap() {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Outline → solid icon swap on press
      </Text>
      <Stack direction="horizontal" gap={3}>
        <ToggleButton
          label="Favorite"
          icon="crown"
          pressedIcon="crown"
          isPressed={isFavorited}
          onPressedChange={setIsFavorited}
          isIconOnly
        />
        <ToggleButton
          label="Bookmark"
          icon="add-pin"
          pressedIcon="add-pin"
          isPressed={isBookmarked}
          onPressedChange={setIsBookmarked}
          isIconOnly
        />
        <ToggleButton
          label={isMuted ? 'Unmute notifications' : 'Mute notifications'}
          icon="notifications"
          pressedIcon="notifications"
          isPressed={isMuted}
          onPressedChange={setIsMuted}
          isIconOnly
        />
      </Stack>
    </Stack>
  );
}
