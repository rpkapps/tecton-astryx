import {useState} from 'react';
import {CheckboxGroup} from '../CheckboxGroup.js';

export function CheckboxGroupBasic() {
  const [layers, setLayers] = useState<string[]>(['horizons']);

  return (
    <CheckboxGroup
      label="Layers"
      value={layers}
      onChange={setLayers}
      items={[
        {value: 'horizons', label: 'Horizons'},
        {value: 'faults', label: 'Faults'},
        {value: 'wells', label: 'Wells', description: 'Paths and picks'},
        {value: 'seismic', label: 'Seismic', isDisabled: true},
      ]}
    />
  );
}
