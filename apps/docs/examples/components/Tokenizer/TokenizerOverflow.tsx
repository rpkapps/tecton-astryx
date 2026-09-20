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
  {id: '6', label: 'Frank Miller'},
];

const userSource: SearchSource = {
  search: (query: string) =>
    users.filter(u => u.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => users,
};

export function TokenizerOverflow() {
  const [inlineValue, setInlineValue] = useState<SearchableItem[]>(users);
  const [layerValue, setLayerValue] = useState<SearchableItem[]>(users);

  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Inline overflow — content shifts down on expand
        </Text>
        <Tokenizer
          label="Inline Overflow"
          placeholder="Add more..."
          searchSource={userSource}
          value={inlineValue}
          onChange={items => setInlineValue(items)}
          tokenOverflowBehavior="unfocusedInline"
          style={{width: 400, maxWidth: 400}}
        />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Layer overflow — expands as overlay, no layout shift
        </Text>
        <Tokenizer
          label="Layer Overflow"
          placeholder="Add more..."
          searchSource={userSource}
          value={layerValue}
          onChange={items => setLayerValue(items)}
          tokenOverflowBehavior="unfocusedLayer"
          style={{width: 400, maxWidth: 400}}
        />
      </Stack>
    </Stack>
  );
}
