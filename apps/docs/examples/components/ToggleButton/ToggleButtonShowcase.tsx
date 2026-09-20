'use client';

import {useState} from 'react';
import {ToggleButton} from '@tecton/react/ToggleButton';
import {Stack} from '@tecton/react/Layout';
import {Icon} from '@tecton/react/Icon';
import {AddPinIcon, CrownIcon, NotificationsIcon} from '@tecton/react/icons';

export function ToggleButtonShowcase() {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
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
        label="Notifications"
        icon={<Icon icon={NotificationsIcon} />}
        pressedIcon={<Icon icon={NotificationsIcon} />}
        isPressed={isMuted}
        onPressedChange={setIsMuted}
      >
        Notifications
      </ToggleButton>
    </Stack>
  );
}
