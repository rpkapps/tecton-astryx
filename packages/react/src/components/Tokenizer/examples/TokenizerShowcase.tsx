import {useState} from 'react';
import {Tokenizer} from '../Tokenizer.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const source: SearchSource = {
  search: () => [],
  bootstrap: () => [],
};

export function TokenizerShowcase() {
  const [value, setValue] = useState<SearchableItem[]>([
    {id: '1', label: 'Design'},
    {id: '2', label: 'Engineering'},
  ]);
  return (
    <Tokenizer
      label="Tags"
      placeholder="Search..."
      searchSource={source}
      value={value}
      onChange={setValue}
      style={{width: 400}}
    />
  );
}
