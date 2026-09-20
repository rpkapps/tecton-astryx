import {useMemo} from 'react';
import {CommandPalette} from '../CommandPalette.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';

// Remove isInline for production — command palettes should be modal.
export function CommandPaletteShowcase() {
  const source = useMemo(
    () =>
      createStaticSource([
        {id: 'home', label: 'Home'},
        {id: 'settings', label: 'Settings'},
        {id: 'profile', label: 'Profile'},
        {id: 'dashboard', label: 'Dashboard'},
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
    />
  );
}
