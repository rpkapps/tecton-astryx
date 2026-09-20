import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {Tokenizer} from '../Tokenizer.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const users: SearchableItem[] = [
  {id: '1', label: 'Alice Johnson'},
  {id: '2', label: 'Bob Smith'},
  {id: '3', label: 'Charlie Brown'},
  {id: '4', label: 'Diana Prince'},
  {id: '5', label: 'Eve Williams'},
  {id: '6', label: 'Frank Miller'},
];

const userSource: SearchSource = {
  search: (query: string) =>
    users.filter(u => u.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => users,
};

export function TokenizerEndContent() {
  const [value, setValue] = useState<SearchableItem[]>([users[0], users[2]]);

  return (
    <Stack direction="vertical" gap={2}>
      <Text variant="small" color="secondary">
        Action button in the end slot
      </Text>
      <Tokenizer
        label="Team Members"
        placeholder="Search people..."
        searchSource={userSource}
        value={value}
        onChange={items => setValue(items)}
        endContent={<Button label="Apply" variant="primary" size="sm" />}
        style={{width: 400}}
      />
    </Stack>
  );
}
