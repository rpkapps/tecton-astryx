import {AutocompleteItem} from '../../AutocompleteItem/AutocompleteItem.js';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../ChatComposerInput.js';
import {Stack} from '../../Stack/Stack.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';
import type {
  AutocompleteSearchable as SearchableItem,
  ChatComposerTrigger,
} from '../../../support/index.js';

const COMMANDS: SearchableItem<{description: string}>[] = [
  {
    id: 'summarize',
    label: 'summarize',
    auxiliaryData: {description: 'Summarize the conversation'},
  },
  {
    id: 'translate',
    label: 'translate',
    auxiliaryData: {description: 'Translate text to another language'},
  },
  {
    id: 'search',
    label: 'search',
    auxiliaryData: {description: 'Search the web or documents'},
  },
  {
    id: 'code',
    label: 'code',
    auxiliaryData: {description: 'Generate or explain code'},
  },
  {
    id: 'help',
    label: 'help',
    auxiliaryData: {description: 'Show available commands'},
  },
];

const commandSource = createStaticSource(COMMANDS);

export function ChatComposerInputSlashCommands() {
  const commandTrigger: ChatComposerTrigger = {
    character: '/',
    searchSource: commandSource,
    renderItem: item => (
      <AutocompleteItem
        item={item}
        description={(item.auxiliaryData as {description: string})?.description}
      />
    ),
    onSelect: item => ({
      value: `/${item.label}`,
      label: `/${item.label}`,
      variant: 'yellow' as const,
    }),
  };

  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        input={
          <ChatComposerInput
            triggers={[commandTrigger]}
            placeholder="Type / for commands..."
          />
        }
      />
    </Stack>
  );
}
