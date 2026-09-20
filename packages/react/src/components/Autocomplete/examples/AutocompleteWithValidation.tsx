import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {AutocompleteSearchable as SearchableItem} from '../../../support/index.js';

export function AutocompleteWithValidation() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Office"
        placeholder="Search offices..."
        value={value}
        onChange={setValue}
        status={{type: 'error', message: 'Please select an office location'}}
      />
    </Center>
  );
}
