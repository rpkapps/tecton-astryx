import {useState} from 'react';
import {ToggleButtonGroup} from '../ToggleButtonGroup.js';

export function ToggleButtonGroupBasic() {
  const [view, setView] = useState('map');

  return (
    <ToggleButtonGroup
      label="View"
      value={view}
      onChange={setView}
      items={[
        {value: 'map', label: 'Map', icon: 'map'},
        {value: 'section', label: 'Section', icon: 'layers'},
        {value: 'three-d', label: '3D', icon: 'three-d'},
      ]}
    />
  );
}
