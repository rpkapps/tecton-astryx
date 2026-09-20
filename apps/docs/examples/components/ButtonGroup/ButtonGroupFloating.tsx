'use client';

import {ButtonGroup} from '@tecton/react/ButtonGroup';
import {Button} from '@tecton/react/Button';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function ButtonGroupFloating() {
  return (
    <Stack direction="vertical" gap={3} hAlign="start">
      <Text type="supporting" color="secondary">
        The whole group shares one raised surface — a floating action bar
      </Text>
      <ButtonGroup label="Zoom controls" elevation="med">
        <Button label="Zoom out" />
        <Button label="Reset" />
        <Button label="Zoom in" />
      </ButtonGroup>
    </Stack>
  );
}
