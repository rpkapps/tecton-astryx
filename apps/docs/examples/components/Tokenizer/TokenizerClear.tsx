'use client';

import {useState} from 'react';
import {Tokenizer} from '@tecton/react/Tokenizer';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import type {SearchableItem, SearchSource} from '@tecton/react/Typeahead';

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

export function TokenizerClear() {
  const [value, setValue] = useState<SearchableItem[]>([users[0], users[1]]);

  return (
    <Stack direction="vertical" gap={2}>
      <Text type="supporting" color="secondary">
        Clear-all button appears when tokens are selected
      </Text>
      <Tokenizer
        label="Team Members"
        placeholder="Search people..."
        searchSource={userSource}
        value={value}
        onChange={items => setValue(items)}
        hasClear
        style={{width: 400}}
      />
    </Stack>
  );
}
