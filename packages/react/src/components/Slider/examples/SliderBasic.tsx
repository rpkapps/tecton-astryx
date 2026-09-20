import {useState} from 'react';
import {Slider} from '../Slider.js';

export function SliderBasic() {
  const [netToGross, setNetToGross] = useState(68);

  return (
    <Slider
      label="Net to gross"
      value={netToGross}
      onChange={value => setNetToGross(value as number)}
      formatValue={value => `${value}%`}
      width={280}
    />
  );
}
