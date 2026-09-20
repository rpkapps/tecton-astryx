'use client';

import {useMemo} from 'react';
import {
  CommandPalette,
  CommandPaletteFooter,
} from '@tecton/react/CommandPalette';
import {Text} from '@tecton/react/Text';
import {createStaticSource} from '@tecton/react/Typeahead';

export function CommandPaletteCustomFooter() {
  const source = useMemo(
    () =>
      createStaticSource([
        {id: 'home', label: 'Home'},
        {id: 'settings', label: 'Settings'},
      ]),
    [],
  );

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={source}
      footer={
        <CommandPaletteFooter>
          <Text type="supporting">Pro tip: use ⌘K to open anywhere</Text>
        </CommandPaletteFooter>
      }
    />
  );
}
