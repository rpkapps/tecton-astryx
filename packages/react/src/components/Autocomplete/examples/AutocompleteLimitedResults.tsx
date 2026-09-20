import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const items: SearchableItem[] = [
  {id: '1', label: 'United States'},
  {id: '2', label: 'United Kingdom'},
  {id: '3', label: 'Canada'},
  {id: '4', label: 'Australia'},
  {id: '5', label: 'Germany'},
  {id: '6', label: 'France'},
  {id: '7', label: 'Japan'},
  {id: '8', label: 'Brazil'},
];

const searchSource: SearchSource = {
  search: (query: string) =>
    items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => items.slice(0, 5),
};

export function AutocompleteLimitedResults() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Country"
        placeholder="Search countries..."
        searchSource={searchSource}
        value={value}
        onChange={setValue}
        hasEntriesOnFocus
        maxMenuItems={3}
      />
    </Center>
  );
}
