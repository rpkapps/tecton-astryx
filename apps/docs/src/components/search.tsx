'use client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import {useDocsSearch} from 'fumadocs-core/search/client';
import {staticClient} from 'fumadocs-core/search/client/orama-static';

/**
 * Search, without a server.
 *
 * The site is exported as static files, so there is nothing to query at request
 * time. `staticGET` writes the whole Orama index out as a build artefact at
 * `/api/search`, and this client downloads it the first time the dialog is
 * opened and runs every query in the browser.
 */
export default function TectonSearchDialog(props: SharedProps) {
  const {search, setSearch, query} = useDocsSearch({client: staticClient()});

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
