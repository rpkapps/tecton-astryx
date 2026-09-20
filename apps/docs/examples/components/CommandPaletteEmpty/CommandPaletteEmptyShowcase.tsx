'use client';

import {useMemo} from 'react';
import {CommandPalette} from '@tecton/react/CommandPalette';
import {Text} from '@tecton/react/Text';
import {createStaticSource} from '@tecton/react/Typeahead';

export function CommandPaletteEmptyShowcase() {
  const emptySource = useMemo(() => createStaticSource([]), []);

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={emptySource}
      emptyBootstrapText={
        <Text type="supporting" color="secondary">
          No commands available yet
        </Text>
      }
    />
  );
}
