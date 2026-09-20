import {useState} from 'react';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {Tokenizer} from '../Tokenizer.js';
import type {
  AutocompleteSearchable as SearchableItem,
  AutocompleteSource as SearchSource,
} from '../../../support/index.js';

const emptySource: SearchSource = {
  search: () => [],
  bootstrap: () => [],
};

const users: SearchableItem[] = [
  {id: '1', label: 'Alice Johnson'},
  {id: '2', label: 'Bob Smith'},
  {id: '3', label: 'Charlie Brown'},
  {id: '4', label: 'Diana Prince'},
  {id: '5', label: 'Eve Williams'},
];

const userSource: SearchSource = {
  search: (query: string) =>
    users.filter(u => u.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => users,
};

export function TokenizerCreatable() {
  const [tags, setTags] = useState<SearchableItem[]>([]);
  const [members, setMembers] = useState<SearchableItem[]>([]);

  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Free-text only
        </Text>
        <Tokenizer
          label="Tags"
          searchSource={emptySource}
          value={tags}
          onChange={items => setTags(items)}
          hasCreate
          placeholder="Type a tag and press Enter..."
          style={{width: 400}}
        />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Create or search
        </Text>
        <Tokenizer
          label="Team Members"
          searchSource={userSource}
          value={members}
          onChange={items => setMembers(items)}
          hasCreate
          hasEntriesOnFocus
          placeholder="Search or type a new name..."
          style={{width: 400}}
        />
      </Stack>
    </Stack>
  );
}
