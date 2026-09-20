'use client';

import {
  CommandPaletteList,
  CommandPaletteGroup,
  CommandPaletteItem,
} from '@tecton/react/CommandPalette';

export function CommandPaletteGroupBasic() {
  return (
    <CommandPaletteList>
      <CommandPaletteGroup heading="Navigation">
        <CommandPaletteItem value="home" onSelect={() => {}}>
          Go to Home
        </CommandPaletteItem>
        <CommandPaletteItem value="dashboard" onSelect={() => {}}>
          Go to Dashboard
        </CommandPaletteItem>
      </CommandPaletteGroup>
      <CommandPaletteGroup heading="Actions">
        <CommandPaletteItem value="new-file" onSelect={() => {}}>
          New File
        </CommandPaletteItem>
        <CommandPaletteItem value="save-all" onSelect={() => {}}>
          Save All
        </CommandPaletteItem>
      </CommandPaletteGroup>
    </CommandPaletteList>
  );
}
