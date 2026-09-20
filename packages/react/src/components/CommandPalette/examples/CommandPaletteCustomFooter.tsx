import {useMemo} from 'react';
import {CommandPalette} from '../CommandPalette.js';
import {CommandPaletteFooter} from '../../CommandPaletteFooter/CommandPaletteFooter.js';
import {Text} from '../../Text/Text.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';

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
          <Text variant="small">Pro tip: use ⌘K to open anywhere</Text>
        </CommandPaletteFooter>
      }
    />
  );
}
