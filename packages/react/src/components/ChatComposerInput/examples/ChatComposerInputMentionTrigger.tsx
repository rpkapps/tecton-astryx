import {useState} from 'react';
import {AutocompleteItem} from '../../AutocompleteItem/AutocompleteItem.js';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../ChatComposerInput.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';
import type {
  AutocompleteSearchable as SearchableItem,
  ChatComposerTrigger,
} from '../../../support/index.js';

const USERS: SearchableItem<{role: string}>[] = [
  {id: 'cindy', label: 'Cindy Zhang', auxiliaryData: {role: 'Design Systems'}},
  {id: 'alex', label: 'Alex Johnson', auxiliaryData: {role: 'Frontend'}},
  {id: 'sam', label: 'Sam Rivera', auxiliaryData: {role: 'Backend'}},
  {id: 'jordan', label: 'Jordan Lee', auxiliaryData: {role: 'Product'}},
];

const userSource = createStaticSource(USERS);

export function ChatComposerInputMentionTrigger() {
  const [value, setValue] = useState('');

  const mentionTrigger: ChatComposerTrigger = {
    character: '@',
    searchSource: userSource,
    renderItem: item => (
      <AutocompleteItem
        item={item}
        description={(item.auxiliaryData as {role: string})?.role}
      />
    ),
    onSelect: item => ({
      value: `@${item.id}`,
      label: item.label,
      variant: 'blue' as const,
    }),
  };

  return (
    <Stack direction="vertical" gap={3} width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => setValue('')}
        input={
          <ChatComposerInput
            value={value}
            onChange={setValue}
            triggers={[mentionTrigger]}
            placeholder="Type @ to mention someone..."
          />
        }
      />
      <Text variant="small" color="secondary">
        Value: {JSON.stringify(value)}
      </Text>
    </Stack>
  );
}
