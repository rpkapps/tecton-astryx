import {useMemo} from 'react';
import {CommandPalette} from '../CommandPalette.js';
import {CommandPaletteInput} from '../../CommandPaletteInput/CommandPaletteInput.js';
import type {AutocompleteSource as SearchSource} from '../../../support/index.js';

const allFiles = [
  {id: 'readme', label: 'README.md'},
  {id: 'package', label: 'package.json'},
  {id: 'tsconfig', label: 'tsconfig.json'},
  {id: 'index', label: 'src/index.ts'},
  {id: 'app', label: 'src/App.tsx'},
];

export function CommandPaletteAsyncSearch() {
  const source = useMemo<SearchSource>(
    () => ({
      async search(query: string) {
        await new Promise(r => setTimeout(r, 400));
        return allFiles.filter(f =>
          f.label.toLowerCase().includes(query.toLowerCase()),
        );
      },
      bootstrap() {
        return [];
      },
    }),
    [],
  );

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={source}
      input={<CommandPaletteInput placeholder="Search files..." />}
      emptyBootstrapText="Type a filename to search"
      emptySearchText="No files found"
    />
  );
}
