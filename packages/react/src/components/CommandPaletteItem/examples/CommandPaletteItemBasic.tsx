import {CommandPaletteItem} from '../CommandPaletteItem.js';
import {CommandPaletteList} from '../../CommandPaletteList/CommandPaletteList.js';

export function CommandPaletteItemBasic() {
  return (
    <CommandPaletteList>
      <CommandPaletteItem value="new-file" onSelect={() => {}}>
        New File
      </CommandPaletteItem>
      <CommandPaletteItem value="open-recent" isHighlighted onSelect={() => {}}>
        Open Recent
      </CommandPaletteItem>
      <CommandPaletteItem value="save-all" onSelect={() => {}}>
        Save All
      </CommandPaletteItem>
      <CommandPaletteItem value="publish" isDisabled>
        Publish (disabled)
      </CommandPaletteItem>
    </CommandPaletteList>
  );
}
