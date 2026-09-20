import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const items: SearchableItem[] = [
  {id: '1', label: 'New York'},
  {id: '2', label: 'San Francisco'},
  {id: '3', label: 'London'},
  {id: '4', label: 'Berlin'},
  {id: '5', label: 'Tokyo'},
  {id: '6', label: 'Singapore'},
  {id: '7', label: 'Sydney'},
  {id: '8', label: 'Toronto'},
];

const searchSource: SearchSource = {
  search: (query: string) =>
    items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => items.slice(0, 5),
};

export function AutocompleteWithValidation() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Office"
        placeholder="Search offices..."
        searchSource={searchSource}
        value={value}
        onChange={setValue}
        status={{type: 'error', message: 'Please select an office location'}}
      />
    </Center>
  );
}
