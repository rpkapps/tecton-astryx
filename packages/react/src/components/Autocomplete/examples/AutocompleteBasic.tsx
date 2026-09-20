import {useState} from 'react';
import {Autocomplete, type AutocompleteOption} from '../Autocomplete.js';

const wells: AutocompleteOption[] = [
  {id: '15-9-19-a', label: '15/9-19 A'},
  {id: '15-9-19-bt2', label: '15/9-19 BT2'},
  {id: '15-9-f-11', label: '15/9-F-11'},
  {id: '25-2-6', label: '25/2-6'},
  {id: '34-10-23', label: '34/10-23'},
];

export function AutocompleteBasic() {
  const [well, setWell] = useState<AutocompleteOption | null>(null);

  return (
    <Autocomplete
      label="Well"
      options={wells}
      value={well}
      onChange={setWell}
      placeholder="Search wells"
      startIcon="search"
      debounceMs={0}
      width={280}
    />
  );
}
