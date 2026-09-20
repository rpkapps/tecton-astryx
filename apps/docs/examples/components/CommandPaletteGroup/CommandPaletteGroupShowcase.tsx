'use client';

import {useMemo} from 'react';
import {CommandPalette} from '@tecton/react/CommandPalette';
import {createStaticSource} from '@tecton/react/Typeahead';

export function CommandPaletteGroupShowcase() {
  const source = useMemo(
    () =>
      createStaticSource([
        {
          id: 'index',
          label: 'index.tsx',
          auxiliaryData: {group: 'Recent Files'},
        },
        {id: 'app', label: 'App.tsx', auxiliaryData: {group: 'Recent Files'}},
        {
          id: 'settings',
          label: 'Open Settings',
          auxiliaryData: {group: 'Commands'},
        },
        {
          id: 'terminal',
          label: 'Toggle Terminal',
          auxiliaryData: {group: 'Commands'},
        },
        {
          id: 'theme',
          label: 'Color Theme',
          auxiliaryData: {group: 'Preferences'},
        },
        {id: 'font', label: 'Font Size', auxiliaryData: {group: 'Preferences'}},
      ]),
    [],
  );

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={source}
    />
  );
}
