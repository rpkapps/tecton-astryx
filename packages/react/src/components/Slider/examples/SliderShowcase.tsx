import {useState} from 'react';
import {Slider} from '../Slider.js';

export function SliderShowcase() {
  const [value, setValue] = useState(50);
  return <Slider label="Volume" value={value} onChange={setValue} />;
}
