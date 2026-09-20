import {useMemo} from 'react';
import {CommandPalette} from '../../CommandPalette/CommandPalette.js';
import {Text} from '../../Text/Text.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';

export function CommandPaletteEmptyShowcase() {
  const emptySource = useMemo(() => createStaticSource([]), []);

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={emptySource}
      emptyBootstrapText={
        <Text variant="small" color="secondary">
          No commands available yet
        </Text>
      }
    />
  );
}
