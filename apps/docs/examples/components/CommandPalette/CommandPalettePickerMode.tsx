'use client';

import {useState, useMemo} from 'react';
import {CommandPalette} from '@tecton/react/CommandPalette';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {createStaticSource} from '@tecton/react/Typeahead';

export function CommandPalettePickerMode() {
  const [theme, setTheme] = useState('light');
  const source = useMemo(
    () =>
      createStaticSource([
        {id: 'light', label: 'Light'},
        {id: 'dark', label: 'Dark'},
        {id: 'system', label: 'System'},
      ]),
    [],
  );

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={source}
      value={theme}
      onValueChange={setTheme}
      renderItem={(item, isSelected) => (
        <>
          <Text type="body" style={{flex: 1}}>
            {item.label}
          </Text>
          {isSelected && <Icon icon="check" size="sm" />}
        </>
      )}
    />
  );
}
