import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import type {AutocompleteSearchable as SearchableItem} from '../../../support/index.js';

export function AutocompleteShowcase() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <div style={{width: 320}}>
      <Autocomplete
        label="Fruit"
        placeholder="Search fruits..."
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
