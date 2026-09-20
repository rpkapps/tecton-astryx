import {useState, useMemo} from 'react';
import {CommandPalette} from '../CommandPalette.js';
import {Icon} from '../../Icon/Icon.js';
import {Text} from '../../Text/Text.js';
import {createAutocompleteSource as createStaticSource} from '../../../support/index.js';

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
          <Text variant="medium">{item.label}</Text>
          {isSelected && <Icon name="check" size={16} />}
        </>
      )}
    />
  );
}
