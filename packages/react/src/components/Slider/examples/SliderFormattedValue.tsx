import {useState} from 'react';
import {Slider} from '../Slider.js';

export function SliderFormattedValue() {
  const [value, setValue] = useState(72);
  return (
    <Slider
      label="Temperature"
      value={value}
      onChange={setValue}
      valueDisplay="text"
      min={60}
      max={90}
      step={1}
      formatValue={(v: number) => `${v}\u00B0F`}
    />
  );
}
