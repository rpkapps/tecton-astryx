import {CommandPaletteItem} from '../../CommandPaletteItem/CommandPaletteItem.js';
import {CommandPaletteList} from '../CommandPaletteList.js';

export function CommandPaletteListBasic() {
  return (
    <CommandPaletteList>
      <CommandPaletteItem value="home" onSelect={() => {}}>
        Go Home
      </CommandPaletteItem>
      <CommandPaletteItem value="settings" isHighlighted onSelect={() => {}}>
        Open Settings
      </CommandPaletteItem>
      <CommandPaletteItem value="profile" isSelected onSelect={() => {}}>
        View Profile
      </CommandPaletteItem>
      <CommandPaletteItem value="help" isDisabled onSelect={() => {}}>
        Help (unavailable)
      </CommandPaletteItem>
    </CommandPaletteList>
  );
}
