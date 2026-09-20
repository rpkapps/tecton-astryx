'use client';

import {useState} from 'react';
import {ToggleButton, ToggleButtonGroup} from '@tecton/react/ToggleButton';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {
  FilterIcon,
  MapIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from '@tecton/react/icons';

export function ToggleButtonLabel() {
  const [isVisible, setIsVisible] = useState(true);
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Standalone with label and icon
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center">
          <ToggleButton
            label="Visible"
            icon={<Icon icon={VisibilityIcon} />}
            pressedIcon={<Icon icon={VisibilityOffIcon} />}
            isPressed={isVisible}
            onPressedChange={setIsVisible}
          >
            {isVisible ? 'Visible' : 'Hidden'}
          </ToggleButton>
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Labeled group — filter toolbar
        </Text>
        <ToggleButtonGroup
          type="multiple"
          value={filters}
          onChange={setFilters}
          label="Filters"
        >
          <ToggleButton
            value="filter"
            label="Filter"
            icon={<Icon icon={FilterIcon} />}
          >
            Filter
          </ToggleButton>
          <ToggleButton
            value="nearby"
            label="Nearby"
            icon={<Icon icon={MapIcon} />}
          >
            Nearby
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
