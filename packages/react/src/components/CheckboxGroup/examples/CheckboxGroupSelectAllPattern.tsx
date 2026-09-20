import {useState} from 'react';
import {Checkbox} from '../../Checkbox/Checkbox.js';
import {CheckboxGroup} from '../CheckboxGroup.js';
import {Divider} from '../../Divider/Divider.js';

const DOCUMENTS = [
  {id: 'transactions', label: 'Transaction history'},
  {id: 'statements', label: 'Account statements'},
  {id: 'tax', label: 'Tax documents'},
  {id: 'invoices', label: 'Invoices'},
];

const ALL_IDS = DOCUMENTS.map(d => d.id);

export function CheckboxGroupSelectAllPattern() {
  const [selected, setSelected] = useState<string[]>(['transactions']);

  const allChecked = ALL_IDS.every(id => selected.includes(id));
  const noneChecked = selected.length === 0;
  const selectAllState = allChecked
    ? true
    : noneChecked
      ? false
      : ('indeterminate' as const);

  return (
    <CheckboxGroup label="Include in export">
      <Checkbox
        label="Select all"
        isChecked={selectAllState}
        onCheck={checked => {
          setSelected(checked ? [...ALL_IDS] : []);
        }}
      />
      <Divider />
      {DOCUMENTS.map(doc => (
        <Checkbox
          key={doc.id}
          label={doc.label}
          isChecked={selected.includes(doc.id)}
          onCheck={checked => {
            setSelected(prev =>
              checked ? [...prev, doc.id] : prev.filter(v => v !== doc.id),
            );
          }}
        />
      ))}
    </CheckboxGroup>
  );
}
