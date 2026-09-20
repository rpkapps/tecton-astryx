import {useState} from 'react';
import {Text} from '../../Text/Text.js';
import {ToggleButton} from '../../ToggleButton/ToggleButton.js';
import {ToggleButtonBar} from '../ToggleButtonBar.js';
import {VStack} from '../../VStack/VStack.js';

export function ToggleButtonBarShowcase() {
  const [view, setView] = useState<string | null>('grid');
  const [filters, setFilters] = useState<string[]>(['active']);

  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Text variant="smallStrong" color="secondary">
          Single select
        </Text>
        <ToggleButtonBar value={view} onChange={setView} label="View mode">
          <ToggleButton value="list" label="List" />
          <ToggleButton value="grid" label="Grid" />
          <ToggleButton value="board" label="Board" />
        </ToggleButtonBar>
      </VStack>
      <VStack gap={1}>
        <Text variant="smallStrong" color="secondary">
          Multi select
        </Text>
        <ToggleButtonBar
          type="multiple"
          value={filters}
          onChange={setFilters}
          label="Status filters"
        >
          <ToggleButton value="active" label="Active" />
          <ToggleButton value="pending" label="Pending" />
          <ToggleButton value="closed" label="Closed" />
        </ToggleButtonBar>
      </VStack>
    </VStack>
  );
}
