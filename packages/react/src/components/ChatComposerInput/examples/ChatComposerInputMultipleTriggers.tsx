import {useState} from 'react';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../ChatComposerInput.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';
import type {
  AutocompleteSearchable as SearchableItem,
  ChatComposerTrigger,
} from '../../../support/index.js';

const USERS: SearchableItem[] = [
  {id: 'cindy', label: 'Cindy Zhang'},
  {id: 'alex', label: 'Alex Johnson'},
  {id: 'sam', label: 'Sam Rivera'},
  {id: 'jordan', label: 'Jordan Lee'},
];

const COMMANDS: SearchableItem[] = [
  {id: 'summarize', label: 'summarize'},
  {id: 'translate', label: 'translate'},
  {id: 'search', label: 'search'},
  {id: 'code', label: 'code'},
];

const userSource = createStaticSource(USERS);
const commandSource = createStaticSource(COMMANDS);

export function ChatComposerInputMultipleTriggers() {
  const [value, setValue] = useState('');

  const mentionTrigger: ChatComposerTrigger = {
    character: '@',
    searchSource: userSource,
    onSelect: item => ({
      value: `@${item.id}`,
      label: item.label,
      variant: 'blue' as const,
    }),
  };

  const commandTrigger: ChatComposerTrigger = {
    character: '/',
    searchSource: commandSource,
    onSelect: item => ({
      value: `/${item.label}`,
      label: `/${item.label}`,
      variant: 'yellow' as const,
    }),
  };

  return (
    <Stack direction="vertical" gap={3} width={450} maxWidth="100%">
      <Text variant="small" color="secondary">
        Type @ for mentions (blue) or / for commands (yellow)
      </Text>
      <ChatComposer
        onSubmit={() => setValue('')}
        input={
          <ChatComposerInput
            value={value}
            onChange={setValue}
            triggers={[mentionTrigger, commandTrigger]}
            placeholder="Type @ or / ..."
          />
        }
      />
      <Text variant="small" color="secondary">
        Value: {JSON.stringify(value)}
      </Text>
    </Stack>
  );
}
