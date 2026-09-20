'use client';

import {useState} from 'react';
import {TextInput} from '@tecton/react/TextInput';
import {Stack} from '@tecton/react/Layout';
import {SearchIcon} from '@tecton/react/icons';

export function TextInputSearch() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('design systems');

  return (
    <div style={{width: 300}}>
      <Stack direction="vertical" gap={3}>
        <TextInput
          label="Search field"
          value={query}
          onChange={setQuery}
          placeholder="Search projects…"
          startIcon={SearchIcon}
          hasClear
        />
        <TextInput
          label="Search field with value"
          value={filter}
          onChange={setFilter}
          placeholder="Filter…"
          startIcon={SearchIcon}
          hasClear
        />
      </Stack>
    </div>
  );
}
