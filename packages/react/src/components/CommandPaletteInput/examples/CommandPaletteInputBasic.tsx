import {useMemo} from 'react';
import {CommandPalette} from '../../CommandPalette/CommandPalette.js';
import {CommandPaletteInput} from '../CommandPaletteInput.js';
import {Kbd} from '../../Kbd/Kbd.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';

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
