import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import {Center} from '../../Center/Center.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const items: SearchableItem[] = [
  {id: '1', label: 'Engineering'},
  {id: '2', label: 'Design'},
  {id: '3', label: 'Marketing'},
  {id: '4', label: 'Sales'},
  {id: '5', label: 'Product'},
  {id: '6', label: 'Finance'},
  {id: '7', label: 'Legal'},
  {id: '8', label: 'Operations'},
];

const searchSource: SearchSource = {
  search: (query: string) =>
    items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => items.slice(0, 5),
};

export function AutocompleteWithHelperText() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Autocomplete
        label="Department"
        placeholder="Search departments..."
        searchSource={searchSource}
        value={value}
        onChange={setValue}
        description="Select the department this request should be routed to"
      />
    </Center>
  );
}
