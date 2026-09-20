'use client';

import {useMemo} from 'react';
import {
  CommandPalette,
  CommandPaletteInput,
} from '@tecton/react/CommandPalette';
import {Kbd} from '@tecton/react/Kbd';
import {createStaticSource} from '@tecton/react/Typeahead';

export function CommandPaletteInputBasic() {
  const source = useMemo(
    () =>
      createStaticSource([
        {id: 'home', label: 'Home'},
        {id: 'settings', label: 'Settings'},
        {id: 'profile', label: 'Profile'},
        {id: 'help', label: 'Help'},
      ]),
    [],
  );

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={source}
      input={
        <CommandPaletteInput
          placeholder="Search commands, files, or actions..."
          endContent={<Kbd keys="mod+k" />}
        />
      }
    />
  );
}
