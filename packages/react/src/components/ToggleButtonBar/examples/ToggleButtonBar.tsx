import {useState} from 'react';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {ToggleButton} from '../../ToggleButton/ToggleButton.js';
import {ToggleButtonBar} from '../ToggleButtonBar.js';

export function ToggleButtonGroupBlock() {
  const [view, setView] = useState<string | null>('list');
  const [formats, setFormats] = useState<string[]>(['bold']);

  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Single selection
        </Text>
        <ToggleButtonBar value={view} onChange={setView} label="View mode">
          <ToggleButton
            value="list"
            label="List view"
            icon={<Icon name={'list'} />}
            isIconOnly
          />
          <ToggleButton
            value="grid"
            label="Grid view"
            icon={<Icon name={'view-module'} />}
            isIconOnly
          />
          <ToggleButton
            value="table"
            label="Table view"
            icon={<Icon name={'view-column'} />}
            isIconOnly
          />
        </ToggleButtonBar>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Multiple selections
        </Text>
        <ToggleButtonBar
          type="multiple"
          value={formats}
          onChange={setFormats}
          label="Text formatting"
        >
          <ToggleButton
            value="bold"
            label="Bold"
            icon={<Icon name={'annotate'} />}
            isIconOnly
          />
          <ToggleButton
            value="italic"
            label="Italic"
            icon={<Icon name={'annotate'} />}
            isIconOnly
          />
          <ToggleButton
            value="underline"
            label="Underline"
            icon={<Icon name={'annotate'} />}
            isIconOnly
          />
          <ToggleButton
            value="strikethrough"
            label="Strikethrough"
            icon={<Icon name={'annotate'} />}
            isIconOnly
          />
        </ToggleButtonBar>
      </Stack>
    </Stack>
  );
}
