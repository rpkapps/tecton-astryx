import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {ToggleButton} from '../ToggleButton.js';

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
        <Text variant="small" color="secondary">
          Toolbar
        </Text>
        <Stack direction="horizontal" gap={1}>
          <ToggleButton
            label="Bold"
            icon="annotate"
            pressedIcon="annotate"
            isPressed={toolbar.bold}
            onPressedChange={() => toggleToolbar('bold')}
            isIconOnly
          />
          <ToggleButton
            label="Italic"
            icon="annotate"
            pressedIcon="annotate"
            isPressed={toolbar.italic}
            onPressedChange={() => toggleToolbar('italic')}
            isIconOnly
          />
          <ToggleButton
            label="Underline"
            icon="annotate"
            pressedIcon="annotate"
            isPressed={toolbar.underline}
            onPressedChange={() => toggleToolbar('underline')}
            isIconOnly
          />
          <ToggleButton
            label="Strikethrough"
            icon="annotate"
            pressedIcon="annotate"
            isPressed={toolbar.strikethrough}
            onPressedChange={() => toggleToolbar('strikethrough')}
            isIconOnly
          />
          <ToggleButton
            label="Link"
            icon="link"
            pressedIcon="link"
            isPressed={toolbar.link}
            onPressedChange={() => toggleToolbar('link')}
            isIconOnly
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Reactions
        </Text>
        <Stack direction="horizontal" gap={2}>
          <ToggleButton
            label="Star"
            icon="crown"
            pressedIcon="crown"
            isPressed={reactions.star}
            onPressedChange={() => toggleReaction('star')}
            isIconOnly
          />
          <ToggleButton
            label="Like"
            icon="crown"
            pressedIcon="crown"
            isPressed={reactions.heart}
            onPressedChange={() => toggleReaction('heart')}
            isIconOnly
          />
          <ToggleButton
            label="Save"
            icon="add-pin"
            pressedIcon="add-pin"
            isPressed={reactions.bookmark}
            onPressedChange={() => toggleReaction('bookmark')}
            isIconOnly
          />
          <ToggleButton
            label="Follow"
            icon="notifications"
            pressedIcon="notifications"
            isPressed={reactions.bell}
            onPressedChange={() => toggleReaction('bell')}
            isIconOnly
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
