import {useMemo} from 'react';
import {CommandPalette} from '../../CommandPalette/CommandPalette.js';
import {CommandPaletteFooter} from '../CommandPaletteFooter.js';
import {Text} from '../../Text/Text.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';

export function CommandPaletteFooterShowcase() {
  const source = useMemo(
    () =>
      createStaticSource([
        {id: 'new-file', label: 'New File'},
        {id: 'open-recent', label: 'Open Recent'},
        {id: 'save-all', label: 'Save All'},
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
          <Text variant="small" color="secondary">
            Tip: Press ⌘K anywhere to open the command palette
          </Text>
        </CommandPaletteFooter>
      }
    />
  );
}
