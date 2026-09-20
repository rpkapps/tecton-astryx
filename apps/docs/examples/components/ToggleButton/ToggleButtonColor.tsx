'use client';

import {useState} from 'react';
import {ToggleButton} from '@tecton/react/ToggleButton';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {
  AddPinIcon,
  AnnotateIcon,
  CrownIcon,
  LinkIcon,
  NotificationsIcon,
} from '@tecton/react/icons';

export function ToggleButtonColor() {
  const [toolbar, setToolbar] = useState<Record<string, boolean>>({
    bold: true,
    italic: false,
    underline: true,
    strikethrough: false,
    link: false,
  });
  const toggleToolbar = (key: string) =>
    setToolbar(prev => ({...prev, [key]: !prev[key]}));

  const [reactions, setReactions] = useState<Record<string, boolean>>({
    star: false,
    heart: false,
    bookmark: true,
    bell: false,
  });
  const toggleReaction = (key: string) =>
    setReactions(prev => ({...prev, [key]: !prev[key]}));

  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Toolbar
        </Text>
        <Stack direction="horizontal" gap={1}>
          <ToggleButton
            label="Bold"
            icon={<Icon icon={AnnotateIcon} color="secondary" />}
            pressedIcon={<Icon icon={AnnotateIcon} color="accent" />}
            isPressed={toolbar.bold}
            onPressedChange={() => toggleToolbar('bold')}
            isIconOnly
          />
          <ToggleButton
            label="Italic"
            icon={<Icon icon={AnnotateIcon} color="secondary" />}
            pressedIcon={<Icon icon={AnnotateIcon} color="accent" />}
            isPressed={toolbar.italic}
            onPressedChange={() => toggleToolbar('italic')}
            isIconOnly
          />
          <ToggleButton
            label="Underline"
            icon={<Icon icon={AnnotateIcon} color="secondary" />}
            pressedIcon={<Icon icon={AnnotateIcon} color="accent" />}
            isPressed={toolbar.underline}
            onPressedChange={() => toggleToolbar('underline')}
            isIconOnly
          />
          <ToggleButton
            label="Strikethrough"
            icon={<Icon icon={AnnotateIcon} color="secondary" />}
            pressedIcon={<Icon icon={AnnotateIcon} color="accent" />}
            isPressed={toolbar.strikethrough}
            onPressedChange={() => toggleToolbar('strikethrough')}
            isIconOnly
          />
          <ToggleButton
            label="Link"
            icon={<Icon icon={LinkIcon} color="secondary" />}
            pressedIcon={<Icon icon={LinkIcon} color="accent" />}
            isPressed={toolbar.link}
            onPressedChange={() => toggleToolbar('link')}
            isIconOnly
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Reactions
        </Text>
        <Stack direction="horizontal" gap={2}>
          <ToggleButton
            label="Star"
            icon={<Icon icon={CrownIcon} color="secondary" />}
            pressedIcon={<Icon icon={CrownIcon} color="yellow" />}
            isPressed={reactions.star}
            onPressedChange={() => toggleReaction('star')}
            isIconOnly
          />
          <ToggleButton
            label="Like"
            icon={<Icon icon={CrownIcon} color="secondary" />}
            pressedIcon={<Icon icon={CrownIcon} color="red" />}
            isPressed={reactions.heart}
            onPressedChange={() => toggleReaction('heart')}
            isIconOnly
          />
          <ToggleButton
            label="Save"
            icon={<Icon icon={AddPinIcon} color="secondary" />}
            pressedIcon={<Icon icon={AddPinIcon} color="blue" />}
            isPressed={reactions.bookmark}
            onPressedChange={() => toggleReaction('bookmark')}
            isIconOnly
          />
          <ToggleButton
            label="Follow"
            icon={<Icon icon={NotificationsIcon} color="secondary" />}
            pressedIcon={<Icon icon={NotificationsIcon} color="accent" />}
            isPressed={reactions.bell}
            onPressedChange={() => toggleReaction('bell')}
            isIconOnly
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
