import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {AutocompleteSearchable as SearchableItem} from '../../../support/index.js';

export function AutocompleteWithHelperText() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Department"
        placeholder="Search departments..."
        value={value}
        onChange={setValue}
        description="Select the department this request should be routed to"
      />
    </Center>
  );
}
