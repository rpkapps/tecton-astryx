import {useState} from 'react';
import {Autocomplete} from '../Autocomplete.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const fruits: SearchableItem[] = [
  {id: '1', label: 'Apple'},
  {id: '2', label: 'Banana'},
  {id: '3', label: 'Cherry'},
  {id: '4', label: 'Date'},
  {id: '5', label: 'Elderberry'},
  {id: '6', label: 'Fig'},
  {id: '7', label: 'Grape'},
  {id: '8', label: 'Honeydew'},
];

const fruitSource: SearchSource = {
  search: (query: string) =>
    fruits.filter(f => f.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => fruits.slice(0, 5),
};

export function AutocompleteShowcase() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <div style={{width: 320}}>
      <Autocomplete
        label="Fruit"
        placeholder="Search fruits..."
        searchSource={fruitSource}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
