'use client';

import {useState} from 'react';
import {ToggleButton} from '@tecton/react/ToggleButton';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {AddPinIcon, CrownIcon, NotificationsIcon} from '@tecton/react/icons';

export function ToggleButtonIconSwap() {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Outline → solid icon swap on press
      </Text>
      <Stack direction="horizontal" gap={3} vAlign="center">
        <ToggleButton
          label="Favorite"
          icon={<Icon icon={CrownIcon} />}
          pressedIcon={<Icon icon={CrownIcon} />}
          isPressed={isFavorited}
          onPressedChange={setIsFavorited}
          isIconOnly
        />
        <ToggleButton
          label="Bookmark"
          icon={<Icon icon={AddPinIcon} />}
          pressedIcon={<Icon icon={AddPinIcon} />}
          isPressed={isBookmarked}
          onPressedChange={setIsBookmarked}
          isIconOnly
        />
        <ToggleButton
          label={isMuted ? 'Unmute notifications' : 'Mute notifications'}
          icon={<Icon icon={NotificationsIcon} />}
          pressedIcon={<Icon icon={NotificationsIcon} />}
          isPressed={isMuted}
          onPressedChange={setIsMuted}
          isIconOnly
        />
      </Stack>
    </Stack>
  );
}
