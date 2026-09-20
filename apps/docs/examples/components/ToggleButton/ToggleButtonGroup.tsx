'use client';

import {useState} from 'react';
import {ToggleButton, ToggleButtonGroup} from '@tecton/react/ToggleButton';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {
  AnnotateIcon,
  ListIcon,
  ViewColumnIcon,
  ViewModuleIcon,
} from '@tecton/react/icons';

export function ToggleButtonGroupBlock() {
  const [view, setView] = useState<string | null>('list');
  const [formats, setFormats] = useState<string[]>(['bold']);

  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Single selection
        </Text>
        <ToggleButtonGroup value={view} onChange={setView} label="View mode">
          <ToggleButton
            value="list"
            label="List view"
            icon={<Icon icon={ListIcon} />}
            isIconOnly
          />
          <ToggleButton
            value="grid"
            label="Grid view"
            icon={<Icon icon={ViewModuleIcon} />}
            isIconOnly
          />
          <ToggleButton
            value="table"
            label="Table view"
            icon={<Icon icon={ViewColumnIcon} />}
            isIconOnly
          />
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Multiple selections
        </Text>
        <ToggleButtonGroup
          type="multiple"
          value={formats}
          onChange={setFormats}
          label="Text formatting"
        >
          <ToggleButton
            value="bold"
            label="Bold"
            icon={<Icon icon={AnnotateIcon} />}
            isIconOnly
          />
          <ToggleButton
            value="italic"
            label="Italic"
            icon={<Icon icon={AnnotateIcon} />}
            isIconOnly
          />
          <ToggleButton
            value="underline"
            label="Underline"
            icon={<Icon icon={AnnotateIcon} />}
            isIconOnly
          />
          <ToggleButton
            value="strikethrough"
            label="Strikethrough"
            icon={<Icon icon={AnnotateIcon} />}
            isIconOnly
          />
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
