'use client';

import {ToggleButton} from '@tecton/react/ToggleButton';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {CrownIcon} from '@tecton/react/icons';

export function ToggleButtonStates() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Default
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center">
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            pressedIcon={<Icon icon={CrownIcon} />}
            isPressed={false}
            onPressedChange={() => {}}
          />
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            pressedIcon={<Icon icon={CrownIcon} />}
            isPressed={false}
            onPressedChange={() => {}}
            isIconOnly
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Pressed
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center">
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            pressedIcon={<Icon icon={CrownIcon} />}
            isPressed={true}
            onPressedChange={() => {}}
          />
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            pressedIcon={<Icon icon={CrownIcon} />}
            isPressed={true}
            onPressedChange={() => {}}
            isIconOnly
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Disabled
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center">
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            isPressed={false}
            onPressedChange={() => {}}
            isDisabled
          />
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            isPressed={false}
            onPressedChange={() => {}}
            isIconOnly
            isDisabled
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Loading
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center">
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            isPressed={false}
            onPressedChange={() => {}}
            isLoading
          />
          <ToggleButton
            label="Favorite"
            icon={<Icon icon={CrownIcon} />}
            isPressed={false}
            onPressedChange={() => {}}
            isIconOnly
            isLoading
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
