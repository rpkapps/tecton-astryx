import {useState} from 'react';
import {Select} from '../Select.js';

const OPTIONS = [
  {value: 'design', label: 'Design'},
  {value: 'engineering', label: 'Engineering'},
  {value: 'marketing', label: 'Marketing'},
  {value: 'operations', label: 'Operations'},
];

export function SelectBottomSheet() {
  const [value, setValue] = useState<string | undefined>();

  return (
    <div style={{width: 320, maxWidth: '100%'}}>
      <Select
        label="Team"
        options={OPTIONS}
        value={value}
        onChange={setValue}
        placeholder="Choose a team"
        presentation="bottom-sheet"
      />
    </div>
  );
}
