import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {ToggleButton} from '../ToggleButton.js';

export function ToggleButtonStates() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Default
        </Text>
        <Stack direction="horizontal" gap={3}>
          <ToggleButton
            label="Favorite"
            icon="crown"
            pressedIcon="crown"
            isPressed={false}
            onPressedChange={() => {}}
          />
          <ToggleButton
            label="Favorite"
            icon="crown"
            pressedIcon="crown"
            isPressed={false}
            onPressedChange={() => {}}
            isIconOnly
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Pressed
        </Text>
        <Stack direction="horizontal" gap={3}>
          <ToggleButton
            label="Favorite"
            icon="crown"
            pressedIcon="crown"
            isPressed={true}
            onPressedChange={() => {}}
          />
          <ToggleButton
            label="Favorite"
            icon="crown"
            pressedIcon="crown"
            isPressed={true}
            onPressedChange={() => {}}
            isIconOnly
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Disabled
        </Text>
        <Stack direction="horizontal" gap={3}>
          <ToggleButton
            label="Favorite"
            icon="crown"
            isPressed={false}
            onPressedChange={() => {}}
            isDisabled
          />
          <ToggleButton
            label="Favorite"
            icon="crown"
            isPressed={false}
            onPressedChange={() => {}}
            isIconOnly
            isDisabled
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Loading
        </Text>
        <Stack direction="horizontal" gap={3}>
          <ToggleButton
            label="Favorite"
            icon="crown"
            isPressed={false}
            onPressedChange={() => {}}
          />
          <ToggleButton
            label="Favorite"
            icon="crown"
            isPressed={false}
            onPressedChange={() => {}}
            isIconOnly
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
