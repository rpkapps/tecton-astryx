import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {AutocompleteSearchable as SearchableItem} from '../../../support/index.js';

export function AutocompleteLimitedResults() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Country"
        placeholder="Search countries..."
        value={value}
        onChange={setValue}
      />
    </Center>
  );
}
