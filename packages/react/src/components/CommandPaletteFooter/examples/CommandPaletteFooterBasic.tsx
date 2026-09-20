import {useMemo} from 'react';
import {CommandPalette} from '../../CommandPalette/CommandPalette.js';
import {CommandPaletteFooter} from '../CommandPaletteFooter.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';

export function CommandPaletteFooterBasic() {
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
      footer={<CommandPaletteFooter />}
    />
  );
}
