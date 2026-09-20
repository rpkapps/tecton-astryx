'use client';

import {useState} from 'react';
import {Tokenizer} from '@tecton/react/Tokenizer';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import type {SearchableItem, SearchSource} from '@tecton/react/Typeahead';

const skills: SearchableItem[] = [
  {id: '1', label: 'React'},
  {id: '2', label: 'TypeScript'},
  {id: '3', label: 'GraphQL'},
  {id: '4', label: 'Node.js'},
  {id: '5', label: 'Python'},
  {id: '6', label: 'Rust'},
  {id: '7', label: 'Go'},
  {id: '8', label: 'Swift'},
];

const skillSource: SearchSource = {
  search: (query: string) =>
    skills.filter(s => s.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => skills,
};

const MAX_SKILLS = 3;

export function TokenizerMaxEntries() {
  const [value, setValue] = useState<SearchableItem[]>([skills[0], skills[1]]);

  return (
    <Stack direction="vertical" gap={2}>
      <Text type="supporting" color="secondary">
        Limited to {MAX_SKILLS} selections — {MAX_SKILLS - value.length}{' '}
        remaining
      </Text>
      <Tokenizer
        label="Top Skills"
        placeholder="Search skills..."
        description={`Choose up to ${MAX_SKILLS} skills`}
        searchSource={skillSource}
        value={value}
        onChange={items => setValue(items)}
        maxEntries={MAX_SKILLS}
        style={{width: 400}}
      />
    </Stack>
  );
}
