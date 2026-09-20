import {useState} from 'react';
import {Chip} from '../Chip.js';
import {HStack} from '../../HStack/HStack.js';

export function ChipRemovable() {
  const [filters, setFilters] = useState(['Troll West', 'Jurassic', 'P50']);

  return (
    <HStack gap={1} align="center">
      {filters.map(filter => (
        <Chip
          key={filter}
          label={filter}
          onRemove={() => setFilters(rest => rest.filter(f => f !== filter))}
        />
      ))}
    </HStack>
  );
}
