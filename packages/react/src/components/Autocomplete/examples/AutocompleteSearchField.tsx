import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const items: SearchableItem[] = [
  {id: '1', label: 'Olivia Martin'},
  {id: '2', label: 'Jackson Lee'},
  {id: '3', label: 'Isabella Nguyen'},
  {id: '4', label: 'William Kim'},
  {id: '5', label: 'Sofia Davis'},
  {id: '6', label: 'Lucas Brown'},
  {id: '7', label: 'Mia Wilson'},
  {id: '8', label: 'Ethan Jones'},
];

const searchSource: SearchSource = {
  search: (query: string) =>
    items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => items.slice(0, 5),
};

export function AutocompleteSearchField() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Team member"
        placeholder="Search people..."
        searchSource={searchSource}
        value={value}
        onChange={setValue}
        startIcon={'search'}
        hasEntriesOnFocus
      />
    </Center>
  );
}
