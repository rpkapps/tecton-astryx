import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {TextField} from '../TextField.js';

export function TextFieldSearch() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('design systems');

  return (
    <div style={{width: 300}}>
      <Stack direction="vertical" gap={3}>
        <TextField
          label="Search field"
          value={query}
          onChange={setQuery}
          placeholder="Search projects…"
          startIcon={'search'}
          hasClear
        />
        <TextField
          label="Search field with value"
          value={filter}
          onChange={setFilter}
          placeholder="Filter…"
          startIcon={'search'}
          hasClear
        />
      </Stack>
    </div>
  );
}
