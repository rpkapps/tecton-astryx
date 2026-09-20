import {useState} from 'react';
import {Slider} from '../Slider.js';

export function SliderRangeSlider() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return <Slider label="Price range" value={value} onChange={setValue} />;
}
