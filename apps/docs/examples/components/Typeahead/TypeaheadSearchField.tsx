'use client';

import {useState} from 'react';
import {Typeahead} from '@tecton/react/Typeahead';
import type {SearchableItem, SearchSource} from '@tecton/react/Typeahead';
import {Center} from '@tecton/react/Center';
import {SearchIcon} from '@tecton/react/icons';

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

export function TypeaheadSearchField() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  return (
    <Center width={320}>
      <Typeahead
        label="Team member"
        placeholder="Search people..."
        searchSource={searchSource}
        value={value}
        onChange={setValue}
        startIcon={SearchIcon}
        hasEntriesOnFocus
      />
    </Center>
  );
}
