import {useState} from 'react';
import {Icon} from '../../Icon/Icon.js';
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
          icon={<Icon name={'crown'} />}
          pressedIcon={<Icon name={'crown'} />}
          isPressed={isFavorited}
          onPressedChange={setIsFavorited}
          isIconOnly
        />
        <ToggleButton
          label="Bookmark"
          icon={<Icon name={'add-pin'} />}
          pressedIcon={<Icon name={'add-pin'} />}
          isPressed={isBookmarked}
          onPressedChange={setIsBookmarked}
          isIconOnly
        />
        <ToggleButton
          label={isMuted ? 'Unmute notifications' : 'Mute notifications'}
          icon={<Icon name={'notifications'} />}
          pressedIcon={<Icon name={'notifications'} />}
          isPressed={isMuted}
          onPressedChange={setIsMuted}
          isIconOnly
        />
      </Stack>
    </Stack>
  );
}
