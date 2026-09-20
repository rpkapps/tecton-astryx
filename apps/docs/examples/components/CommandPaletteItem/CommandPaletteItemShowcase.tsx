'use client';

import {useMemo, type CSSProperties} from 'react';
import {CommandPalette} from '@tecton/react/CommandPalette';
import {Text} from '@tecton/react/Text';
import {Kbd} from '@tecton/react/Kbd';
import {createStaticSource} from '@tecton/react/Typeahead';
import type {SearchableItem} from '@tecton/react/Typeahead';

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
          <Text type="body" style={itemLabel}>
            {item.label}
          </Text>
          {item.auxiliaryData?.shortcut && (
            <Kbd keys={item.auxiliaryData.shortcut} />
          )}
        </>
      )}
    />
  );
}
