import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {AutocompleteSearchable as SearchableItem} from '../../../support/index.js';

export function AutocompleteSearchField() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Team member"
        placeholder="Search people..."
        value={value}
        onChange={setValue}
        startIcon="search"
      />
    </Center>
  );
}
