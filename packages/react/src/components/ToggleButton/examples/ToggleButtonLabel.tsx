import {useState} from 'react';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {ToggleButton} from '../ToggleButton.js';
import {ToggleButtonBar} from '../../ToggleButtonBar/ToggleButtonBar.js';

export function ToggleButtonLabel() {
  const [isVisible, setIsVisible] = useState(true);
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Standalone with label and icon
        </Text>
        <Stack direction="horizontal" gap={3}>
          <ToggleButton
            label="Visible"
            icon={<Icon name={'visibility'} />}
            pressedIcon={<Icon name={'visibility-off'} />}
            isPressed={isVisible}
            onPressedChange={setIsVisible}
          >
            {isVisible ? 'Visible' : 'Hidden'}
          </ToggleButton>
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Labeled group — filter toolbar
        </Text>
        <ToggleButtonBar
          type="multiple"
          value={filters}
          onChange={setFilters}
          label="Filters"
        >
          <ToggleButton
            value="filter"
            label="Filter"
            icon={<Icon name={'filter'} />}
          >
            Filter
          </ToggleButton>
          <ToggleButton
            value="nearby"
            label="Nearby"
            icon={<Icon name={'map'} />}
          >
            Nearby
          </ToggleButton>
        </ToggleButtonBar>
      </Stack>
    </Stack>
  );
}
