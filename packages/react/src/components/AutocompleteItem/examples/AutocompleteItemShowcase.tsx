import {useState} from 'react';
import {Autocomplete} from '../../Autocomplete/Autocomplete.js';
import {AutocompleteItem} from '../AutocompleteItem.js';
import {Avatar} from '../../Avatar/Avatar.js';
import {Center} from '../../Center/Center.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

interface PersonItem extends SearchableItem {
  auxiliaryData: {role: string};
}

const people: PersonItem[] = [
  {id: '1', label: 'Alice Johnson', auxiliaryData: {role: 'Engineer'}},
  {id: '2', label: 'Bob Smith', auxiliaryData: {role: 'Designer'}},
  {id: '3', label: 'Charlie Brown', auxiliaryData: {role: 'Product Manager'}},
  {id: '4', label: 'Diana Prince', auxiliaryData: {role: 'Data Scientist'}},
  {id: '5', label: 'Eve Davis', auxiliaryData: {role: 'QA Engineer'}},
];

const peopleSource: SearchSource<PersonItem> = {
  search: (query: string) =>
    people.filter(p => p.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => people.slice(0, 4),
};

export function AutocompleteItemShowcase() {
  const [value, setValue] = useState<PersonItem | null>(null);

  return (
    <Center width={320}>
      <Autocomplete
        label="Assignee"
        placeholder="Search people..."
        searchSource={peopleSource}
        value={value}
        onChange={setValue}
        renderItem={(item: PersonItem) => (
          <AutocompleteItem
            item={item}
            icon={<Avatar name={item.label} size={32} />}
            description={item.auxiliaryData.role}
          />
        )}
      />
    </Center>
  );
}
