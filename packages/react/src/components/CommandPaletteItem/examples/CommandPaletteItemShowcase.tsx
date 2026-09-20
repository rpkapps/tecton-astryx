import {useMemo, type CSSProperties} from 'react';
import {CommandPalette} from '../../CommandPalette/CommandPalette.js';
import {Kbd} from '../../Kbd/Kbd.js';
import {Text} from '../../Text/Text.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';
import type {AutocompleteSearchable as SearchableItem} from '../../../support/index.js';

const itemLabel: CSSProperties = {
  flexGrow: 1,
};

type CommandItem = SearchableItem<{shortcut?: string}>;

const commands: CommandItem[] = [
  {id: 'save', label: 'Save File', auxiliaryData: {shortcut: 'mod+s'}},
  {
    id: 'find',
    label: 'Find in Files',
    auxiliaryData: {shortcut: 'mod+shift+f'},
  },
  {
    id: 'palette',
    label: 'Command Palette',
    auxiliaryData: {shortcut: 'mod+shift+p'},
  },
  {
    id: 'terminal',
    label: 'Toggle Terminal',
    auxiliaryData: {shortcut: 'ctrl+`'},
  },
  {id: 'sidebar', label: 'Toggle Sidebar', auxiliaryData: {shortcut: 'mod+b'}},
];

export function CommandPaletteItemShowcase() {
  const source = useMemo(() => createStaticSource(commands), []);

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={source}
      renderItem={(item: CommandItem) => (
        <>
          <Text variant="medium">{item.label}</Text>
          {item.auxiliaryData?.shortcut && (
            <Kbd keys={item.auxiliaryData.shortcut} />
          )}
        </>
      )}
    />
  );
}
